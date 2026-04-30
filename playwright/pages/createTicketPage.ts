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

  async chooseCategory(category: string): Promise<string> {
    await this.page.locator(ticketLocators.categoryDropdown).click();
    const dropdown = this.page.locator(ticketLocators.ticketCategoryDropdown).last();
    await dropdown.waitFor({ state: 'visible', timeout: 30000 });
    await dropdown.click();

    const exactOption = this.page.getByRole('option', { name: category, exact: true }).first();
    if (await exactOption.isVisible().catch(() => false)) {
      const selectedCategory = (await exactOption.innerText()).trim();
      await exactOption.click();
      return selectedCategory;
    }

    const partialOption = this.page.getByRole('option', { name: new RegExp(category, 'i') }).first();
    if (await partialOption.isVisible().catch(() => false)) {
      const selectedCategory = (await partialOption.innerText()).trim();
      await partialOption.click();
      return selectedCategory;
    }

    const listItem = this.page.locator('li, [role="option"]').first();
    await listItem.waitFor({ state: 'visible', timeout: 10000 });
    const selectedCategory = (await listItem.innerText()).trim();
    await listItem.click();
    return selectedCategory;
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
    const ticketLocator = this.page.getByText(name, { exact: true }).first();
    return await ticketLocator.isVisible().catch(() => false);
  }

  async isTicketListedUnderCategory(ticketName: string, categoryName: string): Promise<boolean> {
    await this.page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});

    const categoryCard = this.page.locator('div.MuiCard-root').filter({
      has: this.page.getByRole('heading', { name: categoryName, exact: true }),
    }).first();

    try {
      await categoryCard.waitFor({ state: 'visible', timeout: 10000 });
      const ticketLocator = categoryCard.getByText(ticketName, { exact: true }).first();
      await ticketLocator.waitFor({ state: 'visible', timeout: 10000 });
      return await ticketLocator.isVisible();
    } catch {
      return false;
    }
  }

  async getErrorMessage(): Promise<string | null> {
    const errorLocators = [
      this.page.locator('.MuiFormHelperText-root'),
      this.page.locator('.MuiAlert-message'),
      this.page.locator('.error-message'),
    ];

    for (const locator of errorLocators) {
      const count = await locator.count();
      for (let i = 0; i < count; i++) {
        const text = (await locator.nth(i).innerText().catch(() => '')).trim();
        if (text && !text.includes('Tickets Management Tips')) {
          return text;
        }
      }
    }

    return null;
  }
}
