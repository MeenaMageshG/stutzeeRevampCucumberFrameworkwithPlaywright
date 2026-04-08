Feature: Login Module

  Scenario: Valid Login
    Given user is on login page
    When user enters username "demo@stutzee.com"
    And user enters password "123456789"
    And user clicks login button
    Then user should be redirected to dashboard

  Scenario: Invalid Login
    Given user is on login page
    When user enters username "wrong@test.com"
    And user enters password "wrongpass"
    And user clicks login button
    Then user should see login error message