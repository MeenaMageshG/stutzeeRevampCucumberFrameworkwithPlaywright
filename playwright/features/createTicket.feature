Feature: Ticket Creation Flow

  Background:
    Given user is logged in
    And user clicks organizer menu
    Then impersonate to the first orgnaizer in the list
    And user clicks on Events in side menu
    And user selects first event from list
    Then user should navigate to event dashboard
    And user clicks on Event Management in side menu
    And user clicks on Ticketing module

  # ✅ Positive Scenarios
  Scenario: Create Paid Ticket successfully
    And user clicks on Create Ticket button
    And user chooses category "VIP"
    And user enters ticket name "Couple Pass"
    And user selects ticket type "Paid"
    And user enters max attendees "2"
    And user enters base price "1000"
    And user enters sales start date "13/04/2026 10:00 AM" and end date "13/05/2026 10:00 AM"
    And user selects visibility "Public"
    And user selects initial state "Active"
    And user enters perks "Food, Transport"
    And user enters access terms "Valid for two adults for full event"
    And user clicks on Create Ticket button in form
    Then ticket should be created successfully with name "Couple Pass"

  Scenario: Create Free Ticket successfully
    And user clicks on Create Ticket button
    And user chooses category "VIP"
    And user enters ticket name "Student Pass"
    And user selects ticket type "Free"
    And user enters max attendees "2"
    And user enters base price "0"
    And user enters sales start date "13/04/2026 10:00 AM" and end date "13/05/2026 10:00 AM"
    And user selects visibility "Public"
    And user selects initial state "Active"
    And user enters perks "Lunch"
    And user enters access terms "General entry"
    And user clicks on Create Ticket button in form
    Then ticket should be created successfully with name "Student Pass"

  # ❌ Negative Scenarios
  Scenario: Create Ticket without name
    And user clicks on Create Ticket button
    And user chooses category "VIP"
    And user enters ticket name ""
    And user selects ticket type "Paid"
    And user enters max attendees "1"
    And user enters base price "1000"
    And user enters sales start date "01/05/2026 08:00 AM" and end date "03/05/2026 10:00 AM"
    And user selects visibility "Public"
    And user selects initial state "Active"
    And user enters perks "Food"
    And user enters access terms "General entry"
    And user clicks on Create Ticket button in form
    Then ticket should not be created with name ""
