import { Page } from '@playwright/test';
import { ticketLocators } from '../locators/createTicketLocators';
import { ActionUtils } from '../utils/actionUtils';

export class TicketPage {
  private action: ActionUtils;

  constructor(private page: Page) {
    this.action = new ActionUtils(page);
  }

  async clickCreateTicket() {
    await this.page.locator(ticketLocators.createTicketButton).click();
    await this.page.locator(ticketLocators.ticketNameInput).waitFor({ state: 'visible', timeout: 30000 });
  }

  async chooseCategory(category: string) {
    await this.page.locator(ticketLocators.categoryDropdown).click();
    await this.page.locator(ticketLocators.ticketCategoryDropdown).click();
    await this.page.locator(ticketLocators.categoryOptionVIP).click();
  }

  async enterTicketName(name: string) {
    await this.action.fill(ticketLocators.ticketNameInput, name);
  }

  async selectTicketType(type: 'Free' | 'Paid') {
    const locator = type === 'Free' ? ticketLocators.ticketTypeDropdown : ticketLocators.ticketTypeDropdownasPaid;
    await this.page.locator(locator).click();
  }

  async enterMaxAttendees(count: string) {
    await this.action.fill(ticketLocators.maxAttendeesInput, count);
  }

  async enterBasePrice(price: string) {
    await this.action.fill(ticketLocators.basePriceInput, price);
  }

  async enterSalesDates(start: string, end: string) {
    await this.action.fill(ticketLocators.salesStartDateInput, start);
    await this.action.fill(ticketLocators.salesEndDateInput, end);
  }

  async selectVisibility(scope: 'Public' | 'Hidden') {
    const locator = scope === 'Public' ? ticketLocators.visibilityScopeDropdown : ticketLocators.visibilityScopeDropdownasHidden;
    await this.page.locator(locator).click();
  }

  async selectInitialState(state: 'Active' | 'Inactive') {
    const locator = state === 'Active' ? ticketLocators.initialStateDropdown : ticketLocators.initialStateDropdownasInactive;
    await this.page.locator(locator).click();
  }

  async enterPerks(perks: string) {
    await this.action.fill(ticketLocators.perksInput, perks);
  }

  async enterAccessTerms(terms: string) {
    await this.action.fill(ticketLocators.includedAccessTermsInput, terms);
  }

  async clickCreateButton() {
    await this.page.locator(ticketLocators.createButton).click();
  }

  async isTicketCreated(name: string): Promise<boolean> {
    const ticketLocator = this.page.getByText(name, { exact: true });
    return await ticketLocator.isVisible();
  }

  async getErrorMessage(): Promise<string | null> {
    const errorLocator = this.page.locator('.MuiAlert-message, .error-message');
    if (await errorLocator.isVisible()) {
      return await errorLocator.innerText();
    }
    return null;
  }
}
