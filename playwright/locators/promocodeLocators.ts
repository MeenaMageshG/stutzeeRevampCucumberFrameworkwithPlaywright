import { LocatorUtils } from "../utils/locatorUtils";

export const promoCodeLocators = {
  eventManagementMenu: LocatorUtils.containsTextIn('h6', 'Event Management', 1),
  promocodemenu: LocatorUtils.containsTextIn('h6', 'Promo Codes', 1),
  addNewPromoButton: LocatorUtils.containsTextIn('button', 'Add New Promocode'),
  promoCodeInput: LocatorUtils.ID('code'),
  promoNameInput: LocatorUtils.ID('name'),
  discountTypeAmount: LocatorUtils.containsTextIn('button', 'Amount'),
  discountValueInput: LocatorUtils.ID('discount_value'),
  maxusageInput: LocatorUtils.ID('maximum_usage'),
  expiryDateInput: LocatorUtils.byAttribute('input', 'placeholder', 'MM/DD/YYYY'),
  //expiryDateInput: LocatorUtils.byAttribute('input', 'placeholder', 'MM/DD/YYYY', 2),
  activeButton: LocatorUtils.containsTextIn('button', 'Active'),
  inactiveButton: LocatorUtils.containsTextIn('button', 'Inactive'),
  applicableTicketsCard: "//h6[normalize-space(.)='Applicable Tickets']/ancestor::div[contains(@class,'MuiCard-root')][1]",
  ticketCardByName: (ticketName: string) =>
    `xpath=.//h5[normalize-space(.)='${ticketName}']/ancestor::div[contains(@class,'MuiCard-root')][1]`,
  ticketCardByPartialName: (ticketName: string) =>
    `xpath=.//h5[contains(translate(normalize-space(.),'abcdefghijklmnopqrstuvwxyz','ABCDEFGHIJKLMNOPQRSTUVWXYZ'),'${ticketName.trim().toUpperCase()}')]/ancestor::div[contains(@class,'MuiCard-root')][1]`,
  promoCardByName: (promoName: string) =>
    `//h5[normalize-space(.)='${promoName}']/ancestor::div[contains(@class,'MuiCard-root')][1]`,
  createPromoButton: LocatorUtils.containsTextIn('button', 'Create Promocode'),
};
