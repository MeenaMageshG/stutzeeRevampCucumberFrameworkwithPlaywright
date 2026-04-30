import { Given, When, Then } from '@cucumber/cucumber';
import { LoginPage } from '../pages/loginPage';
import { DashboardPage } from '../pages/dashboardPage';
import { AssertionUtils } from '../utils/asserstionUtils';

let loginPage: LoginPage;
let dashboardPage: DashboardPage;
let assertion: AssertionUtils;

Given('user is logged in', async function () {
  loginPage = new LoginPage(this.page);
  dashboardPage = new DashboardPage(this.page);
  assertion = new AssertionUtils(this.page);

  await loginPage.navigateToLogin();

  // ✅ Use ENV-based login
  await loginPage.loginWithValidUser();

  // ✅ Wait for dashboard load
  await this.page.waitForURL('**/dashboard', { timeout: 60000 });
});

When('user navigates to dashboard', async function () {
  // ✅ Verify dashboard URL
  await assertion.verifyUrlContains('/dashboard');
});

When('user clicks on Organisers in side menu', async function () {
  await dashboardPage.clickOrganizerMenu();
});

When('user clicks organizer menu', async function () {
  await dashboardPage.clickOrganizerMenu();
});

When('user impersonates organiser', async function () {
  await dashboardPage.clickImpersonateButton();
});

Then('impersonate to the first orgnaizer in the list', async function () {
  await dashboardPage.clickImpersonateButton();
});

When('user clicks on Events in side menu', async function () {
  await dashboardPage.clickEventsMenu();
});

When('user selects first event from list', async function () {
  await dashboardPage.selectFirstEvent();
});

Then('user should navigate to event dashboard', async function () {
  const url = this.page.url();

  if (!url.includes('event')) {
    throw new Error('Navigation to event dashboard failed');
  }
});