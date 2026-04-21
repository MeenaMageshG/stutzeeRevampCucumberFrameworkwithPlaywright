import { Page, Locator } from '@playwright/test';
import { promoCodeLocators } from '../locators/promocodeLocators';
import { ActionUtils } from '../utils/actionUtils';

export class PromoCodePage {
  private action: ActionUtils;

  constructor(private page: Page) {
    this.action = new ActionUtils(page);
  }

  // ================= NAVIGATION =================

  async navigateToPromoCodes() {
    await this.page.locator(promoCodeLocators.eventManagementMenu).click();
    await this.page.locator(promoCodeLocators.promocodemenu).click();
  }

  async clickAddNewPromo() {
    await this.page.locator(promoCodeLocators.addNewPromoButton).click();
    await this.page.locator(promoCodeLocators.promoCodeInput).waitFor({ state: 'visible', timeout: 30000 });
  }

  // ================= FORM INPUT =================

  async enterPromoCode(code: string) {
    await this.action.fill(promoCodeLocators.promoCodeInput, code);
  }

  async enterPromoName(name: string) {
    await this.action.fill(promoCodeLocators.promoNameInput, name);
  }

  async selectDiscountTypeAmount() {
    await this.page.locator(promoCodeLocators.discountTypeAmount).click();
  }

  async enterDiscountValue(value: string) {
    await this.action.fill(promoCodeLocators.discountValueInput, value);
  }

  async enterMaxUsage(value: string) {
    await this.action.fill(promoCodeLocators.maxusageInput, value);
  }

  async enterExpiryDate(date: string) {
    const input = this.page.locator(promoCodeLocators.expiryDateInput);

    await input.click();
    await input.fill('');
    await input.type(date, { delay: 50 });

    // 🔥 ensure value is accepted
    await this.page.keyboard.press('Enter');
    await this.page.waitForTimeout(300);
  }

  async selectStatus(status: 'Active' | 'Inactive') {
    const locator =
      status === 'Active'
        ? promoCodeLocators.activeButton
        : promoCodeLocators.inactiveButton;

    await this.page.locator(locator).click();
  }

  async selectTicket(ticketName: string) {
    const applicableTicketsCard = this.page.locator(promoCodeLocators.applicableTicketsCard).first();
    await applicableTicketsCard.waitFor({ state: 'visible', timeout: 10000 });

    const exactTicketCard = applicableTicketsCard
      .locator(promoCodeLocators.ticketCardByName(ticketName))
      .first();

    if (await exactTicketCard.isVisible().catch(() => false)) {
      await exactTicketCard.scrollIntoViewIfNeeded();
      await exactTicketCard.click();
      return;
    }

    const partialTicketCard = applicableTicketsCard
      .locator(promoCodeLocators.ticketCardByPartialName(ticketName))
      .first();

    if (await partialTicketCard.isVisible().catch(() => false)) {
      await partialTicketCard.scrollIntoViewIfNeeded();
      await partialTicketCard.click();
      return;
    }

    const availableTickets = await this.getAvailableTicketNames();
    throw new Error(
      `Ticket "${ticketName}" was not found in promo form. Available tickets: ${availableTickets.join(', ') || 'none'}`
    );
  }

  // ================= ACTION =================

  async clickCreatePromo() {
    await this.page.locator(promoCodeLocators.createPromoButton).click();

    // 🔥 Handle popup immediately
    await this.closeTipsDialogIfExists();

    // wait for UI stabilization
    await this.page.waitForTimeout(1500);
  }

  // ================= VALIDATIONS =================

  async isPromoCreated(code: string): Promise<boolean> {
    try {
      // wait for list refresh
      await this.page.waitForTimeout(2000);

      const promoLocator = this.page.locator(`text=${code}`).first();

      await promoLocator.waitFor({ state: 'visible', timeout: 5000 });
      return await promoLocator.isVisible();
    } catch {
      return false;
    }
  }

  async isPromoListed(promoName: string): Promise<boolean> {
    const promoCard = this.page.locator(promoCodeLocators.promoCardByName(promoName)).first();

    try {
      await promoCard.waitFor({ state: 'visible', timeout: 10000 });
      return await promoCard.isVisible();
    } catch {
      return false;
    }
  }

  async getSuccessMessage(): Promise<string | null> {
  const successLocator = this.page.locator('.MuiAlert-message, .MuiSnackbarContent-message');

  try {
    await successLocator.first().waitFor({ state: 'visible', timeout: 5000 });
    const text = await successLocator.first().innerText();

    if (text.toLowerCase().includes('success')) {
      return text;
    }

    return null;
  } catch {
    return null;
  }
}

  async getErrorMessage(): Promise<string | null> {
    const possibleErrors: Locator[] = [
      this.page.locator('.MuiFormHelperText-root'),
      this.page.locator('.MuiAlert-message'),
      this.page.locator('.error-message'),
    ];

    for (const locator of possibleErrors) {
      const count = await locator.count();

      if (count > 0) {
        for (let i = 0; i < count; i++) {
          const text = await locator.nth(i).innerText();

          // 🔥 ignore tips popup text
          if (text && !text.includes('Promo Code Tips')) {
            return text.trim();
          }
        }
      }
    }

    return null;
  }

  // ================= POPUP HANDLER =================

  private async closeTipsDialogIfExists() {
    try {
      const dialog = this.page.locator('[role="dialog"]');

      const isVisible = await dialog
        .first()
        .isVisible({ timeout: 1500 })
        .catch(() => false);

      if (!isVisible) return;

      // 🔥 click exact OK button inside dialog
      const okButton = dialog.locator('button:has-text("OK")').first();

      if (await okButton.isVisible().catch(() => false)) {
        await okButton.click();
      } else {
        // fallback
        await this.page.keyboard.press('Escape');
      }

      await this.page.waitForTimeout(500);
    } catch {
      // ignore silently
    }
  }

  private async getAvailableTicketNames(): Promise<string[]> {
    const applicableTicketsCard = this.page.locator(promoCodeLocators.applicableTicketsCard).first();
    const ticketHeadings = applicableTicketsCard.locator('h5');
    const names = await ticketHeadings.allInnerTexts().catch(() => []);

    return names.map((name) => name.trim()).filter(Boolean);
  }
}
