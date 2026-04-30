Feature: Sponsor Membership Tiers Management

  Background:
   Given user is logged in
    And user clicks organizer menu
    Then impersonate to the first orgnaizer in the list
    And user clicks on Events in side menu
    And user selects first event from list
    Then user should navigate to event dashboard
    And user clicks on Sponsor Tiers module
    And user clicks on Sponsor Tiers menu
    Then user should be on Membership Tiers page

  Scenario: Create a valid Sponsor Membership Tier
    And user clicks on Create New Tier button
    And user enters tier name "Gold Tier"
    And user enters minimum contribution "5000"
    And user enters color code "#FFD700"
    And user enters max team size "10"
    And user enters benefit "Priority Booth Placement"
    And user clicks on Save Tier button
    Then sponsor membership tier should be created successfully

  Scenario: Create Sponsor Membership Tier with decimal contribution
    And user clicks on Create New Tier button
    And user enters tier name "Diamond Tier"
    And user enters minimum contribution "7500.50"
    And user enters color code "#1E90FF"
    And user enters max team size "12"
    And user enters benefit "VIP Networking Lounge"
    And user clicks on Save Tier button
    Then sponsor membership tier should be created successfully

  Scenario: Create Tier without benefit
    And user clicks on Create New Tier button
    And user enters tier name "Bronze Tier"
    And user enters minimum contribution "1000"
    And user enters color code "#CD7F32"
    And user enters max team size "3"
    And user enters benefit ""
    And user clicks on Save Tier button
    Then sponsor membership tier should be created successfully

  Scenario: Read an existing Sponsor Membership Tier from list
    Given sponsor membership tier exists with name "Read Tier", minimum contribution "2500", color code "#114488", max team size "6", and benefit "Branding on stage"
    Then sponsor membership tier "__CREATED_TIER_NAME__" should be listed
    And sponsor membership tier card for "__CREATED_TIER_NAME__" should contain text "Branding on stage"

  Scenario: Create Tier with missing name
    And user clicks on Create New Tier button
    And user enters tier name ""
    And user enters minimum contribution "3000"
    And user enters color code "#00FF00"
    And user enters max team size "5"
    And user enters benefit "Logo on Website"
    And user clicks on Save Tier button
    Then sponsor tier system should show error "Tier name is required"

  Scenario: Create Tier with missing minimum contribution
    And user clicks on Create New Tier button
    And user enters tier name "Silver Tier"
    And user enters minimum contribution ""
    And user enters color code "#C0C0C0"
    And user enters max team size "5"
    And user enters benefit "Social Media Promotion"
    And user clicks on Save Tier button
    Then sponsor tier system should show error "Min Contribution is required"

  Scenario: Create Tier with invalid contribution
    And user clicks on Create New Tier button
    And user enters tier name "Silver Tier"
    And user enters minimum contribution "abc"
    And user enters color code "#C0C0C0"
    And user enters max team size "5"
    And user enters benefit "Social Media Promotion"
    And user clicks on Save Tier button
    Then sponsor tier system should show error "Min Contribution is required"

  Scenario: Update an existing Sponsor Membership Tier
    Given sponsor membership tier exists with name "Update Tier", minimum contribution "3500", color code "#336699", max team size "8", and benefit "Newsletter Mention"
    When user clicks edit for sponsor membership tier "__CREATED_TIER_NAME__"
    And user enters tier name "Updated Gold Tier"
    And user enters minimum contribution "4200.75"
    And user clicks on Save Tier button
    Then sponsor membership tier should be updated successfully

  Scenario: Delete an existing Sponsor Membership Tier
    Given sponsor membership tier exists with name "Delete Tier", minimum contribution "1800", color code "#A0522D", max team size "4", and benefit "Booth Listing"
    When user clicks delete for sponsor membership tier "__CREATED_TIER_NAME__"
    Then sponsor membership tier should be deleted successfully

  Scenario: Delete all Sponsor Membership Tiers
    When user deletes all sponsor membership tiers
    Then sponsor membership tiers list should be empty
