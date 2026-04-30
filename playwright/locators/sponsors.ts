import { LocatorUtils } from "../utils/locatorUtils";

export const sponsorLocators = {
  sponsorsMenu: LocatorUtils.containsTextIn('h6', 'Sponsors', 1),
  sponsorListMenu: LocatorUtils.containsTextIn('h6', 'Sponsors List', 1),
  sponsorsListHeader: LocatorUtils.containsTextIn('h3', 'Sponsors', 1),
  membershipTiersMenu: LocatorUtils.containsTextIn('h6', 'Membership Tiers', 1),
  backToSponsorsButton: "//button[normalize-space(.) = 'Back to Sponsors' or normalize-space(.) = 'Back To Sponsor' or contains(normalize-space(.), 'Back to Sponsor')]",

  addNewSponsorTierButton: LocatorUtils.containsTextIn('button', 'Add New Tier'),
  tierNameInput: LocatorUtils.ID('tier_name'),
  minContributionInput: LocatorUtils.ID('min_contribution'),
  colorPickerTrigger: "//label[contains(normalize-space(.),'Color Code')]/ancestor::div[contains(@class,'MuiGrid-root')][1]//input[@type='text']",
  maxTeamSizeInput: LocatorUtils.ID('max_team_size'),
  saveTierButton: LocatorUtils.containsTextIn('button', 'Save Tier'),

  addNewSponsorButton: LocatorUtils.containsTextIn('button', 'Add Sponsors'),
  companyNameInput: LocatorUtils.byAttribute('input', 'placeholder', 'Enter company name'),
  emailInput: LocatorUtils.ID('email'),
  industryInput: LocatorUtils.ID('industry'),
  contactPersonInput: LocatorUtils.ID('contact_person'),
  phoneInput: LocatorUtils.byAttribute('input', 'placeholder', 'Mobile number'),
  membershipTypeDropdown: LocatorUtils.ID('mui-component-select-membership_type'),
  chooseMembershipTypeOption: (membershipType: string) => `//li[normalize-space(.)='${membershipType}']`,
  contributionAmountInput: LocatorUtils.ID('contribution_amount'),
  createSponsorButton: "//button[normalize-space(.) = 'Create Sponsor' or normalize-space(.) = 'Update Sponsor' or normalize-space(.) = 'Save Changes' or normalize-space(.) = 'Update']",

  sponsorCard: 'div.MuiCard-root',
  sponsorRow: 'tr',
  sponsorText: (name: string) => `//*[normalize-space(.)='${name}']`,
};
