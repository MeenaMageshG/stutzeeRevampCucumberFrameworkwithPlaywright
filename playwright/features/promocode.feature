Feature: Promo Code Creation Flow

  Background:
    Given user is logged in
    And user clicks on Events in side menu
    And user selects first event from list
    Then user should navigate to event dashboard
    And user navigates to Promo Codes

  # ✅ Positive Scenarios
  Scenario: Create Promo Code successfully
    And user clicks on Add New Promocode button
    And user enters promo code "EFYDFY"
    And user enters promo name "VIP"
    And user selects discount type Amount
    And user enters discount value "1499.99"
    And user enters maximum usage "10"
    And user enters expiry date "06/05/2026"
    And user selects status "Active"
    And user selects ticket "Couple Pass"
    And user selects ticket "Student Pass"
    And user clicks on Create Promocode button
    Then promocode should be created successfully with code "EFYDFY"

  Scenario: Create Promo Code with Inactive status
    And user clicks on Add New Promocode button
    And user enters promo code "INACTIVE123"
    And user enters promo name "Student Discount"
    And user selects discount type Amount
    And user enters discount value "500"
    And user enters maximum usage "5"
    And user enters expiry date "06/05/2026"
    And user selects status "Inactive"
    And user selects ticket "Couple Pass"
    And user clicks on Create Promocode button
    Then promocode should be created successfully with code "INACTIVE123"

  # ❌ Negative Scenarios
  Scenario: Create Promo Code without code
    And user clicks on Add New Promocode button
    And user enters promo code ""
    And user enters promo name "VIP"
    And user selects discount type Amount
    And user enters discount value "1000"
    And user enters maximum usage "10"
    And user enters expiry date "06/05/2026"
    And user selects status "Active"
    And user selects ticket "Couple Pass"
    And user clicks on Create Promocode button
    Then promocode should not be created with code ""

  Scenario: Create Promo Code with duplicate code
    And user clicks on Add New Promocode button
    And user enters promo code "DUPLICATEPROMO"
    And user enters promo name "Duplicate VIP"
    And user selects discount type Amount
    And user enters discount value "1200"
    And user enters maximum usage "10"
    And user enters expiry date "06/05/2026"
    And user selects status "Active"
    And user selects ticket "Couple Pass"
    And user clicks on Create Promocode button
    Then promocode should be created successfully with code "DUPLICATEPROMO"
    And user clicks on Add New Promocode button
    And user enters promo code "__LAST_PROMO_CODE__"
    And user enters promo name "Duplicate VIP Retry"
    And user selects discount type Amount
    And user enters discount value "1200"
    And user enters maximum usage "10"
    And user enters expiry date "06/05/2026"
    And user selects status "Active"
    And user selects ticket "Couple Pass"
    And user clicks on Create Promocode button
    Then promocode should not be created with code "__LAST_PROMO_CODE__"

  Scenario: Create Promo Code with invalid discount value
    And user clicks on Add New Promocode button
    And user enters promo code "INVALIDDISC"
    And user enters promo name "VIP"
    And user selects discount type Amount
    And user enters discount value "-100"
    And user enters maximum usage "10"
    And user enters expiry date "06/05/2026"
    And user selects status "Active"
    And user selects ticket "Couple Pass"
    And user clicks on Create Promocode button
    Then promocode should not be created with code "INVALIDDISC"

  Scenario: Create Promo Code without selecting ticket
    And user clicks on Add New Promocode button
    And user enters promo code "NOTICKET"
    And user enters promo name "VIP"
    And user selects discount type Amount
    And user enters discount value "1000"
    And user enters maximum usage "10"
    And user enters expiry date "06/05/2026"
    And user selects status "Active"
    And user clicks on Create Promocode button
    Then promocode should not be created with code "NOTICKET"
