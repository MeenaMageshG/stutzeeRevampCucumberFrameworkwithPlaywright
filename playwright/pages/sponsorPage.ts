import { Page } from '@playwright/test';
import { sponsorLocators } from '../locators/sponsors';

export class SponsorPage {
  constructor(private page: Page) {}

  async clickSponsorsMenu() {
    await this.page.locator(sponsorLocators.sponsorsMenu).click();
  }

  async clickSponsorListMenu() {
    await this.page.locator(sponsorLocators.sponsorListMenu).click();
    await this.page.locator(sponsorLocators.sponsorsListHeader).waitFor({ state: 'visible', timeout: 30000 });
  }

  async clickMembershipTiersMenu() {
    await this.page.locator(sponsorLocators.membershipTiersMenu).click();
  }

  async clickAddNewTier() {
    await this.page.locator(sponsorLocators.addNewSponsorTierButton).click();
  }

  async enterTierDetails(name: string, contribution: string, color: string, teamSize: string) {
    await this.page.locator(sponsorLocators.tierNameInput).fill(name);
    await this.page.locator(sponsorLocators.minContributionInput).fill(contribution);
    await this.page.locator(sponsorLocators.colorPickerTrigger).fill(color);
    await this.page.locator(sponsorLocators.maxTeamSizeInput).fill(teamSize);
  }

  async saveTier() {
    await this.page.locator(sponsorLocators.saveTierButton).click();
  }

  async clickAddNewSponsor() {
    await this.page.locator(sponsorLocators.addNewSponsorButton).click();
  }

  async enterSponsorDetails(company: string, email: string, industry: string, contact: string, phone: string, membershipType: string, contribution: string) {
    await this.page.locator(sponsorLocators.companyNameInput).fill(company);
    await this.page.locator(sponsorLocators.emailInput).fill(email);
    await this.page.locator(sponsorLocators.industryInput).fill(industry);
    await this.page.locator(sponsorLocators.contactPersonInput).fill(contact);
    await this.page.locator(sponsorLocators.phoneInput).fill(phone);
    await this.page.locator(sponsorLocators.membershipTypeDropdown).click();
    await this.page.locator(sponsorLocators.chooseMembershipTypeOption(membershipType)).click();
    await this.page.locator(sponsorLocators.contributionAmountInput).fill(contribution);
  }

  async createSponsor() {
    await this.page.locator(sponsorLocators.createSponsorButton).click();
  }

  async isSponsorListed(name: string): Promise<boolean> {
    const sponsorCard = this.page.locator(`//*[normalize-space(.)='${name}']`).first();
    try {
      await sponsorCard.waitFor({ state: 'visible', timeout: 10000 });
      return await sponsorCard.isVisible();
    } catch {
      return false;
    }
  }

  async getErrorMessages(): Promise<string[]> {
    const messages = await this.page.locator('.MuiFormHelperText-root, .MuiTypography-caption').allInnerTexts().catch(() => []);
    return messages.map(m => m.trim()).filter(m => m.length > 0);
  }
}
