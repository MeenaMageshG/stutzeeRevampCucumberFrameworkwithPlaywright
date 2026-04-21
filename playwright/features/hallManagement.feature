Feature: Hall Management

Background:
    Given user is logged in
    And user clicks on Events in side menu
    And user selects first event from list
    Then user should navigate to event dashboard
    And user navigates to eventManagementMenu
    Then user clicks the sessionManagementMenu

  Scenario: Create a new hall
    Given I navigate to Hall Management
    When I create a hall with name "Main Hall" and location "Ground Floor"
    Then the hall "Main Hall" should be visible in the hall listing
