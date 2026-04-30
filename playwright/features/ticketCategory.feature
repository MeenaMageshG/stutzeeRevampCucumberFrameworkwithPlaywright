Feature: Dashboard to Ticket Category Flow

  Scenario: Navigate from Dashboard to Ticket Category
    Given user is logged in
    And user clicks organizer menu
    Then impersonate to the first orgnaizer in the list
    And user clicks on Events in side menu
    And user selects first event from list
    Then user should navigate to event dashboard
    And user clicks on Event Management in side menu
    And user clicks on Ticketing module
    Then user should navigate to Ticket Category page


  Scenario: Create Ticket Category from Dashboard flow
    Given user is logged in
    And user clicks organizer menu
    Then impersonate to the first orgnaizer in the list
    And user clicks on Events in side menu
    And user selects first event from list
    Then user should navigate to event dashboard
    And user clicks on Event Management in side menu
    And user clicks on Ticketing module
    And user clicks on Create Ticket Category button
    And user enters ticket category name "Guest Valid Pass"
    And user enters ticket category description "Premium access tickets"
    And user clicks on createButton
    Then ticket category should be created successfully


  Scenario: Create multiple Ticket Categories
    Given user is logged in
    And user clicks organizer menu
    Then impersonate to the first orgnaizer in the list
    And user clicks on Events in side menu
    And user selects first event from list
    Then user should navigate to event dashboard
    And user clicks on Event Management in side menu
    And user clicks on Ticketing module
    And user clicks on Create Ticket Category button
    And user enters ticket category name "Partner Valid Pass"
    And user enters ticket category description "Early Bird Access"
    And user clicks on createButton
    Then ticket category should be created successfully