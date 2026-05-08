Feature: Organizer Team Roles and Privileges Management (Happy Path)

  Background:
    Given user is logged in
    And user clicks organizer menu
    Then impersonate to the first orgnaizer in the list
    And user clicks on Events in side menu
    And user selects first event from list
    Then user should navigate to event dashboard
    And user clicks on Event Management menu
    And user clicks on Organizer Teams menu
    And user clicks on Organizer Teams menu
    And user clicks on Manage Roles button

  Scenario: Create role, update privileges, and invite team member
    When user creates organizer role "AutomationRole"
    Then role "AutomationRole" should be created successfully
    When user views privileges of role "AutomationRole"
    And user updates privileges with:
      | Invite Members |
      | Manage Members |
      | View Members   |
    Then role privileges should be updated successfully
    When user goes back to Team Members
    And user clicks on Add New Team button
    And user enters team member details "Automation Member" "automation.member@example.com" "98765" "AutomationRole"
    And user clicks on Invite button
    Then team member "Automation Member" should be created successfully
