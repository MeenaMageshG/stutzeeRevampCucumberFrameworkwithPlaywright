Feature: Login Module

Scenario: Valid Login
  Given user is on login page
  When user logs in with valid credentials
  Then user should be redirected to dashboard

Scenario: Invalid Login
  Given user is on login page
  When user logs in with invalid credentials
  Then user should see login error message