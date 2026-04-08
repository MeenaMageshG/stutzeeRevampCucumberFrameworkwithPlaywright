import { expect, Page } from '@playwright/test';

export class AssertionUtils {
  constructor(private page: Page) {}

  async verifyUrlContains(text: string) {
    await expect(this.page).toHaveURL(new RegExp(text));
  }

  async verifyElementVisible(locator: string) {
    await expect(this.page.locator(locator)).toBeVisible();
  }
}