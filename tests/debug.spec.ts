import { test } from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

test.describe('debug privilege dialog', () => {
  test('navigate to privilege dialog', async ({ page, context, browser }) => {
    // Close the default context and create a new one with maximized viewport
    await context.close();
    const newContext = await browser!.newContext({
      viewport: { width: 1920, height: 1080 }, // Use standard full screen size instead of null
    });
    const newPage = await newContext.newPage();
    
    try {
      // Navigate to login
      const baseURL = process.env.BASE_URL || 'https://crm.stutzee.xyz/login';
      await newPage.goto(baseURL);
      
      // Login
      await newPage.fill('#username-login', process.env.VALID_USERNAME!);
      await newPage.fill('#-password-login', process.env.VALID_PASSWORD!);
      await newPage.click('button:has-text("Login")');
      
      // Wait for navigation to dashboard and page to fully load
      await newPage.waitForURL('**/dashboard', { waitUntil: 'networkidle' });
      await newPage.waitForLoadState('domcontentloaded');
      await newPage.waitForTimeout(2000); // Ensure sidebar is rendered
      
      // Navigate to organizer section using the sidebar link
      const organiserLink = newPage.locator('a[href="/organiser"]');
      await organiserLink.waitFor({ state: 'visible' });
      await organiserLink.click();
      
      // Wait for organizer page to load
      await newPage.waitForURL('**/organiser', { waitUntil: 'networkidle' });
      await newPage.waitForTimeout(1500);
      
      // Take a snapshot to see what's on the organizer page
      console.log('PAGE CONTENT AFTER NAVIGATING TO ORGANISER:');
      const organiserPageText = await newPage.evaluate(() => document.body.innerText);
      console.log(organiserPageText.substring(0, 2000));
      
      // Try to find impersonate button (without waiting)
      const allButtons = await newPage.locator('button').allTextContents();
      console.log('AVAILABLE BUTTONS:', allButtons.filter((text, idx) => idx < 20));
      
      // Look for events - use sidebar navigation or select from current page
      const eventsLink = newPage.locator('a[href*="/organiser"]').getByText('Events', { exact: false }).first();
      
      // If events link exists in sidebar, click it
      if (await eventsLink.isVisible({ timeout: 5000 }).catch(() => false)) {
        await eventsLink.click();
        await newPage.waitForLoadState('networkidle');
      }
      
      await newPage.waitForTimeout(1000);
      
      // Select first event - look for event button/link
      const eventButtons = await newPage.locator('button:has-text("01kqrpgsy42rqpf15b3p2nck6d")').all();
      if (eventButtons.length > 0) {
        await eventButtons[0].click();
        await newPage.waitForNavigation();
      } else {
        // If specific event not found, just proceed with available elements
        console.log('Specific event button not found');
      }
      
      await newPage.waitForTimeout(1500);
      
      // Look for Event Management link
      const eventMgmtLink = newPage.locator('a[href*="event-management"]').first();
      if (await eventMgmtLink.isVisible({ timeout: 5000 }).catch(() => false)) {
        await eventMgmtLink.click();
        await newPage.waitForLoadState('networkidle');
      }
      
      await newPage.waitForTimeout(1000);
      
      // Look for Organizer Team link
      const teamLink = newPage.locator('a[href*="organizer-team"]').first();
      if (await teamLink.isVisible({ timeout: 5000 }).catch(() => false)) {
        await teamLink.click();
        await newPage.waitForLoadState('networkidle');
      }
      
      await newPage.waitForTimeout(1000);
      
      // Click Manage Roles button
      const manageRolesButton = newPage.locator('button:has-text("Manage roles")').first();
      if (await manageRolesButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        await manageRolesButton.click();
        await newPage.waitForLoadState('networkidle');
      }
      
      await newPage.waitForTimeout(1500);
      
      // Find and click View Privilege button for Coordinator
      const coordinatorRow = newPage.locator('text=Coordinator').first();
      if (await coordinatorRow.isVisible({ timeout: 5000 }).catch(() => false)) {
        const viewPrivButton = coordinatorRow.locator('button:has-text("View Privilege")').first();
        if (await viewPrivButton.isVisible({ timeout: 5000 }).catch(() => false)) {
          await viewPrivButton.click();
          await newPage.waitForLoadState('networkidle');
        }
      }
      
      await newPage.waitForTimeout(2000);
      
      // Capture what's on the page
      const pageContent = await newPage.evaluate(() => {
        return {
          fullText: document.body.innerText,
          checkboxCount: document.querySelectorAll('input[type="checkbox"]').length,
          inviteFound: document.body.innerText.includes('Invite'),
          inviteMembers: document.body.innerText.includes('Invite Members'),
          allText: document.body.innerText.substring(0, 5000)
        };
      });
      
      console.log('=== PAGE CONTENT DEBUG ===');
      console.log(JSON.stringify(pageContent, null, 2));
      
      // Take a screenshot for manual inspection
      await newPage.screenshot({ path: 'debug-privilege-dialog.png', fullPage: true });
      
    } finally {
      // Clean up
      await newContext.close();
    }
  });
});
