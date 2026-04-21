import { Page } from '@playwright/test';
import { loginLocators } from '../locators/loginLocators';
import { ActionUtils } from '../utils/actionUtils';
import { ENV } from '../config/env';

export class LoginPage {
  private action: ActionUtils;

  constructor(private page: Page) {
    this.action = new ActionUtils(page);
  }
async navigateToLogin() {
  await this.action.navigate(ENV.BASE_URL!);
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

  async loginWithValidUser() {
    if (!ENV.VALID_USERNAME || !ENV.VALID_PASSWORD) {
      throw new Error("❌ Valid credentials missing in .env");
    }

    await this.login(ENV.VALID_USERNAME, ENV.VALID_PASSWORD);
  }

  async loginWithInvalidUser() {
    if (!ENV.INVALID_USERNAME || !ENV.INVALID_PASSWORD) {
      throw new Error("❌ Invalid credentials missing in .env");
    }

    await this.login(ENV.INVALID_USERNAME, ENV.INVALID_PASSWORD);
  }
}