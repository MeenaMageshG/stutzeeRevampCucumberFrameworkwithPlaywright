import { Page } from '@playwright/test';
import { ActionUtils } from '../utils/actionUtils';
import { dashboardLocators } from '../locators/dashboardLocators';

export class DashboardPage {
  private action: ActionUtils;

  constructor(private page: Page) {
    this.action = new ActionUtils(page);
  }

  async clickEventsMenu() {
    const eventLink = this.page.locator('a[href="/event"]').first();
    await eventLink.waitFor({ state: 'attached', timeout: 30000 });
    await eventLink.evaluate((node) => (node as HTMLAnchorElement).click());
    await this.page.waitForURL('**/event', { timeout: 30000 }).catch(() => {});
    await this.page.waitForLoadState('networkidle').catch(() => {});
    await this.page.waitForTimeout(1500);
  }

  async clickOrganizerMenu() {
    const organiserLink = this.page.locator('a[href="/organiser"]').first();
    await organiserLink.waitFor({ state: 'attached', timeout: 30000 });
    await organiserLink.evaluate((node) => (node as HTMLAnchorElement).click());
    await this.page.waitForURL('**/organiser', { timeout: 30000 }).catch(() => {});
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }

  async clickImpersonateButton() {
    await this.page.waitForSelector('button[aria-label="Impersonate"]', { state: 'attached', timeout: 30000 }).catch(() => {});
    await this.page.waitForLoadState('networkidle').catch(() => {});
    await this.page.waitForTimeout(750);

    const candidates = this.page.locator('button[aria-label="Impersonate"], button:has-text("Impersonate"), button[aria-label*="Impersonate" i]');
    const count = await candidates.count().catch(() => 0);

    for (let index = 0; index < count; index += 1) {
      const candidate = candidates.nth(index);
      if (await candidate.isVisible().catch(() => false)) {
        await candidate.scrollIntoViewIfNeeded().catch(() => {});
        await candidate.click({ timeout: 30000 }).catch(() => candidate.click({ force: true, timeout: 30000 }));
        return;
      }
    }

    throw new Error(`Impersonate button not found. Current URL: ${this.page.url()}`);
  }

  async selectFirstEvent() {
    await this.page.waitForLoadState('networkidle').catch(() => {});
    await this.page.waitForFunction(() => {
      const rows = Array.from(document.querySelectorAll('tr'));
      return rows.some((row) => /\d{2}\/\d{2}\/\d{4}/.test(row.textContent || ''));
    }, { timeout: 15000 }).catch(() => {});

    const firstEventTitle = this.page
      .locator('tr')
      .filter({ hasText: /\d{2}\/\d{2}\/\d{4}/ })
      .first()
      .locator('td')
      .first()
      .locator('p')
      .first();

    await firstEventTitle.waitFor({ state: 'visible', timeout: 15000 });
    await firstEventTitle.click({ timeout: 30000 });
    await this.page.waitForURL(
      (url) => url.toString().toLowerCase().includes('/event/'),
      { timeout: 10000 }
    ).catch(() => {});
    await this.page.waitForTimeout(1000);
  }

  private async clickFirstVisible(selectors: string[]) {
    for (const selector of selectors) {
      const candidate = this.page.locator(selector).first();
      if (await candidate.isVisible().catch(() => false)) {
        await candidate.scrollIntoViewIfNeeded().catch(() => {});
        await candidate.click({ timeout: 30000 }).catch(() => candidate.click({ force: true, timeout: 30000 }));
        return;
      }
    }

    throw new Error(`No visible match found for selectors: ${selectors.join(', ')}. Current URL: ${this.page.url()}`);
  }

}
