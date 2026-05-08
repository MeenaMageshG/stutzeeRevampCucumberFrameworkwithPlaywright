import { Given, When, Then } from '@cucumber/cucumber';
import { SessionManagementPage } from '../pages/sessionManagementPage';
import { expect } from '@playwright/test';

let sessionManagementPage: SessionManagementPage;

function ensurePageInitialized(context: any) {
  sessionManagementPage = new SessionManagementPage(context.page);
}

When('user navigates to Session Management page', async function () {
  ensurePageInitialized(this);
  await sessionManagementPage.navigateToSessionManagement();
});

When('user clicks on Manage Halls', async function () {
  ensurePageInitialized(this);
  await sessionManagementPage.clickManageHalls();
});

When('user clicks on Add New Hall', async function () {
  ensurePageInitialized(this);
  await sessionManagementPage.clickAddNewHall();
});

When('user enters hall details with name {string} and location {string}', async function (name: string, location: string) {
  ensurePageInitialized(this);
  await sessionManagementPage.enterHallDetails(name, location);
});

When('user creates the hall', async function () {
  ensurePageInitialized(this);
  await sessionManagementPage.createHall();
});

When('user goes back to Session Management', async function () {
  ensurePageInitialized(this);
  await sessionManagementPage.backToSessionManagement();
});

When('user clicks on Manage Tracks', async function () {
  ensurePageInitialized(this);
  await sessionManagementPage.clickManageTracks();
});

When('user clicks on Add New Track', async function () {
  ensurePageInitialized(this);
  await sessionManagementPage.clickAddNewTrack();
});

When('user enters track details with name {string} and colour code {string}', async function (name: string, colourCode: string) {
  ensurePageInitialized(this);
  await sessionManagementPage.enterTrackDetails(name, colourCode);
});

When('user creates the track', async function () {
  ensurePageInitialized(this);
  await sessionManagementPage.createTrack();
});

When('user clicks on Add Session', async function () {
  ensurePageInitialized(this);
  await sessionManagementPage.clickAddSession();
});

When('user enters session details with name {string} and date {string} and start time {string} and end time {string}', async function (sessionName: string, sessionDate: string, startTime: string, endTime: string) {
  ensurePageInitialized(this);
  await sessionManagementPage.enterSessionDetails(sessionName, sessionDate, startTime, endTime);
});

When('user selects hall {string} for the session', async function (hallName: string) {
  ensurePageInitialized(this);
  await sessionManagementPage.selectHall(hallName);
});

When('user selects track {string} for the session', async function (trackName: string) {
  ensurePageInitialized(this);
  await sessionManagementPage.selectTrack(trackName);
});

When('user creates the session', async function () {
  ensurePageInitialized(this);
  await sessionManagementPage.createSession();
});

Then('session with name {string} should be created successfully', async function (sessionName: string) {
  ensurePageInitialized(this);
  const created = await sessionManagementPage.isSessionCreated(sessionName);
  expect(created).toBeTruthy();
  console.log(`Session "${sessionName}" created successfully`);
});

Then('user should see success message for hall creation', async function () {
  ensurePageInitialized(this);
  await this.page.waitForTimeout(1000);
  const message = await sessionManagementPage.getSuccessMessage();
  expect(message).toBeTruthy();
});

Then('user should see success message for track creation', async function () {
  ensurePageInitialized(this);
  await this.page.waitForTimeout(1000);
  const message = await sessionManagementPage.getSuccessMessage();
  expect(message).toBeTruthy();
});

Then('user should see all three halls in the list', async function () {
  ensurePageInitialized(this);
  const hallsPresent = await sessionManagementPage.verifyAllHallsPresent([
    'Conference Room A',
    'Conference Room B',
    'Workshop Space'
  ]);
  expect(hallsPresent).toBeTruthy();
});

Then('user should see all three tracks in the list', async function () {
  ensurePageInitialized(this);
  const tracksPresent = await sessionManagementPage.verifyAllTracksPresent([
    'DevOps',
    'Cloud Computing',
    'Security'
  ]);
  expect(tracksPresent).toBeTruthy();
});

Then('hall {string} with location {string} should be created successfully', async function (hallName: string, location: string) {
  ensurePageInitialized(this);
  const created = await sessionManagementPage.isHallCreated(hallName, location);
  expect(created).toBeTruthy();
  console.log(`Hall "${hallName}" with location "${location}" created successfully`);
});

Then('track {string} with colour {string} should be created successfully', async function (trackName: string, colourCode: string) {
  ensurePageInitialized(this);
  const created = await sessionManagementPage.isTrackCreated(trackName, colourCode);
  expect(created).toBeTruthy();
  console.log(`Track "${trackName}" with colour "${colourCode}" created successfully`);
});

Then('user should see error message {string}', async function (expectedMessage: string) {
  ensurePageInitialized(this);
  await this.page.waitForTimeout(500);
  const errorExists = await sessionManagementPage.verifyErrorMessage(expectedMessage);
  expect(errorExists).toBeTruthy();
  console.log(`Error message "${expectedMessage}" is displayed`);
});

Then('user should see error message for session with name {string}', async function (sessionName: string) {
  ensurePageInitialized(this);
  await this.page.waitForTimeout(500);
  const message = await sessionManagementPage.getErrorMessage();
  expect(message).toBeTruthy();
  console.log(`Error message for session creation is displayed: ${message}`);
});

Then('session with name {string} should be created successfully', async function (sessionName: string) {
  ensurePageInitialized(this);
  await this.page.waitForTimeout(1000);
  const created = await sessionManagementPage.isSessionCreated(sessionName);
  expect(created).toBeTruthy();
  console.log(`Session "${sessionName}" created successfully`);
});

Then('user navigates to event dashboard with event ID', async function () {
  ensurePageInitialized(this);
  await this.page.waitForURL(/event\/[a-zA-Z0-9]+/);
});

Then('the user clicks the sessionManagement', async function () {
  ensurePageInitialized(this);
  await sessionManagementPage.navigateToSessionManagement();
});
