import { Before, After, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium, Browser, Page, BrowserContext } from '@playwright/test';

let browser: Browser;
let context: BrowserContext;
let page: Page;

setDefaultTimeout(60 * 1000);

Before(async function () {
  browser = await chromium.launch({
    headless: false,
    args: ['--start-maximized'] // ✅ maximize at browser level
  });

  context = await browser.newContext({
    viewport: null // ✅ removes fixed viewport → full screen
  });

  page = await context.newPage();
  this.page = page;
});

After(async function () {
  await browser.close();
});