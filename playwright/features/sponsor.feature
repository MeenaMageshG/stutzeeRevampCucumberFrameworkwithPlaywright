Feature: Sponsor Management

  Scenario: Create a valid sponsor
    Given user is logged in
    And user clicks on Sponsors menu
    And user clicks on Sponsors List menu
    And user clicks on Add New Sponsor button
    And user enters sponsor details "TechCorp" "techcorp@example.com" "Technology" "John Doe" "9876543210" "Gold Tier" "5000"
    And user clicks on Create Sponsor button
    Then sponsor "TechCorp" should be created successfully

  Scenario: Create sponsor with missing company name (Negative)
    Given user is logged in
    And user clicks on Sponsors menu
    And user clicks on Sponsors List menu
    And user clicks on Add New Sponsor button
    And user enters sponsor details "" "abc@example.com" "Retail" "Jane Doe" "9876543210" "Silver Tier" "3000"
    And user clicks on Create Sponsor button
    Then system should show sponsor error "Company name is required"

  Scenario: Create sponsor with invalid email (Negative)
    Given user is logged in
    And user clicks on Sponsors menu
    And user clicks on Sponsors List menu
    And user clicks on Add New Sponsor button
    And user enters sponsor details "RetailCorp" "invalidEmail" "Retail" "Jane Doe" "9876543210" "Silver Tier" "3000"
    And user clicks on Create Sponsor button
    Then system should show sponsor error "Invalid email format"

  Scenario: Create sponsor with missing membership type (Negative)
    Given user is logged in
    And user clicks on Sponsors menu
    And user clicks on Sponsors List menu
    And user clicks on Add New Sponsor button
    And user enters sponsor details "EduCorp" "edu@example.com" "Education" "Alice" "9876543210" "" "2000"
    And user clicks on Create Sponsor button
    Then system should show sponsor error "Membership type is required"

  Scenario: Create sponsor with invalid phone number (Negative)
    Given user is logged in
    And user clicks on Sponsors menu
    And user clicks on Sponsors List menu
    And user clicks on Add New Sponsor button
    And user enters sponsor details "HealthCorp" "health@example.com" "Healthcare" "Bob" "abcd1234" "Bronze Tier" "1000"
    And user clicks on Create Sponsor button
    Then system should show sponsor error "Invalid phone number"
