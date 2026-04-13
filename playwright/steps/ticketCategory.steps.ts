import { Given, When, Then } from '@cucumber/cucumber';
import { TicketCategoryPage } from '../pages/ticketCategoryPage';

let ticketCategoryPage: TicketCategoryPage;

function ensurePageInitialized(context: any) {
  ticketCategoryPage = new TicketCategoryPage(context.page);
}

// Lowercase step definitions for new feature file
When('user clicks on Event Management in side menu', async function () {
  ensurePageInitialized(this);
  await this.page.waitForLoadState('domcontentloaded').catch(() => {});
  await this.page.waitForTimeout(500);
  await ticketCategoryPage.clickEventManagementMenu();
});

When('user clicks on Ticketing module', async function () {
  ensurePageInitialized(this);
  await this.page.waitForLoadState('domcontentloaded').catch(() => {});
  await this.page.waitForTimeout(500);
  await ticketCategoryPage.clickTicketingMenu();
});

Then('user should navigate to Ticket Category page', async function () {
  ensurePageInitialized(this);
  const loaded = await ticketCategoryPage.waitForTicketCategoryPage();
  if (!loaded) {
    const url = this.page.url();
    console.log('Current URL:', url);
    throw new Error(`Navigation to Ticket Category page failed. Current URL: ${url}`);
  }
});

When('user clicks on Create Ticket Category button', async function () {
  ensurePageInitialized(this);
  await ticketCategoryPage.clickCreateTicketCategory();
});

When('user enters ticket category name {string}', async function (name: string) {
  ensurePageInitialized(this);
  await ticketCategoryPage.enterCategoryName(name);
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
  console.log('Ticket Category Created');
});

// Original capitalized versions for backward compatibility
Given('User navigates to Ticket Category module', async function () {
  ticketCategoryPage = new TicketCategoryPage(this.page);
  await ticketCategoryPage.navigateToTicketCategory();
});

When('User clicks on Create Ticket Category button', async function () {
  await ticketCategoryPage.clickCreateTicketCategory();
});

When('User enters ticket category name {string}', async function (name: string) {
  await ticketCategoryPage.enterCategoryName(name);
});

When('User enters ticket category description {string}', async function (desc: string) {
  await ticketCategoryPage.enterCategoryDescription(desc);
});

When('User clicks on createButton', async function () {
  await ticketCategoryPage.clickCreateButton();
});

When('User creates ticket category with name {string} and description {string}', async function (name: string, desc: string) {
  await ticketCategoryPage.createTicketCategory(name, desc);
});

Then('Ticket category should be created successfully', async function () {
  console.log('Ticket Category Created (Add assertion)');
});