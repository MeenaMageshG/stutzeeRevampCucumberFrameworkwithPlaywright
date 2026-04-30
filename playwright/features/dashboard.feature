Feature: Dashboard Navigation

  Scenario: Navigate to Events from Dashboard
    Given user is logged in
    And user clicks organizer menu
    Then impersonate to the first orgnaizer in the list
    And user clicks on Events in side menu
    And user selects first event from list
    Then user should navigate to event dashboard