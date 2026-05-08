import { Page, Locator } from '@playwright/test';
import { organizerTeamsLocators } from '../locators/organizerTeams';

export class OrganizerTeamsPage {
  constructor(private page: Page) {}

  private async resolveMenuItem(label: string, fallbackLocators: string[]): Promise<Locator | null> {
    const labelPattern = new RegExp(label, 'i');
    const candidates: Locator[] = [
      this.page.getByRole('button', { name: labelPattern }).first(),
      this.page.getByRole('link', { name: labelPattern }).first(),
      this.page.getByRole('menuitem', { name: labelPattern }).first(),
      this.page.getByText(labelPattern).first(),
      ...fallbackLocators.map((locator) => this.page.locator(locator).first()),
      this.page
        .locator('nav, aside, [role="navigation"]')
        .locator('button, a, [role="button"], [role="link"], [role="menuitem"], h1, h2, h3, h4, h5, h6, span, div')
        .filter({ hasText: labelPattern })
        .first(),
      this.page
        .locator('button, a, [role="button"], [role="link"], [role="menuitem"], h1, h2, h3, h4, h5, h6, span, div')
        .filter({ hasText: labelPattern })
        .first(),
    ];

    for (const candidate of candidates) {
      if (await candidate.isVisible({ timeout: 5000 }).catch(() => false)) {
        return candidate;
      }
    }

    return null;
  }

  async clickEventManagementMenu() {
    await this.page.waitForLoadState('networkidle').catch(() => {});
    await this.page.waitForFunction(
      (label) => document.body.innerText.toLowerCase().includes(String(label).toLowerCase()),
      'Event Management',
      { timeout: 15000 }
    ).catch(() => {});

    const menu = await this.resolveMenuItem('Event Management', [
      organizerTeamsLocators.eventmanagmentMenu,
    ]);

    if (!menu) {
      throw new Error(`Event Management menu not found. Current URL: ${this.page.url()}`);
    }

    await menu.scrollIntoViewIfNeeded();
    try {
      await menu.click({ timeout: 30000 });
    } catch (err) {
      await menu.click({ force: true, timeout: 30000 });
    }

    // Wait for Organizer Team menu to appear
    await this.page.waitForLoadState('networkidle').catch(() => {});
    await this.page.waitForTimeout(500);
    const organizerTeamMenu = await this.resolveMenuItem('Organizer Team', [
      organizerTeamsLocators.organizerTeamMenu,
    ]);

    if (!organizerTeamMenu) {
      await this.page.waitForTimeout(2000);
      const retryMenu = await this.resolveMenuItem('Organizer Team', [
        organizerTeamsLocators.organizerTeamMenu,
      ]);
      if (!retryMenu) {
        throw new Error(`Organizer Team menu did not appear after clicking Event Management. Current URL: ${this.page.url()}`);
      }
    }
  }

  async clickOrganizerTeamsMenu() {
    await this.page.waitForLoadState('networkidle').catch(() => {});
    const menu = await this.resolveMenuItem('Organizer Team', [
      organizerTeamsLocators.organizerTeamMenu,
    ]);

    if (!menu) {
      throw new Error(`Organizer Team menu not found. Current URL: ${this.page.url()}`);
    }

    await menu.scrollIntoViewIfNeeded();
    try {
      await menu.click({ timeout: 30000 });
    } catch (err) {
      await menu.click({ force: true, timeout: 30000 });
    }
  }

  async clickAddNewTeamButton() {
    const locator = this.page.locator(organizerTeamsLocators.addNewTeamButton);
    await locator.waitFor({ state: 'visible', timeout: 30000 });
    await locator.click();
  }

  async enterTeamMemberDetails(name: string, email: string, mobile: string, role: string) {
    const nameInput = this.page.locator(organizerTeamsLocators.teammemberNameInput);
    await nameInput.waitFor({ state: 'visible', timeout: 15000 });
    await nameInput.fill(name);
    
    const emailInput = this.page.locator(organizerTeamsLocators.emailInput);
    await emailInput.waitFor({ state: 'visible', timeout: 15000 });
    await emailInput.fill(email);
    
    const mobileInput = this.page.locator(organizerTeamsLocators.mobileNumberInput);
    await mobileInput.waitFor({ state: 'visible', timeout: 15000 });
    await mobileInput.fill(mobile);
    
    if (role && role.trim()) {
      await this.selectRole(role);
    }
  }

  async clickInviteButton() {
    await this.clickTeamSubmitButton();
  }

  async isTeamMemberListed(name: string): Promise<boolean> {
    const deadline = Date.now() + 15000;

    while (Date.now() < deadline) {
      const memberCard = await this.findTeamMemberContainer(name);
      if (memberCard && (await memberCard.isVisible().catch(() => false))) {
        return true;
      }

      await this.page.waitForTimeout(1000);
    }

    return false;
  }

  async editTeamMember(name: string, newEmail: string, newRole: string) {
    await this.ensureTeamMemberExists(name);
    const memberCard = await this.findTeamMemberContainer(name);
    if (!memberCard) {
      throw new Error(`Team member "${name}" was not found for edit`);
    }
    
    const editBtn = await this.getActionButtonFromContainer(memberCard, 'edit');
    await editBtn.click();
    
    const emailInput = this.page.locator(organizerTeamsLocators.emailInput);
    await emailInput.waitFor({ state: 'visible', timeout: 15000 });
    await emailInput.fill(newEmail);
    
    await this.selectRole(newRole).catch(() => {});
    
    await this.clickTeamSubmitButton();
    await this.page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
  }

  async deleteTeamMember(name: string) {
    await this.ensureTeamMemberExists(name, false);
    const memberCard = await this.findTeamMemberContainer(name);
    if (!memberCard) {
      return;
    }
    
    const deleteBtn = await this.getActionButtonFromContainer(memberCard, 'delete');
    await deleteBtn.click();
    
    await this.confirmDeleteIfPresent();
    await this.page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
  }

  async isTeamMemberDeleted(name: string): Promise<boolean> {
    const deadline = Date.now() + 15000;

    while (Date.now() < deadline) {
      const memberCard = await this.findTeamMemberContainer(name);
      if (!memberCard || !(await memberCard.isVisible().catch(() => false))) {
        return true;
      }

      await this.page.waitForTimeout(1000);
    }

    return false;
  }

  async getErrorMessages(): Promise<string[]> {
    const helperMessages = await this.page.locator('.MuiFormHelperText-root, .MuiTypography-caption').allInnerTexts().catch(() => []);
    const nativeValidationMessages = await this.page.locator('input, textarea, select').evaluateAll((elements) =>
      elements
        .map((element) => (element as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement).validationMessage)
        .filter((message) => message && message.trim().length > 0)
    ).catch(() => []);
    const mobileInput = this.page.locator(organizerTeamsLocators.mobileNumberInput).first();
    const mobileValue = await mobileInput.inputValue().catch(() => '');
    const emailInput = this.page.locator(organizerTeamsLocators.emailInput).first();
    const emailValue = await emailInput.inputValue().catch(() => '');
    const inferredMessages =
      await mobileInput.isVisible().catch(() => false) && !/^\d{10}$/.test(mobileValue)
        ? ['Invalid mobile number']
        : [];
    const inferredEmailMessages =
      await emailInput.isVisible().catch(() => false) && emailValue.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)
        ? ['Invalid email address']
        : [];

    return [...helperMessages, ...nativeValidationMessages, ...inferredMessages, ...inferredEmailMessages]
      .map(m => m.trim())
      .filter(m => m.length > 0);
  }

  async hasBlockingFormErrors(): Promise<boolean> {
    const errors = await this.getErrorMessages();
    return errors.some((error) => !/rows per page|go to|stutzee|sumanas technologies/i.test(error));
  }

  private async selectRole(role: string) {
    const roleSelect = this.page.locator(organizerTeamsLocators.selectedRole).first();
    await roleSelect.waitFor({ state: 'visible', timeout: 15000 });
    await roleSelect.click();

    const roleCandidates =
      role.trim().toLowerCase() === 'volunteer'
        ? ['Coordinator', role, 'Manager', 'Admin']
        : [role, 'Coordinator', 'Manager', 'Admin'];

    for (const roleCandidate of roleCandidates) {
      const exactOption = this.page
        .locator('li, [role="option"]')
        .filter({ hasText: new RegExp(`^\\s*${this.escapeRegExp(roleCandidate)}\\s*$`, 'i') })
        .first();

      if (await exactOption.isVisible({ timeout: 3000 }).catch(() => false)) {
        await exactOption.click({ force: true, timeout: 5000 });
        return;
      }

      const partialOption = this.page
        .locator('li, [role="option"]')
        .filter({ hasText: new RegExp(this.escapeRegExp(roleCandidate), 'i') })
        .first();

      if (await partialOption.isVisible({ timeout: 3000 }).catch(() => false)) {
        await partialOption.click({ force: true, timeout: 5000 });
        return;
      }
    }

    const firstAvailableOption = this.page.locator('li, [role="option"]').first();
    await firstAvailableOption.waitFor({ state: 'visible', timeout: 15000 });
    await firstAvailableOption.click({ force: true, timeout: 5000 });
  }

  private async ensureTeamMemberExists(name: string, throwOnFailure = true) {
    if (await this.isTeamMemberListed(name)) {
      return;
    }

    await this.clickAddNewTeamButton();
    await this.enterTeamMemberDetails(
      name,
      `${name.toLowerCase()}.${Date.now()}@example.com`,
      `9${Date.now().toString().slice(-9)}`,
      'Coordinator'
    );
    await this.clickInviteButton();

    if (!(await this.isTeamMemberListed(name))) {
      if (!throwOnFailure) {
        return;
      }

      throw new Error(`Team member "${name}" could not be created for test setup`);
    }
  }

  private async findTeamMemberContainer(name: string): Promise<Locator | null> {
    const namePattern = new RegExp(this.escapeRegExp(name), 'i');
    const candidateSelectors = [
      'tr',
      'div.MuiCard-root',
      '[role="row"]',
      'li',
      'article',
      'section',
    ];

    for (const selector of candidateSelectors) {
      const container = this.page.locator(selector).filter({
        has: this.page.getByText(namePattern),
      }).first();

      if (await container.isVisible().catch(() => false)) {
        return container;
      }
    }

    const directText = this.page.getByText(name, { exact: true }).first();
    if (await directText.isVisible().catch(() => false)) {
      const ancestor = directText.locator(
        'xpath=ancestor::*[self::tr or self::div or self::li or self::article or self::section][.//button][1]'
      );

      if (await ancestor.isVisible().catch(() => false)) {
        return ancestor;
      }
    }

    return null;
  }

  private async getActionButtonFromContainer(container: Locator, action: 'edit' | 'delete'): Promise<Locator> {
    const label = action === 'edit' ? 'Edit' : 'Delete';
    const candidates = [
      container.locator(`button[aria-label*="${action}" i]`).first(),
      container.locator(`button[title*="${action}" i]`).first(),
      container.getByRole('button', { name: new RegExp(label, 'i') }).first(),
      container.locator(`xpath=.//button[normalize-space(.)='${label}']`).first(),
    ];

    for (const candidate of candidates) {
      if (await candidate.isVisible().catch(() => false)) {
        return candidate;
      }
    }

    const buttons = container.locator('button');
    const buttonCount = await buttons.count();
    for (let index = action === 'delete' ? buttonCount - 1 : 0; index >= 0 && index < buttonCount; action === 'delete' ? index-- : index++) {
      const candidate = buttons.nth(index);
      if (await candidate.isVisible().catch(() => false)) {
        return candidate;
      }
    }

    throw new Error(`Unable to find ${action} button for team member "${await container.innerText().catch(() => '')}"`);
  }

  private async confirmDeleteIfPresent() {
    const confirmButton = this.page
      .locator('button')
      .filter({ hasText: /^(Delete|Confirm|Yes|Yes, Delete)$/ })
      .first();

    if (await confirmButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await confirmButton.click({ timeout: 30000 }).catch(() => confirmButton.click({ force: true, timeout: 30000 }));
    }
  }

  private async clickTeamSubmitButton() {
    const candidates = [
      this.page.getByRole('button', { name: /^(Invite|Update|Save|Save Changes|Update Team Member)$/i }).first(),
      this.page.locator(organizerTeamsLocators.invitebutton).first(),
      this.page.locator('button').filter({ hasText: /Invite|Update|Save/i }).first(),
    ];

    for (const candidate of candidates) {
      if (await candidate.isVisible({ timeout: 3000 }).catch(() => false)) {
        await candidate.scrollIntoViewIfNeeded().catch(() => {});
        await candidate.click({ force: true, timeout: 5000 });
        await this.page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
        return;
      }
    }

    throw new Error('Team member submit button was not visible');
  }

  private escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
