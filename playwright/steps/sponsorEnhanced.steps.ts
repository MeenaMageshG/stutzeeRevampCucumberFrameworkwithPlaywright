import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { SponsorPage } from '../pages/sponsorPage';

let sponsorPage: SponsorPage;

function ensurePageInitialized(context: any) {
  sponsorPage = new SponsorPage(context.page);
}

When('user clicks on Sponsors menu', async function () {
  ensurePageInitialized(this);
  await sponsorPage.clickSponsorsMenu();
});

When('user clicks on Sponsors List menu', async function () {
  ensurePageInitialized(this);
  await sponsorPage.clickSponsorListMenu();
});

When('user clicks on Membership Tiers menu', async function () {
  ensurePageInitialized(this);
  await sponsorPage.clickMembershipTiersMenu();
});

When('user clicks on Add New Tier button', async function () {
  ensurePageInitialized(this);
  await sponsorPage.clickAddNewTier();
});

When('user enters tier details {string} {string} {string} {string}', async function (name, contribution, color, teamSize) {
  ensurePageInitialized(this);
  await sponsorPage.enterTierDetails(name, contribution, color, teamSize);
});

When('user clicks on Save Tier button', async function () {
  ensurePageInitialized(this);
  await sponsorPage.saveTier();
});

When('user clicks on Add New Sponsor button', async function () {
  ensurePageInitialized(this);
  await sponsorPage.clickAddNewSponsor();
});

When('user enters sponsor details {string} {string} {string} {string} {string} {string} {string}', async function (company, email, industry, contact, phone, membershipType, contribution) {
  ensurePageInitialized(this);
  await sponsorPage.enterSponsorDetails(company, email, industry, contact, phone, membershipType, contribution);
});

When('user clicks on Create Sponsor button', async function () {
  ensurePageInitialized(this);
  await sponsorPage.createSponsor();
});

Then('sponsor {string} should be created successfully', async function (company) {
  ensurePageInitialized(this);
  const created = await sponsorPage.isSponsorListed(company);
  expect(created).toBeTruthy();
});

Then('system should show sponsor error {string}', async function (expectedError) {
  ensurePageInitialized(this);
  const errors = await sponsorPage.getErrorMessages();
  const match = errors.find(e => e.toLowerCase().includes(expectedError.toLowerCase()));
  if (!match) throw new Error(`Expected error "${expectedError}" not found. Actual: ${errors.join(', ')}`);
});
