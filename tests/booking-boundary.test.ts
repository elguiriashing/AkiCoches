import { beforeEach, describe, expect, it, vi } from "vitest";
const { createClient } = vi.hoisted(() => ({ createClient: vi.fn() }));
vi.mock("@/lib/supabase/server", () => ({
  createSupabaseServerClient: createClient,
}));
import { POST } from "../src/app/api/car-rentals/bookings/route";
const valid = {
  vehicleId: "11111111-1111-4111-8111-111111111111",
  start: "2099-01-01",
  end: "2099-01-03",
  name: "Local test",
  phone: "+34 600 123 456",
  email: "fixture@example.invalid",
  note: "",
  idempotencyKey: "22222222-2222-4222-8222-222222222222",
};
function request(body: unknown = valid) {
  return new Request("https://akicoches.com/api/car-rentals/bookings", {
    method: "POST",
    headers: { origin: "https://akicoches.com" },
    body: JSON.stringify(body),
  });
}
describe("rental request authorization and authoritative quote", () => {
  beforeEach(() => vi.resetAllMocks());
  it("requires an authenticated renter", async () => {
    createClient.mockResolvedValue({
      auth: { getUser: async () => ({ data: { user: null } }) },
    });
    expect((await POST(request())).status).toBe(401);
  });
  it("requires verified contact email before database mutation", async () => {
    const rpc = vi.fn();
    createClient.mockResolvedValue({
      auth: {
        getUser: async () => ({
          data: {
            user: {
              id: "renter",
              email: "fixture@example.invalid",
              email_confirmed_at: null,
            },
          },
        }),
      },
      rpc,
    });
    expect((await POST(request())).status).toBe(403);
    expect(rpc).not.toHaveBeenCalled();
  });
  it("uses authenticated email, server quote RPC and stable idempotency instead of browser prices", async () => {
    const rpc = vi
      .fn()
      .mockResolvedValue({ data: "booking-fixture", error: null });
    createClient.mockResolvedValue({
      auth: {
        getUser: async () => ({
          data: {
            user: {
              id: "renter",
              email: "fixture@example.invalid",
              email_confirmed_at: "2098-12-01",
            },
          },
        }),
      },
      rpc,
    });
    const response = await POST(
      request({ ...valid, quoted_total_cents: 1, renter_id: "someone-else" }),
    );
    expect(response.status).toBe(201);
    expect(rpc).toHaveBeenCalledWith(
      "request_car_rental_booking",
      expect.objectContaining({
        p_contact_email: "fixture@example.invalid",
        p_idempotency_key: valid.idempotencyKey,
      }),
    );
    expect(rpc.mock.calls[0][1]).not.toHaveProperty("quoted_total_cents");
    expect(await response.json()).toEqual({
      bookingId: "booking-fixture",
      status: "requested",
    });
  });
  it("preserves overlap-conflict response without confirming a rental", async () => {
    createClient.mockResolvedValue({
      auth: {
        getUser: async () => ({
          data: {
            user: {
              id: "renter",
              email: "fixture@example.invalid",
              email_confirmed_at: "2098-12-01",
            },
          },
        }),
      },
      rpc: vi.fn().mockResolvedValue({ data: null, error: { code: "PT409" } }),
    });
    expect((await POST(request())).status).toBe(409);
  });
  it("rejects invalid date order before opening a session", async () => {
    expect((await POST(request({ ...valid, end: "2098-01-01" }))).status).toBe(
      400,
    );
    expect(createClient).not.toHaveBeenCalled();
  });
});

it("rejects absent or invalid email and phone before mutation", async () => {
  for (const details of [
    { email: "" },
    { phone: "" },
    { phone: "abc123" },
    { email: "wrong" },
  ]) {
    expect((await POST(request({ ...valid, ...details }))).status).toBe(400);
  }
  expect(createClient).not.toHaveBeenCalled();
});
