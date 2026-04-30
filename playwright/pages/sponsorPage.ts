import { Locator, Page } from '@playwright/test';
import { sponsorLocators } from '../locators/sponsors';

export class SponsorPage {
  constructor(private page: Page) {}

  async clickSponsorsMenu() {
    await this.clickVisible(sponsorLocators.sponsorsMenu);
    await this.page.locator(sponsorLocators.sponsorListMenu).waitFor({ state: 'visible', timeout: 30000 }).catch(() => {});
  }

  async clickSponsorListMenu() {
    await this.clickVisible(sponsorLocators.sponsorListMenu);
    await this.page.locator(sponsorLocators.sponsorsListHeader).waitFor({ state: 'visible', timeout: 30000 });
  }

  async waitForSponsorListPage(): Promise<boolean> {
    try {
      await this.page.locator(sponsorLocators.sponsorsListHeader).waitFor({ state: 'visible', timeout: 30000 });
      return true;
    } catch {
      return false;
    }
  }

  async clickMembershipTiersMenu() {
    await this.clickVisible(sponsorLocators.membershipTiersMenu);
    await this.page.locator(sponsorLocators.addNewSponsorTierButton).waitFor({ state: 'visible', timeout: 30000 }).catch(() => {});
  }

  async clickBackToSponsors() {
    const companyField = this.page.locator(sponsorLocators.companyNameInput).first();
    const candidateScopes = [
      companyField.locator('xpath=ancestor::form[1]'),
      companyField.locator('xpath=ancestor::*[self::div or self::section or self::article or self::main or self::aside][1]'),
      this.page.locator('[role="dialog"]').last(),
      this.page.locator('.MuiDrawer-root').last(),
      this.page,
    ];

    const buttonNames = ['Back to Sponsors', 'Back To Sponsor'];

    for (const scope of candidateScopes) {
      for (const buttonName of buttonNames) {
        const button = scope.getByRole('button', { name: buttonName, exact: true }).last();
        if (await button.isVisible().catch(() => false)) {
          await button.scrollIntoViewIfNeeded();
          await button.click({ timeout: 30000 }).catch(() => button.click({ force: true, timeout: 30000 }));
          await this.page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
          await this.page.waitForTimeout(500);
          return;
        }
      }
    }

    await this.clickVisible(sponsorLocators.backToSponsorsButton);
    await this.page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
    await this.page.waitForTimeout(500);
  }

  async clickAddNewTier() {
    await this.clickVisible(sponsorLocators.addNewSponsorTierButton);
  }

  async enterTierDetails(name: string, contribution: string, color: string, teamSize: string) {
    await this.page.locator(sponsorLocators.tierNameInput).fill(name);
    await this.page.locator(sponsorLocators.minContributionInput).fill(contribution);
    await this.page.locator(sponsorLocators.colorPickerTrigger).fill(color);
    await this.page.locator(sponsorLocators.maxTeamSizeInput).fill(teamSize);
  }

  async saveTier() {
    await this.clickVisible(sponsorLocators.saveTierButton);
  }

  async clickAddNewSponsor() {
    await this.clickVisible(sponsorLocators.addNewSponsorButton);
    await this.page.waitForTimeout(1500);

    const companyVisible = await this.page.locator(sponsorLocators.companyNameInput).isVisible().catch(() => false);
    if (!companyVisible) {
      const inputs = await this.page
        .locator('input, textarea')
        .evaluateAll((elements) =>
          elements.slice(0, 20).map((element) => {
            const input = element as HTMLInputElement | HTMLTextAreaElement;
            return `${input.tagName.toLowerCase()}#${input.id || '(no-id)'}[name=${input.getAttribute('name') || ''}][placeholder=${input.getAttribute('placeholder') || ''}]`;
          })
        )
        .catch(() => []);

      const bodySnippet = (await this.page.locator('body').innerText().catch(() => '')).slice(0, 800);
      throw new Error(
        `Sponsor create form did not open after clicking Add Sponsors. Inputs: ${inputs.join(' | ') || 'none'}. Body: ${bodySnippet}`
      );
    }
  }

  async enterSponsorDetails(company: string, email: string, industry: string, contact: string, phone: string, membershipType: string, contribution: string) {
    await this.page.locator(sponsorLocators.companyNameInput).fill(company);
    await this.page.locator(sponsorLocators.emailInput).fill(email);
    await this.page.locator(sponsorLocators.industryInput).fill(industry);
    await this.page.locator(sponsorLocators.contactPersonInput).fill(contact);
    await this.page.locator(sponsorLocators.phoneInput).fill(phone);

    if (membershipType.trim()) {
      await this.page.locator(sponsorLocators.membershipTypeDropdown).click();
      await this.chooseMembershipType(membershipType);
    }

    if (contribution.trim()) {
      const contributionField = this.page.locator(sponsorLocators.contributionAmountInput).first();
      await contributionField.click().catch(() => {});
      await contributionField.fill(contribution).catch(() => {});
    }
  }

  async isCompanyNameEditable(): Promise<boolean> {
    const field = this.page.locator(sponsorLocators.companyNameInput).first();
    const isDisabled = await field.isDisabled().catch(() => false);
    const isReadOnly = await field.getAttribute('readonly').catch(() => null);
    return !isDisabled && isReadOnly === null;
  }

  async createSponsor() {
    await this.clickSponsorSubmitButton();
  }

  async waitForSponsorToAppear(name: string, timeoutMs = 30000): Promise<boolean> {
    const deadline = Date.now() + timeoutMs;

    while (Date.now() < deadline) {
      const container = await this.findSponsorContainer(name);
      if (container && (await container.isVisible().catch(() => false))) {
        return true;
      }

      await this.page.waitForTimeout(1000);
    }

    return false;
  }

  async clickEditSponsor(name: string) {
    const card = await this.findSponsorContainer(name);
    if (!card) {
      throw new Error(`Sponsor "${name}" was not found`);
    }
    const editButton = await this.getActionButtonFromContainer(card, 'edit');
    await this.clickActionButton(editButton);
    await this.page.locator(sponsorLocators.companyNameInput).waitFor({ state: 'visible', timeout: 30000 });
  }

  async clickDeleteSponsor(name: string) {
    const card = await this.findSponsorContainer(name);
    if (!card) {
      throw new Error(`Sponsor "${name}" was not found`);
    }
    const deleteButton = await this.getActionButtonFromContainer(card, 'delete');
    await this.clickActionButton(deleteButton);
    await this.confirmDeleteIfPresent();
  }

  async deleteAllSponsors() {
    let remaining = await this.getSponsorCount();
    let attempts = 0;

    while (remaining > 0 && attempts < 50) {
      const card = await this.getFirstSponsorContainer();
      if (!card) {
        break;
      }

      const deleteButton = await this.getActionButtonFromContainer(card, 'delete');
      await this.clickActionButton(deleteButton);
      await this.confirmDeleteIfPresent();
      await this.page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
      await this.page.waitForTimeout(1000);
      remaining = await this.getSponsorCount();
      attempts += 1;
    }

    if (remaining > 0) {
      throw new Error(`Unable to delete all sponsors. ${remaining} sponsor(s) are still listed`);
    }
  }

  async isSponsorListed(name: string): Promise<boolean> {
    await this.page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
    const container = await this.findSponsorContainer(name);
    if (!container) {
      return false;
    }

    return container.isVisible().catch(() => false);
  }

  async getSponsorCount(): Promise<number> {
    await this.page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
    const cards = this.page.locator(sponsorLocators.sponsorCard);
    const cardCount = await cards.count().catch(() => 0);
    if (cardCount > 0) {
      return cardCount;
    }
    return this.page.locator(sponsorLocators.sponsorRow).count().catch(() => 0);
  }

  async getErrorMessages(): Promise<string[]> {
    await this.page.waitForTimeout(500);
    const messages = await this.page
      .locator('.MuiFormHelperText-root, .MuiTypography-caption, .MuiAlert-message')
      .allInnerTexts()
      .catch(() => []);

    return messages
      .map((message) => message.trim())
      .filter((message) => message.length > 0);
  }

  private async clickSponsorSubmitButton() {
    const companyField = this.page.locator(sponsorLocators.companyNameInput).first();
    const candidateScopes = [
      companyField.locator('xpath=ancestor::form[1]'),
      companyField.locator('xpath=ancestor::*[self::div or self::section or self::article or self::main or self::aside][1]'),
      this.page.locator('[role="dialog"]').last(),
      this.page.locator('.MuiDrawer-root').last(),
      this.page.locator('form').last(),
      this.page,
    ];

    const buttonNames = ['Update Sponsor', 'Save Changes', 'Update', 'Create Sponsor'];

    for (const scope of candidateScopes) {
      for (const buttonName of buttonNames) {
        const button = scope.getByRole('button', { name: buttonName, exact: true }).first();
        if (await button.isVisible().catch(() => false)) {
          await button.scrollIntoViewIfNeeded();
          await button.click({ timeout: 30000 }).catch(() => button.click({ force: true, timeout: 30000 }));
          await this.page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
          return;
        }
      }
    }

    const fallbackButton = this.page.locator(sponsorLocators.createSponsorButton).first();
    await fallbackButton.waitFor({ state: 'visible', timeout: 30000 });
    await fallbackButton.scrollIntoViewIfNeeded();
    await fallbackButton.click({ timeout: 30000 }).catch(() => fallbackButton.click({ force: true, timeout: 30000 }));
    await this.page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
  }

  private async chooseMembershipType(membershipType: string) {
    const exactOption = this.page.locator(sponsorLocators.chooseMembershipTypeOption(membershipType)).first();
    if (await exactOption.isVisible().catch(() => false)) {
      await exactOption.click();
      return;
    }

    const partialOption = this.page
      .locator('li, [role="option"]')
      .filter({ hasText: new RegExp(membershipType, 'i') })
      .first();

    await partialOption.waitFor({ state: 'visible', timeout: 10000 });
    await partialOption.click();
  }

  private async clickVisible(locator: string) {
    const element = this.page.locator(locator).first();
    await element.waitFor({ state: 'visible', timeout: 30000 });
    await element.scrollIntoViewIfNeeded();
    await element.click({ timeout: 30000 }).catch(() => element.click({ force: true, timeout: 30000 }));
  }

  private async findSponsorContainer(name: string): Promise<Locator | null> {
    const candidateSelectors = [
      sponsorLocators.sponsorCard,
      'tr',
      'article',
      'li',
      'section',
      '[role="row"]',
    ];

    for (const selector of candidateSelectors) {
      const container = this.page.locator(selector).filter({
        has: this.page.getByText(name, { exact: false }),
      }).first();

      if (await container.isVisible().catch(() => false)) {
        return container;
      }
    }

    const directText = this.page.getByText(name, { exact: false }).first();
    if (await directText.isVisible().catch(() => false)) {
      const ancestorContainer = directText.locator(
        'xpath=ancestor::*[self::div or self::tr or self::article or self::li or self::section or self::tbody][1]'
      );
      if (await ancestorContainer.isVisible().catch(() => false)) {
        return ancestorContainer;
      }

      return directText;
    }

    const textNode = this.page.locator(sponsorLocators.sponsorText(name)).first();
    if (await textNode.isVisible().catch(() => false)) {
      return textNode;
    }

    return null;
  }

  private async getFirstSponsorContainer(): Promise<Locator | null> {
    const cardCount = await this.page.locator(sponsorLocators.sponsorCard).count().catch(() => 0);
    if (cardCount > 0) {
      return this.page.locator(sponsorLocators.sponsorCard).first();
    }

    const rowCount = await this.page.locator(sponsorLocators.sponsorRow).count().catch(() => 0);
    if (rowCount > 0) {
      return this.page.locator(sponsorLocators.sponsorRow).first();
    }

    return null;
  }

  async getSponsorCardText(name: string): Promise<string | null> {
    const container = await this.findSponsorContainer(name);
    if (!container) {
      return null;
    }

    try {
      return (await container.innerText()).trim();
    } catch {
      return null;
    }
  }

  async getSponsorFormValues() {
    return {
      company: await this.page.locator(sponsorLocators.companyNameInput).inputValue().catch(() => ''),
      email: await this.page.locator(sponsorLocators.emailInput).inputValue().catch(() => ''),
      industry: await this.page.locator(sponsorLocators.industryInput).inputValue().catch(() => ''),
      contact: await this.page.locator(sponsorLocators.contactPersonInput).inputValue().catch(() => ''),
      phone: await this.page.locator(sponsorLocators.phoneInput).inputValue().catch(() => ''),
      contribution: await this.page.locator(sponsorLocators.contributionAmountInput).inputValue().catch(() => ''),
    };
  }

  private async getActionButtonFromContainer(container: Locator, action: 'edit' | 'delete'): Promise<Locator> {
    const keyword = action === 'edit' ? 'edit' : 'delete';
    const candidates: Locator[] = [
      container.locator(`button[aria-label*="${keyword}" i]`).first(),
      container.locator(`button[title*="${keyword}" i]`).first(),
      container.locator(`button:has-text("${action === 'edit' ? 'Edit' : 'Delete'}")`).first(),
    ];

    for (const candidate of candidates) {
      if (await candidate.count().catch(() => 0)) {
        if (await candidate.isVisible().catch(() => false)) {
          return candidate;
        }
      }
    }

    if (action === 'delete') {
      const buttons = container.locator('button');
      const total = await buttons.count();
      for (let index = total - 1; index >= 0; index -= 1) {
        const candidate = buttons.nth(index);
        if (await candidate.isVisible().catch(() => false)) {
          return candidate;
        }
      }
    }

    throw new Error(`Unable to find ${action} button for sponsor "${await container.innerText().catch(() => '')}"`);
  }

  private async clickActionButton(button: Locator) {
    await button.scrollIntoViewIfNeeded();
    await button.click({ timeout: 30000 }).catch(() => button.click({ force: true, timeout: 30000 }));
  }

  private async confirmDeleteIfPresent() {
    const candidateScopes = [
      this.page.locator('[role="dialog"]').last(),
      this.page.locator('.MuiDialog-root').last(),
      this.page.locator('.MuiPopover-root').last(),
      this.page,
    ];

    for (const scope of candidateScopes) {
      const confirmButton = scope
        .locator('button')
        .filter({ hasText: /^(Delete|Confirm|Yes|Yes, Delete)$/ })
        .first();

      if (await confirmButton.isVisible().catch(() => false)) {
        await confirmButton.scrollIntoViewIfNeeded().catch(() => {});
        await confirmButton.click({ timeout: 30000 }).catch(() => confirmButton.click({ force: true, timeout: 30000 }));
        await this.page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
        await this.page.waitForTimeout(1000);
        return;
      }
    }
  }
}
