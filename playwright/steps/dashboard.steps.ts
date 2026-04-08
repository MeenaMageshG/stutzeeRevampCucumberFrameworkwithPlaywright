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
  await loginPage.login('demo@stutzee.com', '123456789');

  // ✅ Wait for dashboard load (IMPORTANT)
  await this.page.waitForURL('**/dashboard');
});

When('user clicks on hamburger menu', async function () {
  await dashboardPage.clickHamburgerMenu();
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