import { Page } from '@playwright/test';
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
    const tierLocator = this.page.locator(sponsorMembershipTiersLocators.tierNameCard(name)).first();

    try {
      await tierLocator.waitFor({ state: 'visible', timeout: 10000 });
      return await tierLocator.isVisible();
    } catch {
      return false;
    }
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
}
