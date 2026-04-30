import { LocatorUtils } from "../utils/locatorUtils";

export const sponsorLocators = {
  // Menu Navigation
  sponsorsMenu: LocatorUtils.containsTextIn('h6', 'Sponsors', 1),
  sponsorListMenu: LocatorUtils.containsTextIn('h6', 'Sponsors List', 1),
  sponsorsListHeader: LocatorUtils.containsTextIn('h3', 'Sponsors', 1),
  membershipTiersMenu: LocatorUtils.containsTextIn('h6', 'Membership Tiers', 1),

  // Membership Tiers
    addNewSponsorTierButton: LocatorUtils.containsTextIn('button', 'Add New Tier'),
    tierNameInput: LocatorUtils.ID('tier_name'),
    minContributionInput: LocatorUtils.ID('min_contribution'),
    colorPickerTrigger: "//label[contains(normalize-space(.),'Color Code')]/ancestor::div[contains(@class,'MuiGrid-root')][1]//input[@type='text']",
    maxTeamSizeInput: LocatorUtils.ID('max_team_size'),
    saveTierButton: LocatorUtils.containsTextIn('button', 'Save Tier'),
    backToSponsorsButton: LocatorUtils.containsTextIn('button', 'Back to Sponsors'),
     
  // Create Sponsor
    addNewSponsorButton: LocatorUtils.containsTextIn('button', 'Add Sponsors'),
    companyNameInput: LocatorUtils.ID('companyName'),
    emailInput: LocatorUtils.ID('email'),  
    industryInput: LocatorUtils.ID('industry'),
    contactPersonInput: LocatorUtils.ID('contact_person'),
    phoneInput: LocatorUtils.byAttribute('input', 'placeholder', 'Phone number'),
    membershipTypeDropdown: LocatorUtils.containsTextIn('p', 'Select Membership Type'),
    chooseMembershipTypeOption: (membershipType: string) => `//li[normalize-space(.)='${membershipType}']`,
    contributionAmountInput: LocatorUtils.containsTextIn('label', 'Contribution Amount'),
    createSponsorButton: LocatorUtils.containsTextIn('button', 'Create Sponsor'),

  












}