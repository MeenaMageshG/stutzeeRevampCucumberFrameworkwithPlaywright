import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { HallManagementPage } from '../pages/hallManagementPage';

let hallPage: HallManagementPage;

Then('user navigates to eventManagementMenu', async function () {
  hallPage = new HallManagementPage(this.page);
  await hallPage.navigateToEventManagement();
});

Then('user clicks the sessionManagementMenu', async function () {
  await hallPage.navigateToSessionManagement();
});

Given('I navigate to Hall Management', async function () {
  await hallPage.openHallManagement();
});

When('I create a hall with name {string} and location {string}', async function (name: string, location: string) {
  await hallPage.addHall(name, location);
});

Then('the hall {string} should be visible in the hall listing', async function (name: string) {
  await expect(this.page.locator(`text=${name}`)).toBeVisible();
});
