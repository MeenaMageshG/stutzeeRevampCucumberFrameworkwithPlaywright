import { Page } from '@playwright/test';
import { loginLocators } from '../locators/loginLocators';
import { dashboardLocators } from '../locators/dashboardLocators';
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
    } catch (error) {
      await menu.click({ force: true, timeout: 30000 });
    }
    await this.page.locator(ticketCategoryLocators.ticketingMenu).waitFor({ state: 'visible', timeout: 30000 });
  }

  async clickTicketingMenu() {
    const menu = this.page.locator(ticketCategoryLocators.ticketingMenu);
    await menu.waitFor({ state: 'visible', timeout: 30000 });
    const enabled = await menu.isEnabled();
    if (!enabled) {
      throw new Error('Ticketing menu is visible but not enabled/clickable');
    }
    await menu.scrollIntoViewIfNeeded();
    try {
      await menu.click({ timeout: 30000 });
    } catch (error) {
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
    const enabled = await button.isEnabled();
    if (!enabled) {
      throw new Error('Create Ticket Category button is visible but not enabled/clickable');
    }
    await button.scrollIntoViewIfNeeded();
    try {
      await button.click({ timeout: 30000 });
    } catch (error) {
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
    } catch (error) {
      await button.click({ force: true, timeout: 30000 });
    }
  }

  async createTicketCategory(name: string, description: string) {
    await this.enterCategoryName(name);
    await this.enterCategoryDescription(description);
    await this.clickCreateButton();
  }
}