import { expect, test } from "@playwright/test";

const png = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFAAH/q842iQAAAABJRU5ErkJggg==",
  "base64",
);

test("US1: a sample processes end to end without any setup", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Blue Bottle Coffee/ }).click();

  await expect(page.getByRole("heading", { name: "Blue Bottle Coffee" })).toBeVisible({
    timeout: 20_000,
  });
  await expect(page.getByText("Auto-approved").first()).toBeVisible();
  await expect(page.getByText("Line items add up to the subtotal")).toBeVisible();
  await expect(page.getByText("$14.34")).toBeVisible();
});

test("US3: a failing check is shown with the numbers that disagree", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /Harbor Hardware/ }).click();

  await expect(page.getByText("Needs review").first()).toBeVisible({ timeout: 20_000 });
  await expect(page.getByText(/Subtotal plus tax is \$15\.23/)).toBeVisible();
  await expect(page.getByRole("link", { name: /Open it in the review queue/ })).toBeVisible();
});

test("US2: an uploaded file is processed", async ({ page }) => {
  await page.goto("/");
  await page
    .getByTestId("file-input")
    .setInputFiles({ name: "corner-store.png", mimeType: "image/png", buffer: png });

  await expect(page.getByRole("heading", { name: "Corner Store" })).toBeVisible({
    timeout: 20_000,
  });
  await expect(page.getByText("Auto-approved").first()).toBeVisible();
});

test("US2: an oversized file is rejected before upload", async ({ page }) => {
  await page.goto("/");
  await page
    .getByTestId("file-input")
    .setInputFiles({
      name: "huge.png",
      mimeType: "image/png",
      buffer: Buffer.alloc(6 * 1024 * 1024),
    });

  await expect(page.getByText(/larger than 5 MB/)).toBeVisible();
  await expect(page.getByRole("heading", { name: "Huge" })).toHaveCount(0);
});

test("US6: history search narrows the list", async ({ page }) => {
  await page.goto("/history");
  await page.getByPlaceholder("Vendor or file name").fill("pharmacy");

  await expect(page.getByRole("link", { name: /Corner Pharmacy/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /Blue Bottle Coffee/ })).toHaveCount(0);
});

test("US7: review search narrows the queue", async ({ page }) => {
  await page.goto("/review");
  await page.getByPlaceholder("Vendor or file name").fill("harbor");

  await expect(page.getByRole("link", { name: /Harbor Hardware/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /Corner Pharmacy/ })).toHaveCount(0);
});

test("US5: a flagged receipt can be corrected and approved", async ({ page }) => {
  await page.goto("/review");
  await page.getByRole("link", { name: /Harbor Hardware/ }).click();

  const vendor = page.getByLabel("Vendor");
  await vendor.fill("Harbor Hardware & Supply");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByText(/Validation re-ran/)).toBeVisible();

  await page.getByRole("button", { name: "Approve" }).click();
  await expect(page.getByText("Approved").first()).toBeVisible();
});

test("US8: the flow works at 375px without sideways scrolling", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/");
  await page.getByRole("button", { name: /Blue Bottle Coffee/ }).click();
  await expect(page.getByRole("heading", { name: "Blue Bottle Coffee" })).toBeVisible({
    timeout: 20_000,
  });

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});
