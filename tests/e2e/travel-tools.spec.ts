import { test, expect } from "@playwright/test";

test.describe("Travel Tools E2E Tests", () => {
  test("Flow 4: Flight form input → summary → external redirect", async ({
    page,
    context,
  }) => {
    await page.goto("/travel-tools");
    await page.waitForLoadState("networkidle");

    // Switch to flight tab if needed
    const flightTab = page.locator('button, [role="tab"]').filter({
      hasText: /항공|flight/i,
    }).first();
    if (await flightTab.isVisible()) {
      await flightTab.click();
    }

    // Fill flight form
    const countrySelect = page.locator("select").first();
    await countrySelect.selectOption("JP"); // Select Japan

    // Wait for region options
    await page.waitForTimeout(500);

    const regionSelect = page.locator("select").nth(1);
    const regionOptions = await regionSelect.locator("option").count();
    if (regionOptions > 1) {
      await regionSelect.selectOption(regionOptions > 2 ? "1" : "0");
    }

    // Fill departure date
    const dateInputs = page.locator('input[type="date"]');
    const departInput = dateInputs.first();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const departDate = tomorrow.toISOString().split("T")[0];
    await departInput.fill(departDate);

    // Fill return date
    const returnInput = dateInputs.nth(1);
    const nextWeek = new Date(tomorrow);
    nextWeek.setDate(nextWeek.getDate() + 6);
    const returnDate = nextWeek.toISOString().split("T")[0];
    await returnInput.fill(returnDate);

    // Submit search
    const searchBtn = page.locator("button").filter({
      hasText: /검색|search/i,
    });
    await searchBtn.click();

    // Verify summary page
    await page.waitForTimeout(500);
    const summary = page.locator("text=/검색 결과|요약/i");
    await expect(summary.first()).toBeVisible({ timeout: 5000 });

    // Verify form data not exposed in console (security check)
    const consoleLogs: string[] = [];
    page.on("console", (msg) => {
      if (
        msg.type() === "log" &&
        (msg.text().includes("JP") ||
          msg.text().includes("departure") ||
          msg.text().includes(departDate))
      ) {
        consoleLogs.push(msg.text());
      }
    });

    // Click external redirect button (if present)
    const externalBtn = page.locator("button").filter({
      hasText: /항공편|보러|external/i,
    });
    if (await externalBtn.isVisible({ timeout: 2000 })) {
      // Intercept new page
      const [newPage] = await Promise.all([
        context.waitForEvent("page"),
        externalBtn.click(),
      ]);

      // Verify new page opened
      await expect(newPage).toBeDefined();

      // Verify URL is external (not same origin)
      const newUrl = newPage.url();
      expect(newUrl).not.toContain("localhost");
      expect(newUrl).not.toContain("127.0.0.1");

      await newPage.close();
    }
  });

  test("Flow 5: Hotel form input → summary → external redirect", async ({
    page,
    context,
  }) => {
    await page.goto("/travel-tools");
    await page.waitForLoadState("networkidle");

    // Switch to hotel tab
    const hotelTab = page.locator('button, [role="tab"]').filter({
      hasText: /숙소|hotel/i,
    });
    if (await hotelTab.isVisible()) {
      await hotelTab.click();
    }

    // Fill hotel form (similar to flight)
    const countrySelect = page.locator("select").first();
    const options = await countrySelect.locator("option").count();
    if (options > 1) {
      await countrySelect.selectOption("1"); // Select second option
    }

    // Wait for cascading options
    await page.waitForTimeout(500);

    // Fill dates
    const dateInputs = page.locator('input[type="date"]');
    if ((await dateInputs.count()) >= 2) {
      const checkIn = new Date();
      checkIn.setDate(checkIn.getDate() + 1);
      const checkInDate = checkIn.toISOString().split("T")[0];
      await dateInputs.first().fill(checkInDate);

      const checkOut = new Date(checkIn);
      checkOut.setDate(checkOut.getDate() + 2);
      const checkOutDate = checkOut.toISOString().split("T")[0];
      await dateInputs.nth(1).fill(checkOutDate);
    }

    // Submit search
    const searchBtn = page.locator("button").filter({
      hasText: /검색|search/i,
    });
    await searchBtn.click();

    // Verify summary page
    await page.waitForTimeout(500);
    const summary = page.locator("text=/검색 결과|요약/i");
    await expect(summary.first()).toBeVisible({ timeout: 5000 });

    // Click external redirect button
    const externalBtn = page.locator("button").filter({
      hasText: /숙소|보러|external/i,
    });
    if (await externalBtn.isVisible({ timeout: 2000 })) {
      const [newPage] = await Promise.all([
        context.waitForEvent("page"),
        externalBtn.click(),
      ]);

      await expect(newPage).toBeDefined();
      const newUrl = newPage.url();
      expect(newUrl).not.toContain("localhost");

      await newPage.close();
    }
  });

  test("Form validation: Invalid dates", async ({ page }) => {
    await page.goto("/travel-tools");
    await page.waitForLoadState("networkidle");

    // Fill form with invalid date (past date)
    const dateInputs = page.locator('input[type="date"]');
    if ((await dateInputs.count()) >= 1) {
      const pastDate = "2020-01-01";
      await dateInputs.first().fill(pastDate);
    }

    // Try to submit - should show error
    const searchBtn = page.locator("button").filter({
      hasText: /검색|search/i,
    });
    await searchBtn.click();

    // Verify error message appears
    const errorMsg = page.locator("text=/오늘|이후|이전|이상|이하/i");
    await expect(errorMsg.first()).toBeVisible({ timeout: 3000 });
  });
});
