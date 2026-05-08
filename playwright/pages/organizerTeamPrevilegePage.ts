import { Page } from '@playwright/test';
import { organizerTeamsPrivilegesLocators } from '../locators/organizerTeamsPrevilages';

export class OrganizerTeamsPrivilegesPage {
  constructor(private page: Page) {}

  async clickManageRolesButton() {
    await this.page.locator(organizerTeamsPrivilegesLocators.manageRolesButton).click();
  }

  async createRole(name: string): Promise<string> {
    const uniqueName = `${name}_${Date.now()}`;
    await this.page.locator(organizerTeamsPrivilegesLocators.addNewRoleButton).click({ force: true });
    await this.page.locator(organizerTeamsPrivilegesLocators.roleNameInput).fill(uniqueName);
    await this.page.locator(organizerTeamsPrivilegesLocators.createRoleButton).click();
    return uniqueName;
  }

  async viewPrivileges(roleName: string) {
    await this.page.getByText(roleName, { exact: true }).click();
    await this.page.locator(organizerTeamsPrivilegesLocators.viewPrivilegesButton).click();
  }

  async updatePrivileges(permissions: string[]) {
    for (const permission of permissions) {
      await this.page.locator(organizerTeamsPrivilegesLocators.permissionCheckbox(permission)).click({ force: true });
    }
    await this.page.locator(organizerTeamsPrivilegesLocators.updatePrivilegeButton).click();
  }

  async clickBackToTeamMembers() {
  const candidates = [
    this.page.getByRole('button', { name: /back to team members/i }).first(),
    this.page.locator('button').filter({ hasText: /team members/i }).first(),
    this.page.getByRole('link', { name: /team members/i }).first(),
    this.page.getByText(/team members/i).first(),
  ];

  for (const candidate of candidates) {
    if (await candidate.isVisible({ timeout: 3000 }).catch(() => false)) {
      await candidate.click({ force: true, timeout: 10000 });
      await this.page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
      return;
    }
  }

  throw new Error(`Team Members navigation button was not visible. Current URL: ${this.page.url()}`);
}


  async privilegesUpdatedSuccessfully(): Promise<boolean> {
    const toast = this.page.getByText(/Privileges updated successfully/i);
    return await toast.isVisible({ timeout: 2000 }).catch(() => false);
  }
}
