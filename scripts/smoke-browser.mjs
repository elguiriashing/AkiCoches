import { chromium, expect } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
const base = process.env.SMOKE_BASE_URL || "http://127.0.0.1:3103";
const browser = await chromium.launch({
  executablePath:
    process.env.CHROMIUM_PATH ||
    (process.env.CI ? undefined : "/usr/bin/chromium"),
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const results = [];
try {
  for (const locale of ["es", "en"])
    for (const width of [390, 1440])
      for (const theme of ["light", "dark"]) {
        const page = await browser.newPage({
          viewport: { width, height: 900 },
        });
        await page.addInitScript(
          (theme) => localStorage.setItem("akipasa.theme", theme),
          theme,
        );
        await page.route("**/api/car-rentals?*", (route) =>
          route.fulfill({ json: { rows: [], total: 0 } }),
        );
        const response = await page.goto(`${base}/?lang=${locale}`, {
          waitUntil: "domcontentloaded",
        });
        if (response?.status() !== 200)
          throw new Error(`coming soon ${response?.status()}`);
        await page
          .getByRole("heading", {
            name: locale === "es"
              ? "Más libertad. Menos complicaciones."
              : "More freedom. Less hassle.",
          })
          .waitFor();
        await expect(
          page.getByRole("link", {
            name: locale === "es"
              ? "Tengo una empresa de alquiler"
              : "I run a rental business",
          }),
        ).toHaveAttribute("href", `/hq-login?lang=${locale}`);
        await expect(
          page.getByRole("button", {
            name: locale === "es"
              ? "Avisadme del lanzamiento"
              : "Notify me at launch",
          }),
        ).toBeDisabled(); // CI intentionally has no real Turnstile credentials.
        await mkdir("test-results/coches", { recursive: true });
        await page.screenshot({
          path: `test-results/coches/coming-soon-${locale}-${width}-${theme}.png`,
          fullPage: true,
        });
        // Preserve the legacy direct-search experience and its existing layout
        // and account regression checks without pretending it is the homepage.
        const deepLink = await page.goto(
          `${base}/?lang=${locale}&q=Fuengirola`,
          { waitUntil: "domcontentloaded" },
        );
        if (deepLink?.status() !== 200)
          throw new Error(`legacy search ${deepLink?.status()}`);
        await page
          .getByRole("link", {
            name: locale === "es" ? "Inicio de AkiCoches" : "AkiCoches home",
          })
          .waitFor();
        await page.waitForFunction(() =>
          Boolean(document.documentElement.dataset.theme),
        );
        const closeConsent = page.getByRole("button", {
          name:
            locale === "es"
              ? "Cerrar opciones de privacidad"
              : "Close privacy choices",
          exact: true,
        });
        // Each case has a fresh browser context and no stored consent decision.
        // Wait for consent hydration before dismissing it, then capture actual product layout.
        await closeConsent.waitFor({ state: "visible" });
        await closeConsent.click();
        await closeConsent.waitFor({ state: "hidden" });
        if (width >= 1024) {
          const rail = page.locator(".suite-discovery-nav");
          await expect(page.locator("[data-suite-header]")).toBeHidden();
          expect((await rail.boundingBox()).y).toBe(0);
          expect((await rail.boundingBox()).height).toBe(900);
          await expect(
            page.locator(".suite-discovery-brand img"),
          ).toHaveAttribute("src", "/brand/v3/coches.svg");
          await page
            .getByRole("button", {
              name:
                locale === "es" ? "Contraer barra lateral" : "Collapse sidebar",
              exact: true,
            })
            .click();
          await expect(rail).toHaveAttribute("data-compact", "true");
          await expect(
            page.locator(".suite-discovery-brand strong"),
          ).toBeHidden();
          await page.evaluate(() =>
            window.scrollTo(0, document.body.scrollHeight),
          );
          expect((await rail.boundingBox()).y).toBe(0);

          for (const control of await page
            .locator(
              ".suite-discovery-tools button,.suite-discovery-collapse,.suite-discovery-signin,.suite-discovery-menu > summary",
            )
            .all()) {
            const box = await control.boundingBox();
            expect(box.height).toBeGreaterThanOrEqual(44);
            expect(box.height).toBeLessThanOrEqual(64);
          }
          await page.setViewportSize({ width, height: 480 });
          await page.locator(".suite-discovery-menu summary").click();
          const menu = page.locator(".suite-discovery-popover");
          await expect(menu).toBeVisible();
          const bounds = await menu.boundingBox();
          expect(bounds.y).toBeGreaterThanOrEqual(0);
          expect(bounds.y + bounds.height).toBeLessThanOrEqual(480);
          await expect(
            menu.getByRole("navigation").getByRole("link"),
          ).toHaveCount(5);
          await page.keyboard.press("Escape");
          await expect(menu).toBeHidden();
          await page
            .getByRole("button", {
              name:
                locale === "es" ? "Expandir barra lateral" : "Expand sidebar",
              exact: true,
            })
            .click();
          await expect(rail).toHaveAttribute("data-compact", "false");
          await page.setViewportSize({ width, height: 900 });
          await page.evaluate(() => window.scrollTo(0, 0));
        }
        // The acquisition pathway is deliberately disclosed by the user, not an
        // always-visible duplicate fleet button. Verify the new interaction and
        // both canonical product roles after privacy controls are dismissed.
        await page
          .getByText(
            locale === "es" ? "¿Gestionas un negocio?" : "Run a business?",
            { exact: true },
          )
          .click();
        const management = page.getByRole("link", {
          name: locale === "es" ? "Abrir AkiHQ gratis" : "Open free AkiHQ",
          exact: true,
        });
        await management.waitFor();
        if (
          (await management.getAttribute("href")) !==
          `https://akihq.app/${locale}/business`
        )
          throw new Error("fleet handoff changed");
        const operations = page.getByRole("link", {
          name: locale === "es" ? "Abrir AkiBusiness" : "Open AkiBusiness",
          exact: true,
        });
        if (
          (await operations.getAttribute("href")) !==
          `https://akibusiness.com/?locale=${locale}`
        )
          throw new Error("operations handoff changed");
        const headingColor = await page
          .locator("h1")
          .evaluate((el) => getComputedStyle(el).color);
        const channels = headingColor.match(/\d+/g)?.map(Number) || [];
        if (
          channels.length < 3 ||
          (theme === "light"
            ? channels.slice(0, 3).some((value) => value > 80)
            : channels.slice(0, 3).some((value) => value < 200))
        )
          throw new Error(
            `unreadable rental heading ${headingColor} ${locale} ${theme}`,
          );
        const text = await page.locator("body").innerText();
        if (text.includes("AkiConduzco")) throw new Error("old visible brand");
        if (
          await page.evaluate(
            () => document.documentElement.scrollWidth > window.innerWidth,
          )
        )
          throw new Error(`overflow ${locale} ${width}`);
        await mkdir("test-results/coches", { recursive: true });
        await page.screenshot({
          path: `test-results/coches/home-${locale}-${width}-${theme}.png`,
          fullPage: true,
        });
        await page.goto(`${base}/account?lang=${locale}`, {
          waitUntil: "domcontentloaded",
        });
        if (!new URL(page.url()).pathname.endsWith(`/${locale}/auth`))
          throw new Error(`account auth return ${page.url()}`);
        if (new URL(page.url()).searchParams.get("next") !== "/account")
          throw new Error("account next lost");
        await page
          .getByRole("heading", {
            name:
              locale === "es"
                ? "Tu cuenta AkiCoches"
                : "Your AkiCoches account",
          })
          .waitFor();
        const authHeadingColor = await page
          .locator("h1")
          .evaluate((element) => getComputedStyle(element).color);
        const authChannels = authHeadingColor.match(/\d+/g)?.map(Number) || [];
        if (
          authChannels.length < 3 ||
          (theme === "light"
            ? authChannels.slice(0, 3).some((value) => value > 80)
            : authChannels.slice(0, 3).some((value) => value < 200))
        )
          throw new Error(
            `unreadable rental auth heading ${authHeadingColor} ${locale} ${theme}`,
          );
        await page.screenshot({
          path: `test-results/coches/auth-${locale}-${width}-${theme}.png`,
          fullPage: true,
        });
        const map = await page.goto(`${base}/map?lang=${locale}`, {
          waitUntil: "domcontentloaded",
        });
        if (map?.status() !== 200) throw new Error(`map ${map?.status()}`);
        await page
          .getByRole("link", {
            name: locale === "es" ? "Inicio de AkiCoches" : "AkiCoches home",
          })
          .waitFor();
        const mapBounds = await page.locator("main").boundingBox();
        const navBounds = await page
          .locator(".suite-discovery-nav")
          .boundingBox();
        if (!mapBounds || !navBounds)
          throw new Error("map navigation geometry missing");
        if (width < 1024 && mapBounds.y + mapBounds.height > navBounds.y + 1)
          throw new Error(
            `mobile map extends behind the navigation dock: ${JSON.stringify({ mapBounds, navBounds })}`,
          );
        if (width >= 1024 && mapBounds.x < navBounds.x + navBounds.width)
          throw new Error("desktop map extends behind the navigation rail");
        results.push({
          locale,
          width,
          theme,
          home: 200,
          account: "product auth redirect",
          map: 200,
          inventory: "explicit empty browser fixture",
        });
        await page.close();
      }
  await writeFile(
    "test-results/coches/browser.json",
    JSON.stringify(results, null, 2),
  );
  console.log(JSON.stringify(results, null, 2));
} finally {
  await browser.close();
}
