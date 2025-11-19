import { expect, test } from "@playwright/test";

test.describe("News page (REQ-002)", () => {
  test("list structure and ordering (TC-UI-005)", async ({ page }) => {
    await page.goto("/news");

    const items = page.locator("article");
    const count = await items.count();
    expect(count).toBeGreaterThanOrEqual(5);

    // Verify fields
    await expect(items.first().getByRole("heading", { level: 2 })).toBeVisible();
    await expect(items.first().locator("p").first()).toBeVisible();
    await expect(items.first().getByRole("link")).toBeVisible();
  });

  test("filters and load more (TC-UI-006)", async ({ page }) => {
    await page.goto("/news");

    // Load more
    const loadMore = page.getByRole("button", { name: "Load more" }).or(page.getByRole("link", { name: "Load more" }));
    const btn = loadMore.first();
    await btn.waitFor({ state: "visible" });
    await btn.click({ force: true });
    const afterCount = await page.locator("article").count();
    expect(afterCount).toBeGreaterThanOrEqual(10);

    // Filters
    await page.getByRole("link", { name: "Tools", exact: true }).click();
    const filtered = page.locator("article");
    const filteredCount = await filtered.count();
    expect(filteredCount).toBeGreaterThanOrEqual(1);
  });

  test("SEO and structured data (TC-UI-007)", async ({ page }) => {
    await page.goto("/news");
    await expect(page).toHaveTitle(/AI-Dala News/);
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(canonical).toContain("/news");

    const ld = await page.locator('script[type="application/ld+json"]').textContent();
    expect(ld).toBeTruthy();
  });

  test("detail view and sharing (TC-UI-008)", async ({ page }) => {
    await page.goto("/news");
    await expect(page.locator("article").first()).toBeVisible();
    const firstLink = page.locator("article a").first();
    const href = await firstLink.getAttribute("href");
    expect(href).toContain("/news/");
    await firstLink.click({ force: true });
    await page.waitForURL("**/news/*");

    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible();
    await expect(page.getByText("Share on Telegram")).toBeVisible();
    await expect(page.getByText("Share on LinkedIn")).toBeVisible();

    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(canonical).toContain("/news/");

    const ld = await page.locator('script[type="application/ld+json"]').textContent();
    expect(ld).toBeTruthy();
  });
});
