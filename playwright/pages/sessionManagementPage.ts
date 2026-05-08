import { Page, Locator } from '@playwright/test';
import { sessionManagementLocators } from '../locators/sessionManagementLocators';
export class SessionManagementPage {
    constructor(private page: Page) {}

    async navigateToSessionManagement() {
        await this.page.click(sessionManagementLocators.eventmanagmentMenu);
        await this.page.click(sessionManagementLocators.sessionManagementMenu);
    }

    async clickManageHalls() {
        await this.page.click(sessionManagementLocators.ManageHallsButton);
    }

    async clickAddNewHall() {
        await this.page.click(sessionManagementLocators.addNewHallButton);
    }

    async enterHallDetails(name: string, location: string) {
        await this.page.fill(sessionManagementLocators.hallNameInput, name);
        await this.page.fill(sessionManagementLocators.hallLocationInput, location);
    }

    async createHall() {
        await this.page.click(sessionManagementLocators.createHallButton);
    }

    async backToSessionManagement() {
        await this.page.click(sessionManagementLocators.backtoSessionManagementButton);
    } 
    async clickManageTracks() {
        await this.page.click(sessionManagementLocators.manageTracksButton);
    }

    async clickAddNewTrack() {
        await this.page.click(sessionManagementLocators.addNewTrackButton);
    }

    async enterTrackDetails(name: string, colourCode: string) {
        await this.page.fill(sessionManagementLocators.trackNameInput, name);
        await this.page.fill(sessionManagementLocators.colourcodeInput, colourCode);
    }

    async createTrack() {
        await this.page.click(sessionManagementLocators.createTrackButton);
    }

    async clickAddSession() {
        await this.page.click(sessionManagementLocators.addsessionButton);
    }

    async enterSessionDetails(sessionName: string, sessionDate: string, startTime: string, endTime: string) {
        await this.page.fill(sessionManagementLocators.sessionNameInput, sessionName);
        await this.page.fill(sessionManagementLocators.sessionDate, sessionDate);
        await this.page.fill(sessionManagementLocators.startTimeInput, startTime);
        await this.page.fill(sessionManagementLocators.endTimeInput, endTime);
    }

    async selectHall(hallName: string) {
        await this.page.selectOption(sessionManagementLocators.halldropdown, { label: hallName });
    }

    async selectTrack(trackName: string) {
        await this.page.selectOption(sessionManagementLocators.trackdropdown, { label: trackName });
    }

    async createSession() {
        await this.page.click(sessionManagementLocators.createSessionButton);
    }   
    async isSessionCreated(sessionName: string): Promise<boolean> {
        const sessionLocator = this.page.locator(`text=${sessionName}`);
        return await sessionLocator.isVisible();
    }

    async isHallCreated(hallName: string, location: string): Promise<boolean> {
        const hallLocator = this.page.locator(`text=${hallName}`);
        const locationLocator = this.page.locator(`text=${location}`);
        return await hallLocator.isVisible() && await locationLocator.isVisible();
    }

    async isTrackCreated(trackName: string, colourCode: string): Promise<boolean> {
        const trackLocator = this.page.locator(`text=${trackName}`);
        const colourLocator = this.page.locator(`text=${colourCode}`);
        return await trackLocator.isVisible() && await colourLocator.isVisible();
    }

    async verifyAllHallsPresent(halls: string[]): Promise<boolean> {
        for (const hall of halls) {
            const hallLocator = this.page.locator(`text=${hall}`);
            if (!(await hallLocator.isVisible())) {
                return false;
            }
        }
        return true;
    }

    async verifyAllTracksPresent(tracks: string[]): Promise<boolean> {
        for (const track of tracks) {
            const trackLocator = this.page.locator(`text=${track}`);
            if (!(await trackLocator.isVisible())) {
                return false;
            }
        }
        return true;
    }

    async getSuccessMessage(): Promise<string | null> {
        try {
            const successLocator = this.page.locator('[class*="success"], [class*="Success"], [role="alert"]');
            const message = await successLocator.textContent();
            return message;
        } catch {
            return null;
        }
    }

    async getErrorMessage(): Promise<string | null> {
        try {
            const errorLocator = this.page.locator('[class*="error"], [class*="Error"], [class*="alert"], [role="alert"]');
            const message = await errorLocator.textContent();
            return message;
        } catch {
            return null;
        }
    }

    async verifyErrorMessage(expectedMessage: string): Promise<boolean> {
        try {
            const errorLocator = this.page.locator('text=' + expectedMessage);
            return await errorLocator.isVisible();
        } catch {
            return false;
        }
    }
}
