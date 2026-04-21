import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { TicketPage } from '../pages/createTicketPage';

let ticketPage: TicketPage;

function ensurePageInitialized(context: any) {
  ticketPage = new TicketPage(context.page);
}

When('user clicks on Create Ticket button', async function () {
  ensurePageInitialized(this);
  await ticketPage.clickCreateTicket();
});

When('user chooses category {string}', async function (category: string) {
  ensurePageInitialized(this);
  this.selectedTicketCategory = await ticketPage.chooseCategory(category);
});

When('user enters ticket name {string}', async function (name: string) {
  ensurePageInitialized(this);
  const uniqueName = name.trim().length > 0 ? `${name} ${Date.now()}` : name;
  this.lastTicketName = uniqueName;
  await ticketPage.enterTicketName(uniqueName);
});

When('user selects ticket type {string}', async function (type: string) {
  ensurePageInitialized(this);
  await ticketPage.selectTicketType(type as 'Free' | 'Paid');
});

When('user enters max attendees {string}', async function (count: string) {
  ensurePageInitialized(this);
  await ticketPage.enterMaxAttendees(count);
});

When('user enters base price {string}', async function (price: string) {
  ensurePageInitialized(this);
  await ticketPage.enterBasePrice(price);
});

When('user enters sales start date {string} and end date {string}', async function (start: string, end: string) {
  ensurePageInitialized(this);
  await ticketPage.enterSalesDates(start, end);
});

When('user selects visibility {string}', async function (scope: string) {
  ensurePageInitialized(this);
  await ticketPage.selectVisibility(scope as 'Public' | 'Hidden');
});

When('user selects initial state {string}', async function (state: string) {
  ensurePageInitialized(this);
  await ticketPage.selectInitialState(state as 'Active' | 'Inactive');
});

When('user enters perks {string}', async function (perks: string) {
  ensurePageInitialized(this);
  await ticketPage.enterPerks(perks);
});

When('user enters access terms {string}', async function (terms: string) {
  ensurePageInitialized(this);
  await ticketPage.enterAccessTerms(terms);
});

When('user clicks on Create Ticket button in form', async function () {
  ensurePageInitialized(this);
  await ticketPage.clickCreateButton();
});

Then('ticket should be created successfully with name {string}', async function (name: string) {
  ensurePageInitialized(this);
  const ticketName = this.lastTicketName || name;
  const category = this.selectedTicketCategory;
  const created = category
    ? await ticketPage.isTicketListedUnderCategory(ticketName, category)
    : await ticketPage.isTicketCreated(ticketName);

  expect(created).toBeTruthy();
  console.log(`✅ Ticket "${ticketName}" created successfully${category ? ` under category "${category}"` : ''}`);
});

Then('ticket should not be created with name {string}', async function (name: string) {
   const errorMessage = await ticketPage.getErrorMessage();
  expect(errorMessage).not.toBeNull();
  console.log('❌ Ticket creation failed as expected. Error:', errorMessage);

  if (name && name.trim().length > 0) {
    const created = await ticketPage.isTicketCreated(name);
    expect(created).toBeFalsy();
  }
});
