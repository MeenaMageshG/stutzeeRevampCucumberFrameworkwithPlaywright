import { Given, When, Then } from '@cucumber/cucumber';
import { LoginPage } from '../pages/loginPage';
import { AssertionUtils } from '../utils/asserstionUtils';
import { loginLocators } from '../locators/loginLocators';

let loginPage: LoginPage;
let assertion: AssertionUtils;

Given('user is on login page', async function () {
  loginPage = new LoginPage(this.page);
  assertion = new AssertionUtils(this.page);

  await loginPage.navigateToLogin();
});

When('user enters username {string}', async function (username: string) {
  await loginPage.enterUsername(username);
});

When('user enters password {string}', async function (password: string) {
  await loginPage.enterPassword(password);
});

When('user clicks login button', async function () {
  await loginPage.clickLogin();
});

Then('user should be redirected to dashboard', async function () {
  await assertion.verifyUrlContains('dashboard');
});

Then('user should see login error message', async function () {
  await assertion.verifyElementVisible(loginLocators.errorMsg);
});