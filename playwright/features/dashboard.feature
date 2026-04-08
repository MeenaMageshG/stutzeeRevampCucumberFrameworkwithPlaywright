Feature: Dashboard Navigation

  Scenario: Navigate to Events from Dashboard
    Given user is logged in
    When user clicks on hamburger menu
    And user clicks on Events in side menu
    And user selects first event from list
    Then user should navigate to event dashboard