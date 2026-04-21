import { Page } from '@playwright/test';
import { hallManagementLocators } from '../locators/hallManagementLocators';

export class HallManagementPage {
  constructor(private page: Page) {}

  async navigateToEventManagement() {
    await this.page.locator(hallManagementLocators.eventManagementMenu).click();
  }

  async navigateToSessionManagement() {
    await this.page.locator(hallManagementLocators.sessionManagementMenu).click();
  }

  async openHallManagement() {
    await this.page.locator(hallManagementLocators.manageHallButton).click();
  }

  async addHall(name: string, location: string) {
    await this.page.locator(hallManagementLocators.hallCard).click();
    await this.page.locator(hallManagementLocators.hallNameField).fill(name);
    await this.page.locator(hallManagementLocators.locationField).fill(location);
    await this.page.locator(hallManagementLocators.createBtn).click();
  }

  async backToSession() {
    await this.page.locator(hallManagementLocators.backToSessionBtn).click();
  }
}
