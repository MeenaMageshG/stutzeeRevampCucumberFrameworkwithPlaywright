import { LocatorUtils } from "../utils/locatorUtils";

export const sponsorMembershipTiersLocators = {
  sponsorsMenu: LocatorUtils.containsTextIn('h6', 'Sponsors', 1),
  sponsorMembershipTiersMenu: LocatorUtils.containsTextIn('h6', 'Membership Tiers', 1),
  membershipTiersHeader: LocatorUtils.containsTextIn('h3', 'Sponsors Tiers', 1),
  createTierButton: "//button[normalize-space(.) = 'Add New Tier']",
  tierDrawerTitle: "//h4[normalize-space(.) = 'Create Tier']",
  tierNameInput: LocatorUtils.ID('tier_name'),
  minContributionInput: LocatorUtils.ID('min_contribution'),
  colorCodeInput:
    "//label[contains(normalize-space(.),'Color Code')]/ancestor::div[contains(@class,'MuiGrid-root')][1]//input[@type='text']",
  maxTeamSizeInput: LocatorUtils.ID('max_team_size'),
  benefitsInput: LocatorUtils.byAttribute('input', 'placeholder', 'Add a benefit and press enter'),
  saveTierButton: "//button[normalize-space(.) = 'Save Tier']",
  tierNameCard: (name: string) => `//*[normalize-space(.)='${name}']`,
  errorMessages: ".MuiFormHelperText-root, .MuiTypography-caption",
};
