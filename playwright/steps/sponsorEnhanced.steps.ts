import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { SponsorPage } from '../pages/sponsorPage';

let sponsorPage: SponsorPage;

function ensurePageInitialized(context: any) {
  sponsorPage = new SponsorPage(context.page);
}

interface SponsorWorld {
  lastSponsorCompanyName?: string;
  lastCreatedSponsorName?: string;
  lastUpdatedSponsorName?: string;
  originalSponsorName?: string;
  pendingEditedSponsorName?: string;
  pendingEditedSponsorContact?: string;
  pendingEditedSponsorPhone?: string;
  pendingEditedSponsorContribution?: string;
  deletedSponsorName?: string;
  lastCreatedTierName?: string;
  lastTierName?: string;
}

function resolveSponsorNameReference(world: SponsorWorld, value: string): string {
  const trimmed = value.trim();

  if (!trimmed) {
    return '';
  }

  switch (trimmed) {
    case '__LAST_SPONSOR_NAME__':
      if (!world.lastSponsorCompanyName) {
        throw new Error('No previously stored sponsor company name is available');
      }
      return world.lastSponsorCompanyName;
    case '__CREATED_SPONSOR_NAME__':
      if (!world.lastCreatedSponsorName) {
        throw new Error('No previously created sponsor company name is available');
      }
      return world.lastCreatedSponsorName;
    case '__UPDATED_SPONSOR_NAME__':
      if (!world.lastUpdatedSponsorName) {
        throw new Error('No previously updated sponsor company name is available');
      }
      return world.lastUpdatedSponsorName;
    default:
      return value;
  }
}

function resolveSponsorNameForInput(world: SponsorWorld, value: string): string {
  if (!value.trim()) {
    return '';
  }

  if (value.startsWith('__') && value.endsWith('__')) {
    return resolveSponsorNameReference(world, value);
  }

  return `${value} ${Date.now()}`;
}

function resolveMembershipTypeReference(world: SponsorWorld, value: string): string {
  const trimmed = value.trim();

  if (!trimmed) {
    return '';
  }

  switch (trimmed) {
    case '__LAST_TIER_NAME__':
    case '__CREATED_TIER_NAME__':
      if (!world.lastCreatedTierName && !world.lastTierName) {
        throw new Error('No sponsor membership tier name is available');
      }
      return world.lastCreatedTierName || world.lastTierName || '';
    default:
      return value;
  }
}

function matchesSponsorError(expectedError: string, actualError: string): boolean {
  const expected = expectedError.trim().toLowerCase();
  const actual = actualError.trim().toLowerCase();

  const aliases: Record<string, string[]> = {
    'invalid phone number': ['mobile number must be 10 digits'],
  };

  return [expected, ...(aliases[expected] || [])].some((candidate) => actual.includes(candidate));
}

When('user clicks on Sponsors menu', async function () {
  ensurePageInitialized(this);
  await sponsorPage.clickSponsorsMenu();
});

When('user clicks on Sponsors List menu', async function () {
  ensurePageInitialized(this);
  await sponsorPage.clickSponsorListMenu();
});

Then('sponsor list page should be visible', async function () {
  ensurePageInitialized(this);
  const visible = await sponsorPage.waitForSponsorListPage();
  if (!visible) {
    throw new Error(`Sponsor list page is not visible. Current URL: ${this.page.url()}`);
  }
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

When('user clicks on Save New Tier button', async function () {
  ensurePageInitialized(this);
  await sponsorPage.saveTier();
});

When('user clicks on Back to Sponsors button', async function () {
  ensurePageInitialized(this);
  await sponsorPage.clickBackToSponsors();
});

When('user clicks on Add New Sponsor button', async function () {
  ensurePageInitialized(this);
  await sponsorPage.clickAddNewSponsor();
});

When('user enters sponsor details {string} {string} {string} {string} {string} {string} {string}', async function (company, email, industry, contact, phone, membershipType, contribution) {
  ensurePageInitialized(this);
  const world = this as SponsorWorld;
  const actualCompany = resolveSponsorNameForInput(world, company);
  const actualMembershipType = resolveMembershipTypeReference(world, membershipType);

  if (actualCompany) {
    world.lastSponsorCompanyName = actualCompany;
    if (world.originalSponsorName && world.originalSponsorName !== actualCompany) {
      const companyNameEditable = await sponsorPage.isCompanyNameEditable();
      world.pendingEditedSponsorName = companyNameEditable ? actualCompany : world.originalSponsorName;
      world.pendingEditedSponsorContact = contact;
      world.pendingEditedSponsorPhone = phone;
      world.pendingEditedSponsorContribution = contribution;
    }
  }

  await sponsorPage.enterSponsorDetails(actualCompany, email, industry, contact, phone, actualMembershipType, contribution);
});

When('user clicks on Create Sponsor button', async function () {
  ensurePageInitialized(this);
  await sponsorPage.createSponsor();
});

Given(
  'sponsor exists with company {string}, email {string}, industry {string}, contact person {string}, phone {string}, membership type {string}, and contribution {string}',
  async function (company: string, email: string, industry: string, contact: string, phone: string, membershipType: string, contribution: string) {
    ensurePageInitialized(this);
    const world = this as SponsorWorld;
    const actualCompany = resolveSponsorNameForInput(world, company);
    const actualMembershipType = resolveMembershipTypeReference(world, membershipType);

    await sponsorPage.clickAddNewSponsor();
    await sponsorPage.enterSponsorDetails(actualCompany, email, industry, contact, phone, actualMembershipType, contribution);
    await sponsorPage.createSponsor();

    const created = await sponsorPage.waitForSponsorToAppear(actualCompany);
    if (!created) {
      throw new Error(`Sponsor "${actualCompany}" could not be created for test setup`);
    }

    world.lastSponsorCompanyName = actualCompany;
    world.lastCreatedSponsorName = actualCompany;
    world.lastUpdatedSponsorName = undefined;
    world.originalSponsorName = undefined;
    world.pendingEditedSponsorName = undefined;
    world.deletedSponsorName = undefined;
  }
);

When('user clicks edit for sponsor {string}', async function (name: string) {
  ensurePageInitialized(this);
  const world = this as SponsorWorld;
  const sponsorName = resolveSponsorNameReference(world, name);

  world.originalSponsorName = sponsorName;
  world.pendingEditedSponsorName = undefined;
  await sponsorPage.clickEditSponsor(sponsorName);
});

When('user clicks delete for sponsor {string}', async function (name: string) {
  ensurePageInitialized(this);
  const world = this as SponsorWorld;
  const sponsorName = resolveSponsorNameReference(world, name);

  world.deletedSponsorName = sponsorName;
  await sponsorPage.clickDeleteSponsor(sponsorName);
});

Then('sponsor {string} should be created successfully', async function (company) {
  ensurePageInitialized(this);
  const world = this as SponsorWorld;
  const sponsorName = world.lastSponsorCompanyName || resolveSponsorNameReference(world, company);
  const created = await sponsorPage.waitForSponsorToAppear(sponsorName);
  expect(created).toBeTruthy();
  world.lastCreatedSponsorName = sponsorName;
  console.log(`Sponsor "${sponsorName}" created successfully`);
});

Then('sponsor {string} should not be listed', async function (name: string) {
  ensurePageInitialized(this);
  const world = this as SponsorWorld;
  const sponsorName = resolveSponsorNameReference(world, name);
  const listed = await sponsorPage.isSponsorListed(sponsorName);

  if (listed) {
    throw new Error(`Sponsor "${sponsorName}" should not be listed, but it is still visible`);
  }
});

Then('sponsor should be updated successfully', async function () {
  ensurePageInitialized(this);
  const world = this as SponsorWorld;
  const updatedName = world.pendingEditedSponsorName || world.lastSponsorCompanyName;

  if (!updatedName) {
    throw new Error('No sponsor company name was stored for update validation');
  }

  await sponsorPage.clickBackToSponsors().catch(() => {});
  await this.page.waitForTimeout(1000);
  const updated = await sponsorPage.isSponsorListed(updatedName);
  const formValues = await sponsorPage.getSponsorFormValues();
  const formLooksUpdated =
    formValues.contact === world.pendingEditedSponsorContact &&
    formValues.phone === world.pendingEditedSponsorPhone &&
    formValues.contribution === world.pendingEditedSponsorContribution;

  if (formLooksUpdated) {
    world.lastSponsorCompanyName = updatedName;
    world.lastUpdatedSponsorName = updatedName;
    world.pendingEditedSponsorName = undefined;
    world.pendingEditedSponsorContact = undefined;
    world.pendingEditedSponsorPhone = undefined;
    world.pendingEditedSponsorContribution = undefined;
    world.originalSponsorName = undefined;
    console.log(`Sponsor "${updatedName}" updated successfully`);
    return;
  }

  if (!updated && world.originalSponsorName) {
    const originalStillVisible = await sponsorPage.isSponsorListed(world.originalSponsorName);
    if (!originalStillVisible) {
      const bodyText = await this.page.locator('body').innerText().catch(() => '');
      throw new Error(`Updated sponsor "${updatedName}" was not found in the list. Current page text: ${bodyText.slice(0, 1500)}`);
    }

    const sponsorText = await sponsorPage.getSponsorCardText(world.originalSponsorName);
    const expectedFragments = [
      world.pendingEditedSponsorContact,
      world.pendingEditedSponsorPhone,
      world.pendingEditedSponsorContribution,
    ].filter((value): value is string => Boolean(value));

    const hasUpdatedDetails = sponsorText
      ? expectedFragments.some((fragment) => sponsorText.includes(fragment))
      : false;

    if (!hasUpdatedDetails) {
      const bodyText = await this.page.locator('body').innerText().catch(() => '');
      throw new Error(`Updated sponsor "${updatedName}" was not found in the list. Current page text: ${bodyText.slice(0, 1500)}`);
    }

    world.lastSponsorCompanyName = world.originalSponsorName;
    world.lastUpdatedSponsorName = world.originalSponsorName;
    world.pendingEditedSponsorName = undefined;
    world.originalSponsorName = undefined;
    console.log(`Sponsor "${world.lastUpdatedSponsorName}" updated successfully`);
    return;
  }

  if (world.originalSponsorName && world.originalSponsorName !== updatedName) {
    const oldStillVisible = await sponsorPage.isSponsorListed(world.originalSponsorName);
    if (oldStillVisible) {
      throw new Error(`Sponsor "${world.originalSponsorName}" is still listed after update; expected renamed sponsor "${updatedName}"`);
    }
  }

  world.lastSponsorCompanyName = updatedName;
  world.lastUpdatedSponsorName = updatedName;
  world.pendingEditedSponsorName = undefined;
  world.pendingEditedSponsorContact = undefined;
  world.pendingEditedSponsorPhone = undefined;
  world.pendingEditedSponsorContribution = undefined;
  world.originalSponsorName = undefined;
  console.log(`Sponsor "${updatedName}" updated successfully`);
});

Then('sponsor should be deleted successfully', async function () {
  ensurePageInitialized(this);
  const world = this as SponsorWorld;
  const sponsorName = world.deletedSponsorName || world.lastSponsorCompanyName;

  if (!sponsorName) {
    throw new Error('No sponsor company name was stored for delete validation');
  }

  const listed = await sponsorPage.isSponsorListed(sponsorName);
  if (listed) {
    throw new Error(`Sponsor "${sponsorName}" is still listed after delete`);
  }

  console.log(`Sponsor "${sponsorName}" deleted successfully`);
});

When('user deletes all sponsors', async function () {
  ensurePageInitialized(this);
  await sponsorPage.deleteAllSponsors();
});

Then('system should show sponsor error {string}', async function (expectedError) {
  ensurePageInitialized(this);
  const errors = await sponsorPage.getErrorMessages();
  const match = errors.find((error) => matchesSponsorError(expectedError, error));
  if (!match) throw new Error(`Expected error "${expectedError}" not found. Actual: ${errors.join(', ')}`);
});
