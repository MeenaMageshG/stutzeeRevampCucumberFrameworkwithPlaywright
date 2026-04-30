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
    await this.page.waitForLoadState('load');
    
    // Look for the first card/clickable element - typically an event card
    const eventCard = this.page.locator('div[class*="MuiCard"], div[class*="card"], article, li[class*="item"]').first();
    
    const exists = await eventCard.isVisible({ timeout: 5000 }).catch(() => false);
    
    if (exists) {
      await eventCard.click();
    } else {
      // Fallback: click the first visible button or link
      const clickable = this.page.locator('button, a, [role="button"]').first();
      await clickable.waitFor({ state: 'visible', timeout: 5000 });
      await clickable.click();
    }
  }
}