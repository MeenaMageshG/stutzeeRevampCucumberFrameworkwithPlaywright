import { When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { PromoCodePage } from '../pages/promocodePage';

let promoPage: PromoCodePage;

function ensurePageInitialized(context: any) {
  promoPage = new PromoCodePage(context.page);
}

//
// 🔥 STORE DATA PER SCENARIO
//
interface CustomWorld {
  generatedCode?: string;
  generatedPromoName?: string;
  lastPromoCode?: string;
  lastPromoName?: string;
}

//
// ================= ACTION STEPS =================
//

When('user navigates to Promo Codes', async function () {
  ensurePageInitialized(this);
  await promoPage.navigateToPromoCodes();
});

When('user clicks on Add New Promocode button', async function () {
  ensurePageInitialized(this);
  await promoPage.clickAddNewPromo();
});

When('user enters promo code {string}', async function (code: string) {
  ensurePageInitialized(this);
  const world = this as CustomWorld;

  if (!code) {
    world.lastPromoCode = code;
    await promoPage.enterPromoCode(code);
    return;
  }

  if (code === '__LAST_PROMO_CODE__') {
    const duplicateCode = world.generatedCode || world.lastPromoCode;
    if (!duplicateCode) {
      throw new Error('No previously generated promo code is available for duplicate-code validation');
    }

    world.lastPromoCode = duplicateCode;
    await promoPage.enterPromoCode(duplicateCode);
    return;
  }

  const uniqueCode = `${code}${Date.now()}`;
  world.generatedCode = uniqueCode;
  world.lastPromoCode = uniqueCode;

  await promoPage.enterPromoCode(uniqueCode);
});

When('user enters promo name {string}', async function (name: string) {
  ensurePageInitialized(this);
  const world = this as CustomWorld;
  const uniqueName = name ? `${name} ${Date.now()}` : name;

  world.generatedPromoName = uniqueName;
  world.lastPromoName = uniqueName;

  await promoPage.enterPromoName(uniqueName);
});

When('user selects discount type Amount', async function () {
  ensurePageInitialized(this);
  await promoPage.selectDiscountTypeAmount();
});

When('user enters discount value {string}', async function (value: string) {
  ensurePageInitialized(this);
  await promoPage.enterDiscountValue(value);
});

When('user enters maximum usage {string}', async function (value: string) {
  ensurePageInitialized(this);
  await promoPage.enterMaxUsage(value);
});

When('user enters expiry date {string}', async function (date: string) {
  ensurePageInitialized(this);
  await promoPage.enterExpiryDate(date);
});

When('user selects status {string}', async function (status: string) {
  ensurePageInitialized(this);
  await promoPage.selectStatus(status as 'Active' | 'Inactive');
});

When('user selects ticket {string}', async function (ticket: string) {
  ensurePageInitialized(this);
  await promoPage.selectTicket(ticket);
});

When('user clicks on Create Promocode button', async function () {
  ensurePageInitialized(this);
  await promoPage.clickCreatePromo();
});

//
// ================= VALIDATIONS =================
//

Then('promocode should be created successfully with code {string}', async function (code: string) {
  ensurePageInitialized(this);
  const world = this as CustomWorld;
  const promoName = world.lastPromoName || code;
  const promoCode = world.lastPromoCode || code;
  const created = await promoPage.isPromoListed(promoName);

  expect(created).toBeTruthy();
  console.log(`✅ Promocode "${promoCode}" created successfully for promo "${promoName}"`);
});
Then('promocode should not be created with code {string}', async function (code: string) {
  ensurePageInitialized(this);
  const world = this as CustomWorld;
  const promoName = world.lastPromoName || '';

  const created = promoName ? await promoPage.isPromoListed(promoName) : false;

  if (created) {
    throw new Error(`❌ Promo should NOT be created, but it exists`);
  }

  // 🔥 Check validation / error
  const errorMessage = await promoPage.getErrorMessage();

  if (errorMessage) {
    console.log('❌ Error:', errorMessage);
  } else {
    console.log('⚠️ No validation message, but creation blocked');
  }

  expect(created).toBeFalsy();
});
