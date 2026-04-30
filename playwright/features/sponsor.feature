Feature: Sponsor Management

  Background:
    Given user is logged in
    And user clicks organizer menu
    Then impersonate to the first orgnaizer in the list
    And user clicks on Events in side menu
    And user selects first event from list
    Then user should navigate to event dashboard
    And user clicks on Sponsors menu
    And user clicks on Membership Tiers menu
    Given sponsor membership tier exists with name "Gold Tier", minimum contribution "5000", color code "#FFD700", max team size "10", and benefit "Priority Booth Placement"
    And user clicks on Back to Sponsors button
    Then sponsor list page should be visible

  Scenario: Create a valid sponsor
    And user clicks on Add New Sponsor button
    And user enters sponsor details "TechCorp" "techcorp@example.com" "Technology" "John Doe" "9876543210" "__CREATED_TIER_NAME__" "5000"
    And user clicks on Create Sponsor button
    Then sponsor "TechCorp" should be created successfully

  Scenario: Create sponsor with missing company name (Negative)
    And user clicks on Add New Sponsor button
    And user enters sponsor details "" "abc@example.com" "Retail" "Jane Doe" "9876543210" "__CREATED_TIER_NAME__" "3000"
    And user clicks on Create Sponsor button
    Then system should show sponsor error "Company name is required"

  Scenario: Create sponsor with invalid email (Negative)
    And user clicks on Add New Sponsor button
    And user enters sponsor details "RetailCorp" "invalidEmail" "Retail" "Jane Doe" "9876543210" "__CREATED_TIER_NAME__" "3000"
    And user clicks on Create Sponsor button
    Then system should show sponsor error "Invalid email format"

  Scenario: Create sponsor with missing membership type (Negative)
    And user clicks on Add New Sponsor button
    And user enters sponsor details "EduCorp" "edu@example.com" "Education" "Alice" "9876543210" "" "2000"
    And user clicks on Create Sponsor button
    Then system should show sponsor error "Membership type is required"

  Scenario: Create sponsor with invalid phone number (Negative)
    And user clicks on Add New Sponsor button
    And user enters sponsor details "HealthCorp" "health@example.com" "Healthcare" "Bob" "abcd1234" "__CREATED_TIER_NAME__" "1000"
    And user clicks on Create Sponsor button
    Then system should show sponsor error "Invalid phone number"

  Scenario: Update an existing sponsor
    Given sponsor exists with company "UpdateCorp", email "updatecorp@example.com", industry "Technology", contact person "Jane Doe", phone "9876543210", membership type "__CREATED_TIER_NAME__", and contribution "5000"
    When user clicks edit for sponsor "__CREATED_SPONSOR_NAME__"
    And user enters sponsor details "UpdatedCorp" "updatedcorp@example.com" "Technology" "Jane Smith" "9876543211" "__CREATED_TIER_NAME__" "7500"
    And user clicks on Create Sponsor button
    Then sponsor should be updated successfully

  Scenario: Delete an existing sponsor
    Given sponsor exists with company "DeleteCorp", email "deletecorp@example.com", industry "Retail", contact person "John Smith", phone "9876543212", membership type "__CREATED_TIER_NAME__", and contribution "2500"
    When user clicks delete for sponsor "__CREATED_SPONSOR_NAME__"
    Then sponsor should be deleted successfully
