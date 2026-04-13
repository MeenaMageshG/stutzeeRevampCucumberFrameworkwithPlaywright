import { Page } from '@playwright/test';

export class ActionUtils {
  constructor(private page: Page) {}

  async fill(locator: string, value: string) {
    const element = this.page.locator(locator);
    await element.waitFor({ state: 'visible', timeout: 30000 });
    await element.scrollIntoViewIfNeeded();
    await element.fill(value, { timeout: 30000 });
  }

  async click(locator: string) {
    const element = this.page.locator(locator);
    await element.waitFor({ state: 'visible', timeout: 30000 });
    await element.scrollIntoViewIfNeeded();
    await element.click({ timeout: 30000 });
  }

  async navigate(url: string) {
    await this.page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  }
}