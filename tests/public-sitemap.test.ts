import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ client: vi.fn() }));
vi.mock("@/lib/supabase/public", () => ({ createSupabasePublicClient: mocks.client }));
import { GET } from "../src/app/sitemap.xml/route";
import { renderSitemap } from "../src/lib/sitemap";

beforeEach(() => {
  vi.resetAllMocks();
  vi.stubEnv("AKICOCHES_INDEXING_ENABLED", "false");
});
afterEach(() => vi.unstubAllEnvs());

describe("inventory-aware public sitemap", () => {
  it("retains static discovery without accessing a disabled inventory", async () => {
    mocks.client.mockImplementation(() => { throw new Error("provider unavailable"); });
    const response = await GET();
    const xml = await response.text();
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("application/xml; charset=utf-8");
    expect(xml).toContain("https://akicoches.com/membership");
    expect(xml).not.toContain("/map");
    expect(xml).not.toContain("/rentals/");
    expect(mocks.client).not.toHaveBeenCalled();
  });
  it("keeps static entries when the approved-inventory provider throws", async () => {
    vi.stubEnv("AKICOCHES_INDEXING_ENABLED", "true");
    mocks.client.mockImplementation(() => { throw new Error("provider unavailable"); });
    const response = await GET();
    expect(response.status).toBe(200);
    expect(await response.text()).toContain("https://akicoches.com/membership");
  });
  it("filters publication and active vehicles before listing approved inventory", async () => {
    vi.stubEnv("AKICOCHES_INDEXING_ENABLED", "true");
    const query = {
      select: vi.fn().mockReturnThis(), eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(), limit: vi.fn().mockResolvedValue({
        data: [{ slug: "real-branch", updated_at: null }], error: null,
      }),
    };
    const from = vi.fn().mockReturnValue(query);
    mocks.client.mockReturnValue({ from });
    const xml = await (await GET()).text();
    expect(from).toHaveBeenCalledWith("car_rental_companies");
    expect(query.eq).toHaveBeenCalledWith("status", "published");
    expect(query.eq).toHaveBeenCalledWith("vehicles.active", true);
    expect(xml).toContain("/rentals/real-branch");
  });
  it("requires explicit inventory approval in the renderer", () => {
    const rows = [{ slug: "test-branch", updated_at: null }];
    expect(renderSitemap(rows)).not.toContain("/rentals/");
    expect(renderSitemap(rows, true)).toContain("/rentals/test-branch");
    expect(renderSitemap(rows)).not.toContain("/account");
  });
});
