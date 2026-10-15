import { beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ client: vi.fn(), redirect: vi.fn() }));
vi.mock("@/lib/supabase/server", () => ({
  createSupabaseServerClient: mocks.client,
}));
vi.mock("next/navigation", () => ({ redirect: mocks.redirect }));
vi.mock("next/headers", () => ({
  headers: async () => new Headers({ host: "akicoches.com" }),
  cookies: vi.fn(),
}));
import { signOut } from "../src/app/[locale]/auth/actions";
import { updateRecoveredPassword } from "../src/app/[locale]/auth/recover/actions";

describe("rental auth session logout scope", () => {
  const logout = vi.fn();
  const getUser = vi.fn();
  const updateUser = vi.fn();
  beforeEach(() => {
    vi.resetAllMocks();
    logout.mockResolvedValue({ error: null });
    getUser.mockResolvedValue({ data: { user: { id: "fixture-renter" } } });
    updateUser.mockResolvedValue({ error: null });
    mocks.client.mockResolvedValue({
      auth: { signOut: logout, getUser, updateUser },
    });
    mocks.redirect.mockImplementation((url: string) => {
      throw new Error(`redirect:${url}`);
    });
  });

  it("ordinary product logout requests only the current session and retains its local landing", async () => {
    const form = new FormData();
    form.set("locale", "en");
    await expect(signOut(form)).rejects.toThrow("redirect:/?lang=en");
    expect(logout).toHaveBeenCalledExactlyOnceWith({ scope: "local" });
  });

  it("successful password recovery explicitly revokes all sessions after verifying and updating the user", async () => {
    const form = new FormData();
    for (const [key, value] of Object.entries({
      locale: "en",
      next: "/account",
      password: "FixturePassword42",
      confirmPassword: "FixturePassword42",
    }))
      form.set(key, value);
    await expect(updateRecoveredPassword(form)).rejects.toThrow(
      "redirect:/en/auth?reset=1&next=%2Faccount",
    );
    expect(logout).toHaveBeenCalledExactlyOnceWith({ scope: "global" });
    expect(getUser.mock.invocationCallOrder[0]).toBeLessThan(
      updateUser.mock.invocationCallOrder[0],
    );
    expect(updateUser.mock.invocationCallOrder[0]).toBeLessThan(
      logout.mock.invocationCallOrder[0],
    );
  });

  it("an expired recovery link cannot update a password or revoke any session", async () => {
    getUser.mockResolvedValue({ data: { user: null } });
    const form = new FormData();
    for (const [key, value] of Object.entries({
      locale: "en",
      password: "FixturePassword42",
      confirmPassword: "FixturePassword42",
    }))
      form.set(key, value);
    await expect(updateRecoveredPassword(form)).rejects.toThrow(
      "error=recovery",
    );
    expect(updateUser).not.toHaveBeenCalled();
    expect(logout).not.toHaveBeenCalled();
  });
});
