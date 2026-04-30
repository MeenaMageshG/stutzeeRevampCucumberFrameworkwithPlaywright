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
    await this.page.waitForLoadState('networkidle').catch(() => {});
    await this.page.waitForFunction(
      (label) => document.body.innerText.toLowerCase().includes(String(label).toLowerCase()),
      'Event Management',
      { timeout: 15000 }
    ).catch(() => {});

    const menu = await this.resolveMenuItem('Event Management', [
      ticketCategoryLocators.eventManagementMenu,
      ticketCategoryLocators.eventManagementMenuSpan,
      ticketCategoryLocators.eventManagementMenuDiv,
    ]);

    if (!menu) {
      const diagnostics = await this.getMenuDiagnostics('Event Management');
      throw new Error(
        `Event Management menu not found. ${diagnostics}. Current URL: ${this.page.url()}`
      );
    }

    const isVisible = await menu.isVisible().catch(() => false);
    if (!isVisible) {
      const diagnostics = await this.getMenuDiagnostics('Event Management');
      throw new Error(
        `Event Management menu is present but not visible. ${diagnostics}. Current URL: ${this.page.url()}`
      );
    }
    
    await menu.scrollIntoViewIfNeeded();
    try {
      await menu.click({ timeout: 30000 });
    } catch (err) {
      console.log('Click failed, trying force click...');
      await menu.click({ force: true, timeout: 30000 });
    }
    
    // Wait for Ticketing menu to appear
    const ticketingMenu = this.page.locator(ticketCategoryLocators.ticketingMenu);
    await ticketingMenu.waitFor({ state: 'visible', timeout: 30000 }).catch(() => {
      // Try alternative selector
      return this.page.locator(ticketCategoryLocators.ticketingMenuSpan).waitFor({ state: 'visible', timeout: 30000 }).catch(() => {
        return this.page.locator(ticketCategoryLocators.ticketingMenuDiv).waitFor({ state: 'visible', timeout: 30000 });
      });
    });
  }

  async clickTicketingMenu() {
    await this.page.waitForLoadState('networkidle').catch(() => {});
    await this.page.waitForFunction(
      (label) => document.body.innerText.toLowerCase().includes(String(label).toLowerCase()),
      'Ticketing',
      { timeout: 15000 }
    ).catch(() => {});

    const menu = await this.resolveMenuItem('Ticketing', [
      ticketCategoryLocators.ticketingMenu,
      ticketCategoryLocators.ticketingMenuSpan,
      ticketCategoryLocators.ticketingMenuDiv,
    ]);

    if (!menu) {
      const diagnostics = await this.getMenuDiagnostics('Ticketing');
      throw new Error(`Ticketing menu not found. ${diagnostics}. Current URL: ${this.page.url()}`);
    }

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

  private async resolveMenuItem(label: string, fallbackLocators: string[]): Promise<Locator | null> {
    const labelPattern = new RegExp(label, 'i');
    const candidates: Locator[] = [
      this.page.getByRole('button', { name: labelPattern }).first(),
      this.page.getByRole('link', { name: labelPattern }).first(),
      this.page.getByRole('menuitem', { name: labelPattern }).first(),
      this.page.getByText(labelPattern).first(),
      ...fallbackLocators.map((locator) => this.page.locator(locator).first()),
      this.page
        .locator('nav, aside, [role="navigation"]')
        .locator('button, a, [role="button"], [role="link"], [role="menuitem"], h1, h2, h3, h4, h5, h6, span, div')
        .filter({ hasText: labelPattern })
        .first(),
      this.page
        .locator('button, a, [role="button"], [role="link"], [role="menuitem"], h1, h2, h3, h4, h5, h6, span, div')
        .filter({ hasText: labelPattern })
        .first(),
    ];

    for (const candidate of candidates) {
      if (await candidate.isVisible({ timeout: 5000 }).catch(() => false)) {
        return candidate;
      }
    }

    return null;
  }

  private async getMenuDiagnostics(label: string): Promise<string> {
    const labelPattern = new RegExp(label, 'i');
    const roleCounts = await Promise.all([
      this.page.getByRole('button', { name: labelPattern }).count().catch(() => 0),
      this.page.getByRole('link', { name: labelPattern }).count().catch(() => 0),
      this.page.getByRole('menuitem', { name: labelPattern }).count().catch(() => 0),
    ]);
    const textCount = await this.page.getByText(labelPattern).count().catch(() => 0);
    const allText = await this.page.locator('body').allTextContents().catch(() => []);
    const hasText = allText.some((text) => labelPattern.test(text));

    return `buttons: ${roleCounts[0]}, links: ${roleCounts[1]}, menuitems: ${roleCounts[2]}, text matches: ${textCount}, body text: ${hasText}`;
  }
}
