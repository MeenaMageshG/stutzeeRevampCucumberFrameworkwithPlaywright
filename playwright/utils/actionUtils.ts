import { Page } from '@playwright/test';

export class ActionUtils {
  constructor(private page: Page) {}

  async fill(locator: string, value: string) {
    await this.page.locator(locator).fill(value);
  }

  async click(locator: string) {
    await this.page.locator(locator).click();
  }

  async navigate(url: string) {
    await this.page.goto(url);
  }
}