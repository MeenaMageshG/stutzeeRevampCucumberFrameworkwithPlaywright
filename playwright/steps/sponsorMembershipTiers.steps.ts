import { Given, When, Then } from '@cucumber/cucumber';
import { SponsorMembershipTiersPage } from '../pages/sponsorMembershipTiersPage';

let sponsorMembershipTiersPage: SponsorMembershipTiersPage;

interface SponsorMembershipTierWorld {
  lastTierName?: string;
  lastCreatedTierName?: string;
  lastUpdatedTierName?: string;
  originalTierName?: string;
  pendingEditedTierName?: string;
  deletedTierName?: string;
}

function ensurePageInitialized(context: any) {
  sponsorMembershipTiersPage = new SponsorMembershipTiersPage(context.page);
}

function resolveTierNameReference(world: SponsorMembershipTierWorld, value: string): string {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return '';
  }

  switch (trimmedValue) {
    case '__LAST_TIER_NAME__':
      if (!world.lastTierName) {
        throw new Error('No previously stored sponsor membership tier name is available');
      }
      return world.lastTierName;
    case '__CREATED_TIER_NAME__':
      if (!world.lastCreatedTierName) {
        throw new Error('No previously created sponsor membership tier name is available');
      }
      return world.lastCreatedTierName;
    case '__UPDATED_TIER_NAME__':
      if (!world.lastUpdatedTierName) {
        throw new Error('No previously updated sponsor membership tier name is available');
      }
      return world.lastUpdatedTierName;
    default:
      return value;
  }
}

function resolveTierNameForInput(world: SponsorMembershipTierWorld, value: string): string {
  if (!value.trim()) {
    return '';
  }

  if (value.startsWith('__') && value.endsWith('__')) {
    return resolveTierNameReference(world, value);
  }

  return `${value} ${Date.now()}`;
}

When('user clicks on Sponsor Tiers module', async function () {
  ensurePageInitialized(this);
  await sponsorMembershipTiersPage.clickSponsorsMenu();
});

When('user clicks on Sponsor Tiers menu', async function () {
  ensurePageInitialized(this);
  await sponsorMembershipTiersPage.clickMembershipTiersMenu();
});

When('user clicks on Create New Tier button', async function () {
  ensurePageInitialized(this);
  await sponsorMembershipTiersPage.clickCreateTierButton();
});

Given(
  'sponsor membership tier exists with name {string}, minimum contribution {string}, color code {string}, max team size {string}, and benefit {string}',
  async function (name: string, minContribution: string, colorCode: string, maxTeamSize: string, benefit: string) {
    ensurePageInitialized(this);
    const world = this as SponsorMembershipTierWorld;
    const actualName = resolveTierNameForInput(world, name);

    await sponsorMembershipTiersPage.clickCreateTierButton();
    await sponsorMembershipTiersPage.createTier(actualName, minContribution, colorCode, maxTeamSize, benefit);

    const created = await sponsorMembershipTiersPage.isTierListed(actualName);
    if (!created) {
      throw new Error(`Sponsor Membership Tier "${actualName}" could not be created for test setup`);
    }

    world.lastTierName = actualName;
    world.lastCreatedTierName = actualName;
    world.lastUpdatedTierName = undefined;
    world.originalTierName = undefined;
    world.pendingEditedTierName = undefined;
    world.deletedTierName = undefined;
  }
);

When('user enters tier name {string}', async function (name: string) {
  ensurePageInitialized(this);
  const world = this as SponsorMembershipTierWorld;
  const actualName = resolveTierNameForInput(world, name);

  if (actualName) {
    world.lastTierName = actualName;
    if (world.originalTierName && world.originalTierName !== actualName) {
      world.pendingEditedTierName = actualName;
    }
  }

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

When('user clicks edit for sponsor membership tier {string}', async function (name: string) {
  ensurePageInitialized(this);
  const world = this as SponsorMembershipTierWorld;
  const tierName = resolveTierNameReference(world, name);

  world.originalTierName = tierName;
  world.pendingEditedTierName = undefined;
  await sponsorMembershipTiersPage.clickEditTierButton(tierName);
});

When('user clicks delete for sponsor membership tier {string}', async function (name: string) {
  ensurePageInitialized(this);
  const world = this as SponsorMembershipTierWorld;
  const tierName = resolveTierNameReference(world, name);

  world.deletedTierName = tierName;
  await sponsorMembershipTiersPage.deleteTier(tierName);
});

When('user deletes all sponsor membership tiers', async function () {
  ensurePageInitialized(this);
  await sponsorMembershipTiersPage.deleteAllTiers();
});

Then('sponsor membership tier should be created successfully', async function () {
  ensurePageInitialized(this);
  const world = this as SponsorMembershipTierWorld;
  const tierName = world.lastTierName;

  if (!tierName) {
    throw new Error('No sponsor membership tier name was stored for creation validation');
  }

  const created = await sponsorMembershipTiersPage.isTierListed(tierName);
  if (!created) {
    throw new Error(`Sponsor Membership Tier "${tierName}" was not found in the list`);
  }

  world.lastCreatedTierName = tierName;
  console.log(`Sponsor Membership Tier "${tierName}" created successfully`);
});

Then('sponsor membership tier {string} should be listed', async function (name: string) {
  ensurePageInitialized(this);
  const world = this as SponsorMembershipTierWorld;
  const tierName = resolveTierNameReference(world, name);
  const listed = await sponsorMembershipTiersPage.isTierListed(tierName);

  if (!listed) {
    throw new Error(`Sponsor Membership Tier "${tierName}" was not found in the list`);
  }
});

Then('sponsor membership tier {string} should not be listed', async function (name: string) {
  ensurePageInitialized(this);
  const world = this as SponsorMembershipTierWorld;
  const tierName = resolveTierNameReference(world, name);
  const listed = await sponsorMembershipTiersPage.isTierListed(tierName);

  if (listed) {
    throw new Error(`Sponsor Membership Tier "${tierName}" should not be listed, but it is still visible`);
  }
});

Then('sponsor membership tier card for {string} should contain text {string}', async function (name: string, expectedText: string) {
  ensurePageInitialized(this);
  const world = this as SponsorMembershipTierWorld;
  const tierName = resolveTierNameReference(world, name);
  const tierCardText = await sponsorMembershipTiersPage.getTierCardText(tierName);

  if (!tierCardText || !tierCardText.includes(expectedText)) {
    throw new Error(
      `Sponsor Membership Tier "${tierName}" did not contain expected text "${expectedText}". Actual text: ${tierCardText || 'none'}`
    );
  }
});

Then('sponsor membership tier should be updated successfully', async function () {
  ensurePageInitialized(this);
  const world = this as SponsorMembershipTierWorld;
  const updatedName = world.pendingEditedTierName || world.lastTierName;

  if (!updatedName) {
    throw new Error('No sponsor membership tier name was stored for update validation');
  }

  const updated = await sponsorMembershipTiersPage.isTierListed(updatedName);
  if (!updated) {
    throw new Error(`Updated sponsor membership tier "${updatedName}" was not found in the list`);
  }

  if (world.originalTierName && world.originalTierName !== updatedName) {
    const oldTierStillVisible = await sponsorMembershipTiersPage.isTierListed(world.originalTierName);
    if (oldTierStillVisible) {
      throw new Error(
        `Sponsor Membership Tier "${world.originalTierName}" is still listed after update; expected renamed tier "${updatedName}"`
      );
    }
  }

  world.lastTierName = updatedName;
  world.lastUpdatedTierName = updatedName;
  world.pendingEditedTierName = undefined;
  world.originalTierName = undefined;
  console.log(`Sponsor Membership Tier "${updatedName}" updated successfully`);
});

Then('sponsor membership tier should be deleted successfully', async function () {
  ensurePageInitialized(this);
  const world = this as SponsorMembershipTierWorld;
  const tierName = world.deletedTierName || world.lastTierName;

  if (!tierName) {
    throw new Error('No sponsor membership tier name was stored for delete validation');
  }

  const listed = await sponsorMembershipTiersPage.isTierListed(tierName);
  if (listed) {
    throw new Error(`Sponsor Membership Tier "${tierName}" is still listed after delete`);
  }

  console.log(`Sponsor Membership Tier "${tierName}" deleted successfully`);
});

Then('sponsor membership tiers list should be empty', async function () {
  ensurePageInitialized(this);
  const tierCount = await sponsorMembershipTiersPage.getTierCount();

  if (tierCount !== 0) {
    throw new Error(`Expected sponsor membership tiers list to be empty, but found ${tierCount} tier(s)`);
  }
});

Then('user should be on Membership Tiers page', async function () {
  ensurePageInitialized(this);
  const loaded = await sponsorMembershipTiersPage.waitForMembershipTiersPage();

  if (!loaded) {
    throw new Error(`Navigation to Membership Tiers page failed. Current URL: ${this.page.url()}`);
  }
});

Then('sponsor tier system should show error {string}', async function (expectedError: string) {
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
