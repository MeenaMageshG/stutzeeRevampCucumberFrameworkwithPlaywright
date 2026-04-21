Feature: Sponsor Membership Tiers Management

  Scenario: Navigate to Membership Tiers
    Given user is logged in
    And user clicks on Events in side menu
    And user selects first event from list
    Then user should navigate to event dashboard
    And user clicks on Event Management in side menu
    And user clicks on Sponsors module
    And user clicks on Membership Tiers menu
    Then user should be on Membership Tiers page

  Scenario: Create a valid Sponsor Membership Tier
    Given user is logged in
    And user clicks on Events in side menu
    And user selects first event from list
    Then user should navigate to event dashboard
    And user clicks on Event Management in side menu
    And user clicks on Sponsors module
    And user clicks on Membership Tiers menu
    And user clicks on Create New Tier button
    And user enters tier name "Gold Tier"
    And user enters minimum contribution "5000"
    And user enters color code "#FFD700"
    And user enters max team size "10"
    And user enters benefit "Priority Booth Placement"
    And user clicks on Save Tier button
    Then sponsor membership tier should be created successfully

  Scenario: Create Tier with missing name (Negative)
    Given user is logged in
    And user clicks on Events in side menu
    And user selects first event from list
    Then user should navigate to event dashboard
    And user clicks on Event Management in side menu
    And user clicks on Sponsors module
    And user clicks on Membership Tiers menu
    And user clicks on Create New Tier button
    And user enters tier name ""
    And user enters minimum contribution "3000"
    And user enters color code "#00FF00"
    And user enters max team size "5"
    And user enters benefit "Logo on Website"
    And user clicks on Save Tier button
    Then system should show error "Tier name is required"

  Scenario: Create Tier with invalid contribution (Negative)
    Given user is logged in
    And user clicks on Events in side menu
    And user selects first event from list
    Then user should navigate to event dashboard
    And user clicks on Event Management in side menu
    And user clicks on Sponsors module
    And user clicks on Membership Tiers menu
    And user clicks on Create New Tier button
    And user enters tier name "Silver Tier"
    And user enters minimum contribution "abc"
    And user enters color code "#C0C0C0"
    And user enters max team size "5"
    And user enters benefit "Social Media Promotion"
    And user clicks on Save Tier button
    Then system should show error "Min Contribution is required"

  Scenario: Create Tier without benefit
    Given user is logged in
    And user clicks on Events in side menu
    And user selects first event from list
    Then user should navigate to event dashboard
    And user clicks on Event Management in side menu
    And user clicks on Sponsors module
    And user clicks on Membership Tiers menu
    And user clicks on Create New Tier button
    And user enters tier name "Bronze Tier"
    And user enters minimum contribution "1000"
    And user enters color code "#CD7F32"
    And user enters max team size "3"
    And user enters benefit ""
    And user clicks on Save Tier button
    Then sponsor membership tier should be created successfully
