import { chromium } from "@playwright/test";
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
          throw new Error(`home ${response?.status()}`);
        await page.getByRole("link", { name: "AkiCoches home" }).waitFor();
        await page
          .getByRole("link", {
            name: locale === "es" ? "Abrir AkiBusiness" : "Open AkiBusiness",
          })
          .waitFor();
        if (
          (await page
            .getByRole("link", {
              name: locale === "es" ? "Abrir AkiBusiness" : "Open AkiBusiness",
            })
            .getAttribute("href")) !==
          `https://akibusiness.com/${locale}/business`
        )
          throw new Error("fleet handoff changed");
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
          authChannels.slice(0, 3).some((value) => value < 200)
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
        await page.getByRole("link", { name: "AkiCoches home" }).waitFor();
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
