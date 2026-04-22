import { Locator, Page } from '@playwright/test';
import { ActionUtils } from '../utils/actionUtils';
import { sponsorMembershipTiersLocators } from '../locators/sponsorMembershipTiers';

export class SponsorMembershipTiersPage {
  private action: ActionUtils;

  constructor(private page: Page) {
    this.action = new ActionUtils(page);
  }

  async clickSponsorsMenu() {
    const menu = this.page.locator(sponsorMembershipTiersLocators.sponsorsMenu);
    await menu.waitFor({ state: 'visible', timeout: 30000 });
    await menu.scrollIntoViewIfNeeded();
    await menu.click({ timeout: 30000 }).catch(() => menu.click({ force: true, timeout: 30000 }));
    await this.page.locator(sponsorMembershipTiersLocators.sponsorMembershipTiersMenu).waitFor({ state: 'visible', timeout: 30000 });
  }

  async clickMembershipTiersMenu() {
    const menu = this.page.locator(sponsorMembershipTiersLocators.sponsorMembershipTiersMenu);
    await menu.waitFor({ state: 'visible', timeout: 30000 });
    await menu.scrollIntoViewIfNeeded();
    await menu.click({ timeout: 30000 }).catch(() => menu.click({ force: true, timeout: 30000 }));
    await this.page.locator(sponsorMembershipTiersLocators.membershipTiersHeader).waitFor({ state: 'visible', timeout: 30000 });
  }

  async clickCreateTierButton() {
    const button = this.page.locator(sponsorMembershipTiersLocators.createTierButton);
    await button.waitFor({ state: 'visible', timeout: 30000 });
    await button.scrollIntoViewIfNeeded();
    await button.click({ timeout: 30000 }).catch(() => button.click({ force: true, timeout: 30000 }));
    await this.page.locator(sponsorMembershipTiersLocators.tierDrawerTitle).waitFor({ state: 'visible', timeout: 30000 });
  }

  async enterTierName(name: string) {
    await this.typeFieldValue(sponsorMembershipTiersLocators.tierNameInput, name);
  }

  async enterMinContribution(value: string) {
    await this.typeFieldValue(
      sponsorMembershipTiersLocators.minContributionInput,
      /^[0-9]+(\.[0-9]+)?$/.test(value) ? value : ''
    );
  }

  async enterColorCode(code: string) {
    await this.typeFieldValue(sponsorMembershipTiersLocators.colorCodeInput, code);
  }

  async enterMaxTeamSize(size: string) {
    await this.typeFieldValue(sponsorMembershipTiersLocators.maxTeamSizeInput, size);
  }

  async enterBenefits(benefit: string) {
    const input = this.page.locator(sponsorMembershipTiersLocators.benefitsInput).first();
    await input.waitFor({ state: 'visible', timeout: 30000 });

    if (!benefit.trim()) {
      return;
    }

    await input.click();
    await input.press('Control+A').catch(() => {});
    await input.press('Delete').catch(() => {});
    await input.pressSequentially(benefit, { delay: 20 });
    await input.press('Enter').catch(() => {});
    await this.page.locator('body').click({ position: { x: 40, y: 40 } });
  }

  async clickSaveTierButton() {
    const button = this.page.locator(sponsorMembershipTiersLocators.saveTierButton);
    await button.waitFor({ state: 'visible', timeout: 30000 });
    await button.scrollIntoViewIfNeeded();
    await button.click({ timeout: 30000 }).catch(() => button.click({ force: true, timeout: 30000 }));
  }

  async waitForMembershipTiersPage(): Promise<boolean> {
    try {
      await this.page.locator(sponsorMembershipTiersLocators.membershipTiersHeader).waitFor({
        state: 'visible',
        timeout: 30000,
      });
      return this.page.url().includes('/membership-tiers');
    } catch {
      return false;
    }
  }

  async isTierListed(name: string): Promise<boolean> {
    await this.page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
    const tierCard = this.getTierCard(name);

    try {
      await tierCard.waitFor({ state: 'visible', timeout: 10000 });
      return await tierCard.isVisible();
    } catch {
      return false;
    }
  }

  async getTierCardText(name: string): Promise<string | null> {
    const tierCard = this.getTierCard(name);

    try {
      await tierCard.waitFor({ state: 'visible', timeout: 10000 });
      return (await tierCard.innerText()).trim();
    } catch {
      return null;
    }
  }

  async clickEditTierButton(name: string) {
    const editButton = await this.getActionButton(name, 'edit');
    await this.clickActionButton(editButton);
    await this.page.locator(sponsorMembershipTiersLocators.tierDrawerTitle).waitFor({ state: 'visible', timeout: 30000 });
  }

  async deleteTier(name: string) {
    const deleteButton = await this.getActionButton(name, 'delete');
    await this.clickActionButton(deleteButton);
    await this.confirmDeleteIfPresent();
    await this.page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
    await this.page.waitForTimeout(1000);
  }

  async deleteAllTiers() {
    let remainingTiers = await this.getTierCount();
    let attempts = 0;

    while (remainingTiers > 0 && attempts < 50) {
      const tierCard = this.page.locator('div.MuiCard-root').last();
      await tierCard.waitFor({ state: 'visible', timeout: 10000 });

      const deleteButton = await this.getActionButtonFromCard(tierCard, 'delete');
      await this.clickActionButton(deleteButton);
      await this.confirmDeleteIfPresent();
      await this.page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
      await this.page.waitForTimeout(1000);

      attempts += 1;
      remainingTiers = await this.getTierCount();
    }

    if (remainingTiers > 0) {
      throw new Error(`Unable to delete all sponsor membership tiers. ${remainingTiers} tier(s) are still listed`);
    }
  }

  async getTierCount(): Promise<number> {
    await this.page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
    return this.page.locator('div.MuiCard-root').count();
  }

  async getErrorMessages(): Promise<string[]> {
    const messages = await this.page
      .locator(sponsorMembershipTiersLocators.errorMessages)
      .allInnerTexts()
      .catch(() => []);

    return messages
      .map((message) => message.trim())
      .filter((message) => message.length > 0 && !message.includes('Sumanas Technologies'));
  }

  async getSuccessMessages(): Promise<string[]> {
    const messages = await this.page
      .locator(sponsorMembershipTiersLocators.successMessages)
      .allInnerTexts()
      .catch(() => []);

    return messages
      .map((message) => message.trim())
      .filter((message) => message.length > 0);
  }

  async createTier(name: string, minContribution: string, colorCode: string, maxTeamSize: string, benefit: string) {
    await this.enterTierName(name);
    await this.enterMinContribution(minContribution);
    await this.enterColorCode(colorCode);
    await this.enterMaxTeamSize(maxTeamSize);
    await this.enterBenefits(benefit);
    await this.clickSaveTierButton();
  }

  private async typeFieldValue(locator: string, value: string) {
    const input = this.page.locator(locator).first();
    await input.waitFor({ state: 'visible', timeout: 30000 });
    await input.scrollIntoViewIfNeeded();
    await input.click();
    await input.press('Control+A').catch(() => {});
    await input.press('Delete').catch(() => {});

    if (value) {
      await input.pressSequentially(value, { delay: 20 });
    }

    await input.press('Tab').catch(() => {});
  }

  private getTierCard(name: string): Locator {
    return this.page
      .locator('div.MuiCard-root')
      .filter({ has: this.page.getByText(name, { exact: true }) })
      .first();
  }

  private async getActionButton(name: string, action: 'edit' | 'delete'): Promise<Locator> {
    const tierCard = this.getTierCard(name);
    await tierCard.waitFor({ state: 'visible', timeout: 10000 });
    return this.getActionButtonFromCard(tierCard, action);
  }

  private async getActionButtonFromCard(tierCard: Locator, action: 'edit' | 'delete'): Promise<Locator> {
    
    const keyword = action.toLowerCase();
    const iconKeyword = action === 'edit' ? 'Edit' : 'Delete';
    const candidates: Locator[] = [
      tierCard.locator(`button[aria-label*="${keyword}" i]`).first(),
      tierCard.locator(`button[title*="${keyword}" i]`).first(),
      tierCard.locator(`button:has([data-testid*="${iconKeyword}"])`).first(),
      tierCard.locator(`button:has-text("${iconKeyword}")`).first(),
    ];

    for (const candidate of candidates) {
      if (await candidate.count()) {
        const isVisible = await candidate.isVisible().catch(() => false);
        if (isVisible) {
          return candidate;
        }
      }
    }

    if (action === 'delete') {
      const iconButtons = tierCard.locator('button').filter({
        has: tierCard.locator('svg'),
      });

      const visibleCount = await iconButtons.count();
      for (let index = visibleCount - 1; index >= 0; index--) {
        const candidate = iconButtons.nth(index);
        const isVisible = await candidate.isVisible().catch(() => false);
        if (isVisible) {
          return candidate;
        }
      }

      const allButtons = tierCard.locator('button');
      const totalButtons = await allButtons.count();
      for (let index = totalButtons - 1; index >= 0; index--) {
        const candidate = allButtons.nth(index);
        const text = (await candidate.innerText().catch(() => '')).trim();
        const isVisible = await candidate.isVisible().catch(() => false);

        if (isVisible && text !== 'Edit Tier') {
          return candidate;
        }
      }
    }

    throw new Error(`Unable to find ${action} button for sponsor membership tier "${name}"`);
  }

  private async clickActionButton(button: Locator) {
    await button.scrollIntoViewIfNeeded();
    await button.click({ timeout: 30000 }).catch(() => button.click({ force: true, timeout: 30000 }));
  }

  private async confirmDeleteIfPresent() {
    const confirmButton = this.page.locator(sponsorMembershipTiersLocators.confirmDeleteButton).first();
    const isVisible = await confirmButton.isVisible({ timeout: 3000 }).catch(() => false);

    if (isVisible) {
      await confirmButton.click({ timeout: 30000 }).catch(() => confirmButton.click({ force: true, timeout: 30000 }));
    }
  }
}
