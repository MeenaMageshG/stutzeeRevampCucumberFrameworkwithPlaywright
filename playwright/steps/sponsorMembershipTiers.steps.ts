import { When, Then } from '@cucumber/cucumber';
import { SponsorMembershipTiersPage } from '../pages/sponsorMembershipTiersPage';

let sponsorMembershipTiersPage: SponsorMembershipTiersPage;

function ensurePageInitialized(context: any) {
  sponsorMembershipTiersPage = new SponsorMembershipTiersPage(context.page);
}

When('user clicks on Sponsors module', async function () {
  ensurePageInitialized(this);
  await sponsorMembershipTiersPage.clickSponsorsMenu();
});

When('user clicks on Membership Tiers menu', async function () {
  ensurePageInitialized(this);
  await sponsorMembershipTiersPage.clickMembershipTiersMenu();
});

When('user clicks on Create New Tier button', async function () {
  ensurePageInitialized(this);
  await sponsorMembershipTiersPage.clickCreateTierButton();
});

When('user enters tier name {string}', async function (name: string) {
  ensurePageInitialized(this);
  const actualName = name.trim().length > 0 ? `${name} ${Date.now()}` : name;
  this.lastTierName = actualName;
  await sponsorMembershipTiersPage.enterTierName(actualName);
});

When('user enters minimum contribution {string}', async function (value: string) {
  ensurePageInitialized(this);
  await sponsorMembershipTiersPage.enterMinContribution(value);
});

When('user enters color code {string}', async function (code: string) {
  ensurePageInitialized(this);
  await sponsorMembershipTiersPage.enterColorCode(code);
});

When('user enters max team size {string}', async function (size: string) {
  ensurePageInitialized(this);
  await sponsorMembershipTiersPage.enterMaxTeamSize(size);
});

When('user enters benefit {string}', async function (benefit: string) {
  ensurePageInitialized(this);
  await sponsorMembershipTiersPage.enterBenefits(benefit);
});

When('user clicks on Save Tier button', async function () {
  ensurePageInitialized(this);
  await sponsorMembershipTiersPage.clickSaveTierButton();
});

Then('sponsor membership tier should be created successfully', async function () {
  ensurePageInitialized(this);
  const created = await sponsorMembershipTiersPage.isTierListed(this.lastTierName);

  if (!created) {
    throw new Error(`Sponsor Membership Tier "${this.lastTierName}" was not found in the list`);
  }

  console.log(`Sponsor Membership Tier "${this.lastTierName}" created successfully`);
});

Then('user should be on Membership Tiers page', async function () {
  ensurePageInitialized(this);
  const loaded = await sponsorMembershipTiersPage.waitForMembershipTiersPage();

  if (!loaded) {
    throw new Error(`Navigation to Membership Tiers page failed. Current URL: ${this.page.url()}`);
  }
});

Then('system should show error {string}', async function (expectedError: string) {
  ensurePageInitialized(this);
  const errorMessages = await sponsorMembershipTiersPage.getErrorMessages();
  const normalizedExpectedError = expectedError.toLowerCase();
  const matchingError = errorMessages.find((message) => message.toLowerCase().includes(normalizedExpectedError));

  if (!matchingError) {
    throw new Error(
      `Expected error "${expectedError}" was not shown. Actual errors: ${errorMessages.join(', ') || 'none'}`
    );
  }
});
