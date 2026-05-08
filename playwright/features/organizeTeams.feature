Feature: Organizer Teams Management

  Background:
    Given user is logged in
    And user clicks organizer menu
    Then impersonate to the first orgnaizer in the list
    And user clicks on Events in side menu
    And user selects first event from list
    Then user should navigate to event dashboard
    And user clicks on Event Management menu
    And user clicks on Organizer Teams menu

  # ✅ Positive Case
  Scenario: Create a valid organizer team member
    When user clicks on Add New Team button
    And user enters team member details "Alice" "alice@example.com" "2847894500" "Coordinator"
    And user clicks on Invite button
    Then team member "Alice" should be created successfully

  # ❌ Negative Cases
  Scenario: Create team member with missing name
    When user clicks on Add New Team button
    And user enters team member details "" "bob@example.com" "9876543210" "Volunteer"
    And user clicks on Invite button
    Then system should show organizer team error "Name is required"

  Scenario: Create team member with invalid email
    When user clicks on Add New Team button
    And user enters team member details "Charlie" "invalidEmail" "9876543210" "Volunteer"
    And user clicks on Invite button
    Then system should show organizer team error "Invalid email format"

  Scenario: Create team member with invalid mobile number
    When user clicks on Add New Team button
    And user enters team member details "David" "david@example.com" "abcd1234" "Volunteer"
    And user clicks on Invite button
    Then system should show organizer team error "Invalid mobile number"

  Scenario: Create team member without selecting role
    When user clicks on Add New Team button
    And user enters team member details "Eve" "eve@example.com" "9876543210" ""
    And user clicks on Invite button
    Then system should show organizer team error "Role is required"

  # ✏️ Edit Case
  Scenario: Edit an existing team member
    When user edits team member "Alice" with email "alice.new@example.com" and role "Manager"
    Then team member "Alice" should be updated successfully

  # 🗑 Delete Case
  Scenario: Delete an existing team member
    When user deletes team member "Charlie"
    Then team member "Charlie" should be removed from the listing
