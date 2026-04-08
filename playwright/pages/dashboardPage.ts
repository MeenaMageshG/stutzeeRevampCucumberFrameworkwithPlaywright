import { Page } from '@playwright/test';
import { ActionUtils } from '../utils/actionUtils';
import { dashboardLocators } from '../locators/dashboardLocators';

export class DashboardPage {
  private action: ActionUtils;

  constructor(private page: Page) {
    this.action = new ActionUtils(page);
  }

  async clickHamburgerMenu() {
    await this.page.locator(dashboardLocators.hamburgerMenu).waitFor();
    await this.action.click(dashboardLocators.hamburgerMenu);
  }

  async clickEventsMenu() {
    await this.page.locator(dashboardLocators.eventsMenu).waitFor();
    await this.action.click(dashboardLocators.eventsMenu);
  }

  async selectFirstEvent() {
    const events = this.page.locator(dashboardLocators.eventCard);
    await events.first().waitFor();
    await events.first().click();
  }
}