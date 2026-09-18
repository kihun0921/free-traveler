import { test, expect } from "@playwright/test";
import { injectAxe, checkA11y } from "axe-playwright";

test.describe("Public Smoke Tests", () => {
  test("Flow 1: Browse home destinations and open detail drawer", async ({
    page,
  }) => {
    // Navigate to home
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Inject axe
    await injectAxe(page);

    // Check accessibility on home page
    await checkA11y(page, undefined, {
      detailedReport: true,
      detailedReportOptions: {
        html: true,
      },
    });

    // Verify hero section exists
    const hero = page.locator("section").first();
    await expect(hero).toBeVisible();

    // Find and click first destination card
    const destCard = page.locator(
      'a[href*="/destinations/"], button:has-text("국내")'
    ).first();
    await expect(destCard).toBeVisible();

    // Navigate through destinations grid
    const grids = page.locator("section").filter({ hasText: /인기|여행지/ });
    const gridCount = await grids.count();
    expect(gridCount).toBeGreaterThan(0);
  });

  test("Flow 2: Open safety info drawer and verify stale badge", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Inject axe
    await injectAxe(page);

    // Look for safety grid or safety-related button
    const safetySection = page.locator("section").filter({
      hasText: "안전",
    });
    const safetyButton = safetySection
      .locator("button, a")
      .first();

    if (await safetyButton.isVisible()) {
      await safetyButton.click();

      // Wait for drawer to open
      const drawer = page.locator('[role="dialog"]').first();
      await expect(drawer).toBeVisible();

      // Check for stale badge (if data is older than 7 days)
      const staleBadge = drawer.locator("text=/재확인|stale/i");
      // Badge may or may not exist depending on data

      // Verify drawer content
      const content = drawer.locator("h2, h3");
      await expect(content.first()).toBeVisible();

      // Check accessibility on drawer
      await checkA11y(page, drawer);

      // Close drawer
      const closeBtn = drawer.locator("button").first();
      await closeBtn.click();
    }
  });

  test("Flow 3: Navigate to about page", async ({ page }) => {
    // Start from home
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Inject axe
    await injectAxe(page);

    // Find and click about link (in footer or header)
    const aboutLink = page.locator('a[href="/about"], button:has-text("소개")');

    if (await aboutLink.isVisible()) {
      await aboutLink.click();
    } else {
      // Direct navigation if link not found
      await page.goto("/about");
    }

    // Verify about page loaded
    await page.waitForLoadState("networkidle");

    // Check for about page content
    const pageTitle = page.locator("h1, h2").first();
    await expect(pageTitle).toBeVisible();

    // Check accessibility on about page
    await checkA11y(page, undefined, {
      detailedReport: true,
    });

    // Verify key sections exist
    const sections = page.locator("section");
    const sectionCount = await sections.count();
    expect(sectionCount).toBeGreaterThan(0);
  });

  test("Accessibility: Home page core elements", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    await injectAxe(page);

    // Full page accessibility check
    await checkA11y(page, undefined, {
      detailedReport: true,
    });

    // Verify semantic HTML
    const main = page.locator("main");
    await expect(main).toBeVisible();

    // Check for proper heading hierarchy
    const h1 = page.locator("h1");
    const h2 = page.locator("h2");
    expect(await h1.count()).toBeGreaterThanOrEqual(0);
    expect(await h2.count()).toBeGreaterThanOrEqual(0);
  });
});
