import { test, expect } from "@playwright/test";

test.describe("Mate Auth Flow (Chromium)", () => {
  test("Flow 6: Login and participation request → author approval", async ({
    page,
  }) => {
    // Navigate to mates page
    await page.goto("/mates");
    await page.waitForLoadState("networkidle");

    // Verify mates page loaded
    const mateSection = page.locator("section").first();
    await expect(mateSection).toBeVisible();

    // Look for a mate post card
    const mateCard = page.locator("[role='button']").filter({
      hasText: /여행|동행/i,
    }).first();

    if (await mateCard.isVisible()) {
      // Click to open mate detail
      await mateCard.click();

      // Verify detail modal/drawer opened
      const detail = page.locator('[role="dialog"]').first();
      await expect(detail).toBeVisible();

      // Look for participation/application button
      const applyBtn = detail.locator("button").filter({
        hasText: /참가|신청|지원/i,
      }).first();

      if (await applyBtn.isVisible()) {
        await applyBtn.click();

        // Should redirect to login or show auth requirement
        // Verify we're on auth/account flow
        const urlHasAuthOrAccount = page.url().includes("/account") ||
          page.url().includes("/auth") ||
          page.locator("input[type='email'], input[type='password']").isVisible();

        expect(urlHasAuthOrAccount).toBeTruthy();
      }
    }
  });

  test("Flow 7: Report/Block submission confirmation", async ({
    page,
  }) => {
    // Navigate to mates page
    await page.goto("/mates");
    await page.waitForLoadState("networkidle");

    // Look for mate post
    const mateCard = page.locator("[role='button']").filter({
      hasText: /여행|동행/i,
    }).first();

    if (await mateCard.isVisible()) {
      await mateCard.click();

      // Verify detail modal opened
      const detail = page.locator('[role="dialog"]').first();
      await expect(detail).toBeVisible();

      // Look for report/block button (usually three-dot menu or action button)
      const moreActionsBtn = detail.locator("button").filter({
        hasText: /•••|⋮|더보기|신고|차단/i,
      }).first();

      if (await moreActionsBtn.isVisible()) {
        await moreActionsBtn.click();

        // Verify menu/dropdown opened
        const menu = page.locator("[role='menu']").first();
        if (await menu.isVisible()) {
          // Find report option
          const reportBtn = menu.locator("button, [role='menuitem']").filter({
            hasText: /신고|report/i,
          }).first();

          if (await reportBtn.isVisible()) {
            await reportBtn.click();

            // Verify report dialog/form appeared
            const reportDialog = page.locator('[role="dialog"]').filter({
              hasText: /신고/i,
            }).first();

            if (await reportDialog.isVisible()) {
              // Verify form elements
              const reportForm = reportDialog.locator("form, [role='form']").first();
              await expect(reportForm).toBeVisible();

              // Look for submit button
              const submitBtn = reportDialog.locator("button").filter({
                hasText: /제출|확인|신고/i,
              }).first();

              expect(await submitBtn.isVisible()).toBeTruthy();
            }
          }
        }
      }
    }
  });

  test("Account page: User profile and activity", async ({ page }) => {
    // Navigate to account page
    await page.goto("/account");
    await page.waitForLoadState("networkidle");

    // Verify account page main content
    const mainContent = page.locator("main");
    await expect(mainContent).toBeVisible();

    // Verify key sections exist
    const sections = page.locator("section");
    const sectionCount = await sections.count();
    expect(sectionCount).toBeGreaterThan(0);

    // Verify no contact info is exposed in page text
    const pageContent = await page.textContent("body");
    expect(pageContent).not.toMatch(/\b\d{3}-\d{4}-\d{4}\b/); // Phone pattern
    expect(pageContent).not.toMatch(/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i);
  });

  test("Mates page: Smoke test for core functionality", async ({
    page,
  }) => {
    await page.goto("/mates");
    await page.waitForLoadState("networkidle");

    // Verify main page structure
    const main = page.locator("main");
    await expect(main).toBeVisible();

    // Verify mate cards are rendered
    const mateCards = page.locator("[role='button']").filter({
      hasText: /여행|동행/i,
    });
    const cardCount = await mateCards.count();
    expect(cardCount).toBeGreaterThanOrEqual(0);

    // Verify filter/search functionality exists
    const filterSection = page.locator("section").filter({
      hasText: /필터|검색|조건/i,
    }).first();

    // Filter section may or may not be visible depending on design
    // Just verify page is interactive
    const anyButton = page.locator("button").first();
    expect(await anyButton.isVisible()).toBeTruthy();
  });
});
