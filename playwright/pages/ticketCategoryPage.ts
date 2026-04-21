import { Locator, Page } from '@playwright/test';
import { ActionUtils } from '../utils/actionUtils';
import { ticketCategoryLocators } from '../locators/ticketCategoryLocator';

export class TicketCategoryPage {
  private action: ActionUtils;

  constructor(private page: Page) {
    this.action = new ActionUtils(page);
  }

  async navigateToTicketCategory() {
    await this.action.click(ticketCategoryLocators.eventManagementMenu);
    await this.action.click(ticketCategoryLocators.ticketingMenu);
  }

  async clickEventManagementMenu() {
    const menu = this.page.locator(ticketCategoryLocators.eventManagementMenu);
    await menu.waitFor({ state: 'visible', timeout: 30000 });
    await menu.scrollIntoViewIfNeeded();
    try {
      await menu.click({ timeout: 30000 });
    } catch {
      await menu.click({ force: true, timeout: 30000 });
    }
    await this.page.locator(ticketCategoryLocators.ticketingMenu).waitFor({ state: 'visible', timeout: 30000 });
  }

  async clickTicketingMenu() {
    const menu = this.page.locator(ticketCategoryLocators.ticketingMenu);
    await menu.waitFor({ state: 'visible', timeout: 30000 });
    if (!(await menu.isEnabled())) {
      throw new Error('Ticketing menu is visible but not enabled/clickable');
    }
    await menu.scrollIntoViewIfNeeded();
    try {
      await menu.click({ timeout: 30000 });
    } catch {
      await menu.click({ force: true, timeout: 30000 });
    }
    await this.page.locator(ticketCategoryLocators.createTicketCategoryButton).waitFor({ state: 'visible', timeout: 30000 });
  }

  async waitForTicketCategoryPage() {
    return this.page.locator(ticketCategoryLocators.createTicketCategoryButton).isVisible();
  }

  async clickCreateTicketCategory() {
    const button = this.page.locator(ticketCategoryLocators.createTicketCategoryButton);
    await button.waitFor({ state: 'visible', timeout: 30000 });
    if (!(await button.isEnabled())) {
      throw new Error('Create Ticket Category button is visible but not enabled/clickable');
    }
    await button.scrollIntoViewIfNeeded();
    try {
      await button.click({ timeout: 30000 });
    } catch {
      await button.click({ force: true, timeout: 30000 });
    }
    await this.page.locator(ticketCategoryLocators.categoryDesignationInput).waitFor({ state: 'visible', timeout: 30000 });
  }

  async enterCategoryName(name: string) {
    await this.page.locator(ticketCategoryLocators.categoryDesignationInput).waitFor({ state: 'visible', timeout: 30000 });
    await this.action.fill(ticketCategoryLocators.categoryDesignationInput, name);
  }

  async enterCategoryDescription(description: string) {
    await this.action.fill(ticketCategoryLocators.categoryDescriptionInput, description);
  }

  async clickCreateButton() {
    const button = this.page.locator(ticketCategoryLocators.createButton);
    await button.waitFor({ state: 'visible', timeout: 30000 });
    await button.scrollIntoViewIfNeeded();
    try {
      await button.click({ timeout: 30000 });
    } catch {
      await button.click({ force: true, timeout: 30000 });
    }
  }

  async createTicketCategory(name: string, description: string) {
    await this.enterCategoryName(name);
    await this.enterCategoryDescription(description);
    await this.clickCreateButton();
  }

  async isCategoryListed(name: string): Promise<boolean> {
    await this.page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});

    const headingLocator = this.page.getByRole('heading', { name, exact: true }).first();
    if (await this.waitForVisible(headingLocator, 10000)) {
      return true;
    }

    const textLocator = this.page.getByText(name, { exact: true }).first();
    if (await this.waitForVisible(textLocator, 5000)) {
      return true;
    }

    await this.page.reload({ waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => {});
    await this.page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});

    return this.waitForVisible(this.page.getByRole('heading', { name, exact: true }).first(), 10000);
  }

  private async waitForVisible(locator: Locator, timeout: number): Promise<boolean> {
    try {
      await locator.waitFor({ state: 'visible', timeout });
      return await locator.isVisible();
    } catch {
      return false;
    }
  }
}
