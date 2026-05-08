import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { OrganizerTeamsPrivilegesPage } from '../pages/organizerTeamPrevilegePage';

let privilegesPage: OrganizerTeamsPrivilegesPage;
let lastRoleName: string;

function ensurePageInitialized(context: any) {
  privilegesPage = new OrganizerTeamsPrivilegesPage(context.page);
}

When('user creates organizer role {string}', async function (name: string) {
  ensurePageInitialized(this);
  lastRoleName = await privilegesPage.createRole(name);
});

Then('role {string} should be created successfully', async function (name: string) {
  ensurePageInitialized(this);
  // Use the argument provided by the feature file
  expect(lastRoleName).toContain(name);
});

When('user views privileges of role {string}', async function (name: string) {
  ensurePageInitialized(this);
  await privilegesPage.viewPrivileges(lastRoleName);
});

When('user updates privileges with:', async function (dataTable) {
  ensurePageInitialized(this);
  const permissions = dataTable.raw().flat();
  await privilegesPage.updatePrivileges(permissions);
});

Then('role privileges should be updated successfully', async function () {
  ensurePageInitialized(this);
  const updated = await privilegesPage.privilegesUpdatedSuccessfully();
  expect(updated).toBeTruthy();
});

When('user goes back to Team Members', async function () {
  ensurePageInitialized(this);
  await privilegesPage.clickBackToTeamMembers();
});
