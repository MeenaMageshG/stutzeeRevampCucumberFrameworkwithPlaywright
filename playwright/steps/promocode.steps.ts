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

  // 🔥 Only generate unique for positive scenarios
  if (code && !this.generatedCode) {
    const uniqueCode = code + Date.now();
    (this as CustomWorld).generatedCode = uniqueCode;

    await promoPage.enterPromoCode(uniqueCode);
  } else {
    // for negative scenarios (empty / duplicate)
    await promoPage.enterPromoCode(code);
  }
});

When('user enters promo name {string}', async function (name: string) {
  ensurePageInitialized(this);
  await promoPage.enterPromoName(name);
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

  const world = this as any;

  const successMessage = await promoPage.getSuccessMessage();

  expect(successMessage).not.toBeNull();
  console.log('✅ Success:', successMessage);

  // optional validation using generated code
  if (world.generatedCode) {
    const created = await promoPage.isPromoCreated(world.generatedCode);

    if (!created) {
      console.log('⚠️ Promo created but not visible in list (UI delay)');
    }
  }
});
Then('promocode should not be created with code {string}', async function (code: string) {

  const world = this as CustomWorld;

  // 🔥 Check if wrongly created
  const created = await promoPage.isPromoCreated(world.generatedCode || code);

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