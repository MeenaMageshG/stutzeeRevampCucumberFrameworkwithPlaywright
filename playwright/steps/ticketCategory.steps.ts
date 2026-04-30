import { Given, When, Then } from '@cucumber/cucumber';
import { TicketCategoryPage } from '../pages/ticketCategoryPage';

let ticketCategoryPage: TicketCategoryPage;

function ensurePageInitialized(context: any) {
  ticketCategoryPage = new TicketCategoryPage(context.page);
}

// Lowercase step definitions
When('user clicks on Event Management in side menu', async function () {
  ensurePageInitialized(this);
  // Wait for page to be fully loaded
  await this.page.waitForLoadState('domcontentloaded').catch(() => {});
  await this.page.waitForLoadState('load', { timeout: 10000 }).catch(() => {});
  await this.page.waitForTimeout(1000);
  console.log(`About to click Event Management. Current URL: ${this.page.url()}`);
  await ticketCategoryPage.clickEventManagementMenu();
});

When('user clicks on Ticketing module', async function () {
  ensurePageInitialized(this);
  await this.page.waitForLoadState('domcontentloaded').catch(() => {});
  await this.page.waitForLoadState('load', { timeout: 10000 }).catch(() => {});
  await this.page.waitForTimeout(500);
  console.log(`About to click Ticketing. Current URL: ${this.page.url()}`);
  await ticketCategoryPage.clickTicketingMenu();
});

Then('user should navigate to Ticket Category page', async function () {
  ensurePageInitialized(this);
  const loaded = await ticketCategoryPage.waitForTicketCategoryPage();
  if (!loaded) {
    throw new Error(`Navigation to Ticket Category page failed. Current URL: ${this.page.url()}`);
  }
});

When('user clicks on Create Ticket Category button', async function () {
  ensurePageInitialized(this);
  await ticketCategoryPage.clickCreateTicketCategory();
});

When('user enters ticket category name {string}', async function (baseName: string) {
  ensurePageInitialized(this);

  const uniqueName = `${baseName} ${Date.now()}`;
  this.lastCategoryName = uniqueName;

  await ticketCategoryPage.enterCategoryName(uniqueName);
});


When('user enters ticket category description {string}', async function (desc: string) {
  ensurePageInitialized(this);
  await ticketCategoryPage.enterCategoryDescription(desc);
});

When('user clicks on Create button', async function () {
  ensurePageInitialized(this);
  await ticketCategoryPage.clickCreateButton();
});

When('user clicks on createButton', async function () {
  ensurePageInitialized(this);
  await ticketCategoryPage.clickCreateButton();
});

Then('ticket category should be created successfully', async function () {
  ensurePageInitialized(this);
  const name = this.lastCategoryName;
  const listed = await ticketCategoryPage.isCategoryListed(name);
  if (!listed) {
    throw new Error(`Ticket category "${name}" was not found in the list`);
  }
  console.log(`Ticket Category "${name}" created and listed successfully`);
});

// Capitalized versions for backward compatibility
Given('User navigates to Ticket Category module', async function () {
  ticketCategoryPage = new TicketCategoryPage(this.page);
  await ticketCategoryPage.navigateToTicketCategory();
});

When('User clicks on Create Ticket Category button', async function () {
  await ticketCategoryPage.clickCreateTicketCategory();
});

When('User enters ticket category name {string}', async function (name: string) {
  this.lastCategoryName = name;
  await ticketCategoryPage.enterCategoryName(name);
});

When('User enters ticket category description {string}', async function (desc: string) {
  await ticketCategoryPage.enterCategoryDescription(desc);
});

When('User clicks on createButton', async function () {
  await ticketCategoryPage.clickCreateButton();
});

When('User creates ticket category with name {string} and description {string}', async function (name: string, desc: string) {
  this.lastCategoryName = name;
  await ticketCategoryPage.createTicketCategory(name, desc);
});

Then('Ticket category should be created successfully', async function () {
  const name = this.lastCategoryName;
  const listed = await ticketCategoryPage.isCategoryListed(name);
  if (!listed) {
    throw new Error(`Ticket category "${name}" was not found in the list`);
  }
  console.log(`Ticket Category "${name}" created and listed successfully`);
});
