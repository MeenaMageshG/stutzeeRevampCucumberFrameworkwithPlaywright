import { LocatorUtils } from "../utils/locatorUtils";

const tierCardXpath = (name: string) =>
  `//*[self::div or self::article or self::li][(.//*[normalize-space(text())='${name}'] or normalize-space(.)='${name}') and .//button][1]`;

export const sponsorMembershipTiersLocators = {
  sponsorsMenu: LocatorUtils.containsTextIn('h6', 'Sponsors', 1),
  sponsorMembershipTiersMenu: LocatorUtils.containsTextIn('h6', 'Membership Tiers', 1),
  membershipTiersHeader: LocatorUtils.containsTextIn('h3', 'Sponsors Tiers', 1),
  createTierButton: "//button[normalize-space(.) = 'Add New Tier']",
  tierDrawerTitle:
    "//h4[normalize-space(.) = 'Create Tier' or normalize-space(.) = 'Edit Tier' or normalize-space(.) = 'Update Tier']",
  tierNameInput: LocatorUtils.ID('tier_name'),
  minContributionInput: LocatorUtils.ID('min_contribution'),
  colorCodeInput:
    "//label[contains(normalize-space(.),'Color Code')]/ancestor::div[contains(@class,'MuiGrid-root')][1]//input[@type='text']",
  maxTeamSizeInput: LocatorUtils.ID('max_team_size'),
  benefitsInput: LocatorUtils.byAttribute('input', 'placeholder', 'Add a benefit and press enter'),
  saveTierButton:
    "//button[normalize-space(.) = 'Save Tier' or normalize-space(.) = 'Update Tier' or normalize-space(.) = 'Save Changes' or normalize-space(.) = 'Update']",
  tierNameCard: (name: string) => `//*[normalize-space(text())='${name}' or normalize-space(.)='${name}']`,
  tierCard: (name: string) => tierCardXpath(name),
  confirmDeleteButton:
    "//button[normalize-space(.) = 'Delete' or normalize-space(.) = 'Confirm' or normalize-space(.) = 'Yes' or normalize-space(.) = 'Yes, Delete']",
  errorMessages: ".MuiFormHelperText-root, .MuiTypography-caption, .MuiAlert-message",
  successMessages: ".MuiAlert-message, .MuiSnackbarContent-message",
};
