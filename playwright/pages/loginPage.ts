import { Page } from '@playwright/test';
import { loginLocators } from '../locators/loginLocators';
import { ActionUtils } from '../utils/actionUtils';

export class LoginPage {
  private action: ActionUtils;

  constructor(private page: Page) {
    this.action = new ActionUtils(page);
  }

  async navigateToLogin() {
    await this.action.navigate('https://crm.stutzee.xyz/login');
  }

  async enterUsername(username: string) {
    await this.action.fill(loginLocators.username, username);
  }

  async enterPassword(password: string) {
    await this.action.fill(loginLocators.password, password);
  }

  async clickLogin() {
    await this.action.click(loginLocators.loginBtn);
  }

  async login(username: string, password: string) {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
  }
}