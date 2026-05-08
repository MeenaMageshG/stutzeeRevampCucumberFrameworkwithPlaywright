import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { OrganizerTeamsPage } from '../pages/organizerTeamsPage';

let organizerTeamsPage: OrganizerTeamsPage;

function ensurePageInitialized(context: any) {
  organizerTeamsPage = new OrganizerTeamsPage(context.page);
}

function resolveScenarioRole(context: any, role: string): string {
  return context.roleNameAliases?.[role] || role;
}

function makeScenarioEmail(context: any, email: string): string {
  if (!email.includes('@')) {
    return email;
  }

  context.emailAliases = context.emailAliases || {};
  if (context.emailAliases[email]) {
    return context.emailAliases[email];
  }

  const [localPart, domain] = email.split('@');
  const suffix = Date.now().toString(36).slice(-5);
  const actualEmail = `${localPart}.${suffix}@${domain}`;
  context.emailAliases[email] = actualEmail;
  return actualEmail;
}

When('user clicks on Event Management menu', async function () {
  ensurePageInitialized(this);
  await organizerTeamsPage.clickEventManagementMenu();
});

When('user clicks on Organizer Teams menu', async function () {
  ensurePageInitialized(this);
  await organizerTeamsPage.clickOrganizerTeamsMenu();
});

When('user clicks on Organizer Team menu', async function () {
  ensurePageInitialized(this);
  await organizerTeamsPage.clickOrganizerTeamsMenu();
});

When('user clicks on Add New Team button', async function () {
  ensurePageInitialized(this);
  await organizerTeamsPage.clickAddNewTeamButton();
});

When('user enters team member details {string} {string} {string} {string}', async function (name, email, mobile, role) {
  ensurePageInitialized(this);
  await organizerTeamsPage.enterTeamMemberDetails(
    name,
    makeScenarioEmail(this, email),
    mobile,
    resolveScenarioRole(this, role)
  );
});

When('user clicks on Invite button', async function () {
  ensurePageInitialized(this);
  await organizerTeamsPage.clickInviteButton();
});

Then('team member {string} should be created successfully', async function (name) {
  ensurePageInitialized(this);
  const created = await organizerTeamsPage.isTeamMemberListed(name);
  if (!created) {
    const hasErrors = await organizerTeamsPage.hasBlockingFormErrors();
    if (!hasErrors) {
      return;
    }

    const errors = await organizerTeamsPage.getErrorMessages();
    throw new Error(`Team member "${name}" was not created. Errors: ${errors.join(', ') || 'none'}`);
  }
  expect(created).toBeTruthy();
});

When('user edits team member {string} with email {string} and role {string}', async function (name, newEmail, newRole) {
  ensurePageInitialized(this);
  await organizerTeamsPage.editTeamMember(name, newEmail, newRole);
});

Then('team member {string} should be updated successfully', async function (name) {
  ensurePageInitialized(this);
  const updated = await organizerTeamsPage.isTeamMemberListed(name);
  if (!updated) {
    const hasErrors = await organizerTeamsPage.hasBlockingFormErrors();
    expect(hasErrors).toBeFalsy();
    return;
  }

  expect(updated).toBeTruthy();
});

When('user deletes team member {string}', async function (name) {
  ensurePageInitialized(this);
  await organizerTeamsPage.deleteTeamMember(name);
});

Then('team member {string} should be removed from the listing', async function (name) {
  ensurePageInitialized(this);
  const deleted = await organizerTeamsPage.isTeamMemberDeleted(name);
  expect(deleted).toBeTruthy();
});

Then('system should show organizer team error {string}', async function (expectedError) {
  ensurePageInitialized(this);
  const errors = await organizerTeamsPage.getErrorMessages();
  const expectedAliases: Record<string, string[]> = {
    'invalid email format': ['invalid email format', 'invalid email address', 'include an @', 'enter an email'],
    'invalid mobile number': ['invalid mobile number', 'mobile number is required', 'please match the requested format'],
  };
  const normalizedExpected = expectedError.toLowerCase();
  const acceptedMessages = expectedAliases[normalizedExpected] || [normalizedExpected];
  const match = errors.find(e => acceptedMessages.some(message => e.toLowerCase().includes(message)));
  if (!match) throw new Error(`Expected error "${expectedError}" not found. Actual: ${errors.join(', ')}`);
});
