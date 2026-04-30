import { Page } from '@playwright/test';
import { ActionUtils } from '../utils/actionUtils';
import { dashboardLocators } from '../locators/dashboardLocators';

export class DashboardPage {
  private action: ActionUtils;

  constructor(private page: Page) {
    this.action = new ActionUtils(page);
  }

  async clickEventsMenu() {
    await this.page.locator(dashboardLocators.eventsMenu).waitFor();
    await this.action.click(dashboardLocators.eventsMenu);
  }

  async clickOrganizerMenu() {
    await this.page.locator(dashboardLocators.organizerMenu).waitFor();
    await this.action.click(dashboardLocators.organizerMenu);
  }

  async clickImpersonateButton() {
    await this.page.locator(dashboardLocators.organiserImpersonation).waitFor();
    await this.action.click(dashboardLocators.organiserImpersonation);
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

}
