Feature: Session Management
  Background:
    Given user is logged in
    And user clicks organizer menu
    Then impersonate to the first orgnaizer in the list
    And user clicks on Events in side menu
    And user selects first event from list
    Then user should navigate to event dashboard
    And the user clicks the sessionManagement

  # =====================================================
  # HALL MANAGEMENT - POSITIVE SCENARIOS
  # =====================================================

  Scenario: Create a new hall with valid details
    When user navigates to Session Management page
    And user clicks on Manage Halls
    And user clicks on Add New Hall
    And user enters hall details with name "Main Auditorium" and location "Building A, Floor 3"
    And user creates the hall
    Then user should see success message for hall creation

  Scenario: Create multiple halls with different locations
    When user navigates to Session Management page
    And user clicks on Manage Halls
    And user clicks on Add New Hall
    And user enters hall details with name "Conference Room A" and location "Building B, Floor 1"
    And user creates the hall
    And user clicks on Add New Hall
    And user enters hall details with name "Conference Room B" and location "Building B, Floor 2"
    And user creates the hall
    And user clicks on Add New Hall
    And user enters hall details with name "Workshop Space" and location "Building C, Ground Floor"
    And user creates the hall
    Then user should see all three halls in the list

  Scenario: Verify hall creation with specific details
    When user navigates to Session Management page
    And user clicks on Manage Halls
    And user clicks on Add New Hall
    And user enters hall details with name "VIP Lounge" and location "Executive Wing"
    And user creates the hall
    Then hall "VIP Lounge" with location "Executive Wing" should be created successfully

  # =====================================================
  # HALL MANAGEMENT - NEGATIVE SCENARIOS
  # =====================================================

  Scenario: Attempt to create hall without name
    When user navigates to Session Management page
    And user clicks on Manage Halls
    And user clicks on Add New Hall
    And user enters hall details with name "" and location "Building A, Floor 1"
    And user creates the hall
    Then user should see error message "Hall name is required"

  Scenario: Attempt to create hall without location
    When user navigates to Session Management page
    And user clicks on Manage Halls
    And user clicks on Add New Hall
    And user enters hall details with name "Test Hall" and location ""
    And user creates the hall
    Then user should see error message "Location is required"

  Scenario: Attempt to create hall with special characters in name
    When user navigates to Session Management page
    And user clicks on Manage Halls
    And user clicks on Add New Hall
    And user enters hall details with name "Hall@#$%" and location "Building A"
    And user creates the hall
    Then user should see error message "Hall name contains invalid characters"

  Scenario: Attempt to create hall with very long name
    When user navigates to Session Management page
    And user clicks on Manage Halls
    And user clicks on Add New Hall
    And user enters hall details with name "This is a very long hall name that exceeds the maximum character limit for hall names" and location "Building A"
    And user creates the hall
    Then user should see error message "Hall name exceeds maximum length"

  Scenario: Attempt to create duplicate hall
    When user navigates to Session Management page
    And user clicks on Manage Halls
    And user clicks on Add New Hall
    And user enters hall details with name "Duplicate Hall" and location "Building A"
    And user creates the hall
    And user clicks on Add New Hall
    And user enters hall details with name "Duplicate Hall" and location "Building B"
    And user creates the hall
    Then user should see error message "Hall name already exists"

  # =====================================================
  # TRACK MANAGEMENT - POSITIVE SCENARIOS
  # =====================================================

  Scenario: Create a new track with valid details
    When user navigates to Session Management page
    And user clicks on Manage Tracks
    And user clicks on Add New Track
    And user enters track details with name "AI & Machine Learning" and colour code "#FF5733"
    And user creates the track
    Then user should see success message for track creation

  Scenario: Create multiple tracks with different colour codes
    When user navigates to Session Management page
    And user clicks on Manage Tracks
    And user clicks on Add New Track
    And user enters track details with name "DevOps" and colour code "#33FF57"
    And user creates the track
    And user clicks on Add New Track
    And user enters track details with name "Cloud Computing" and colour code "#3357FF"
    And user creates the track
    And user clicks on Add New Track
    And user enters track details with name "Security" and colour code "#FF33F1"
    And user creates the track
    Then user should see all three tracks in the list

  Scenario: Verify track creation with specific colour code
    When user navigates to Session Management page
    And user clicks on Manage Tracks
    And user clicks on Add New Track
    And user enters track details with name "Mobile Development" and colour code "#FFD700"
    And user creates the track
    Then track "Mobile Development" with colour "#FFD700" should be created successfully

  # =====================================================
  # TRACK MANAGEMENT - NEGATIVE SCENARIOS
  # =====================================================

  Scenario: Attempt to create track without name
    When user navigates to Session Management page
    And user clicks on Manage Tracks
    And user clicks on Add New Track
    And user enters track details with name "" and colour code "#FF5733"
    And user creates the track
    Then user should see error message "Track name is required"

  Scenario: Attempt to create track without colour code
    When user navigates to Session Management page
    And user clicks on Manage Tracks
    And user clicks on Add New Track
    And user enters track details with name "Test Track" and colour code ""
    And user creates the track
    Then user should see error message "Colour code is required"

  Scenario: Attempt to create track with invalid colour code format
    When user navigates to Session Management page
    And user clicks on Manage Tracks
    And user clicks on Add New Track
    And user enters track details with name "Invalid Track" and colour code "INVALID"
    And user creates the track
    Then user should see error message "Invalid colour code format. Use hexadecimal format"

  Scenario: Attempt to create track with duplicate name
    When user navigates to Session Management page
    And user clicks on Manage Tracks
    And user clicks on Add New Track
    And user enters track details with name "Duplicate Track" and colour code "#FF5733"
    And user creates the track
    And user clicks on Add New Track
    And user enters track details with name "Duplicate Track" and colour code "#33FF57"
    And user creates the track
    Then user should see error message "Track name already exists"

  Scenario: Attempt to create track with special characters in name
    When user navigates to Session Management page
    And user clicks on Manage Tracks
    And user clicks on Add New Track
    And user enters track details with name "Track@#$!" and colour code "#FF5733"
    And user creates the track
    Then user should see error message "Track name contains invalid characters"

  # =====================================================
  # SESSION MANAGEMENT - POSITIVE SCENARIOS
  # =====================================================

  Scenario: Create a new session with all valid details
    When user navigates to Session Management page
    And user clicks on Manage Halls
    And user clicks on Add New Hall
    And user enters hall details with name "Main Hall" and location "Building A"
    And user creates the hall
    And user goes back to Session Management
    And user clicks on Manage Tracks
    And user clicks on Add New Track
    And user enters track details with name "AI Track" and colour code "#FF5733"
    And user creates the track
    And user goes back to Session Management
    And user clicks on Add Session
    And user enters session details with name "Introduction to AI" and date "2026-05-15" and start time "09:00" and end time "10:30"
    And user selects hall "Main Hall" for the session
    And user selects track "AI Track" for the session
    And user creates the session
    Then session with name "Introduction to AI" should be created successfully

  Scenario: Create multiple sessions in same hall
    When user navigates to Session Management page
    And user clicks on Manage Halls
    And user clicks on Add New Hall
    And user enters hall details with name "Conference Hall" and location "Building A"
    And user creates the hall
    And user goes back to Session Management
    And user clicks on Manage Tracks
    And user clicks on Add New Track
    And user enters track details with name "Tech Track" and colour code "#3357FF"
    And user creates the track
    And user goes back to Session Management
    And user clicks on Add Session
    And user enters session details with name "Morning Keynote" and date "2026-05-15" and start time "09:00" and end time "10:00"
    And user selects hall "Conference Hall" for the session
    And user selects track "Tech Track" for the session
    And user creates the session
    And user clicks on Add Session
    And user enters session details with name "Afternoon Workshop" and date "2026-05-15" and start time "14:00" and end time "16:00"
    And user selects hall "Conference Hall" for the session
    And user selects track "Tech Track" for the session
    And user creates the session
    Then session with name "Morning Keynote" should be created successfully
    And session with name "Afternoon Workshop" should be created successfully

  Scenario: Create session with minimum required duration
    When user navigates to Session Management page
    And user clicks on Manage Halls
    And user clicks on Add New Hall
    And user enters hall details with name "Small Room" and location "Building B"
    And user creates the hall
    And user goes back to Session Management
    And user clicks on Manage Tracks
    And user clicks on Add New Track
    And user enters track details with name "Quick Track" and colour code "#FF33F1"
    And user creates the track
    And user goes back to Session Management
    And user clicks on Add Session
    And user enters session details with name "Lightning Talk" and date "2026-05-16" and start time "10:00" and end time "10:15"
    And user selects hall "Small Room" for the session
    And user selects track "Quick Track" for the session
    And user creates the session
    Then session with name "Lightning Talk" should be created successfully

  # =====================================================
  # SESSION MANAGEMENT - NEGATIVE SCENARIOS
  # =====================================================

  Scenario: Attempt to create session without name
    When user navigates to Session Management page
    And user clicks on Add Session
    And user enters session details with name "" and date "2026-05-15" and start time "09:00" and end time "10:00"
    And user creates the session
    Then user should see error message "Session name is required"

  Scenario: Attempt to create session without date
    When user navigates to Session Management page
    And user clicks on Add Session
    And user enters session details with name "Test Session" and date "" and start time "09:00" and end time "10:00"
    And user creates the session
    Then user should see error message "Session date is required"

  Scenario: Attempt to create session without start time
    When user navigates to Session Management page
    And user clicks on Add Session
    And user enters session details with name "Test Session" and date "2026-05-15" and start time "" and end time "10:00"
    And user creates the session
    Then user should see error message "Start time is required"

  Scenario: Attempt to create session without end time
    When user navigates to Session Management page
    And user clicks on Add Session
    And user enters session details with name "Test Session" and date "2026-05-15" and start time "09:00" and end time ""
    And user creates the session
    Then user should see error message "End time is required"

  Scenario: Attempt to create session with end time before start time
    When user navigates to Session Management page
    And user clicks on Add Session
    And user enters session details with name "Invalid Time Session" and date "2026-05-15" and start time "14:00" and end time "10:00"
    And user creates the session
    Then user should see error message "End time must be after start time"

  Scenario: Attempt to create session without selecting hall
    When user navigates to Session Management page
    And user clicks on Add Session
    And user enters session details with name "No Hall Session" and date "2026-05-15" and start time "09:00" and end time "10:00"
    And user creates the session
    Then user should see error message "Please select a hall"

  Scenario: Attempt to create session without selecting track
    When user navigates to Session Management page
    And user clicks on Add Session
    And user enters session details with name "No Track Session" and date "2026-05-15" and start time "09:00" and end time "10:00"
    And user creates the session
    Then user should see error message "Please select a track"

  Scenario: Attempt to create session with past date
    When user navigates to Session Management page
    And user clicks on Add Session
    And user enters session details with name "Past Session" and date "2020-01-01" and start time "09:00" and end time "10:00"
    And user creates the session
    Then user should see error message "Session date cannot be in the past"

  Scenario: Attempt to create session with invalid date format
    When user navigates to Session Management page
    And user clicks on Add Session
    And user enters session details with name "Invalid Format" and date "15-05-2026" and start time "09:00" and end time "10:00"
    And user creates the session
    Then user should see error message "Invalid date format"

  Scenario: Attempt to create session with invalid time format
    When user navigates to Session Management page
    And user clicks on Add Session
    And user enters session details with name "Invalid Time" and date "2026-05-15" and start time "9:00 AM" and end time "10:00"
    And user creates the session
    Then user should see error message "Invalid time format"

  Scenario: Attempt to create session with same start and end time
    When user navigates to Session Management page
    And user clicks on Add Session
    And user enters session details with name "Same Time Session" and date "2026-05-15" and start time "09:00" and end time "09:00"
    And user creates the session
    Then user should see error message "End time must be after start time"

  Scenario: Attempt to create session with special characters in name
    When user navigates to Session Management page
    And user clicks on Add Session
    And user enters session details with name "Session@#$!" and date "2026-05-15" and start time "09:00" and end time "10:00"
    And user creates the session
    Then user should see error message "Session name contains invalid characters"

  Scenario: Attempt to create session with very long name
    When user navigates to Session Management page
    And user clicks on Add Session
    And user enters session details with name "This is a very long session name that exceeds the maximum character limit allowed for session names in the system" and date "2026-05-15" and start time "09:00" and end time "10:00"
    And user creates the session
    Then user should see error message "Session name exceeds maximum length"

  Scenario: Attempt to create overlapping sessions in same hall
    When user navigates to Session Management page
    And user clicks on Manage Halls
    And user clicks on Add New Hall
    And user enters hall details with name "Overlap Test Hall" and location "Building A"
    And user creates the hall
    And user goes back to Session Management
    And user clicks on Manage Tracks
    And user clicks on Add New Track
    And user enters track details with name "Overlap Track" and colour code "#FF5733"
    And user creates the track
    And user goes back to Session Management
    And user clicks on Add Session
    And user enters session details with name "Session 1" and date "2026-05-15" and start time "09:00" and end time "10:00"
    And user selects hall "Overlap Test Hall" for the session
    And user selects track "Overlap Track" for the session
    And user creates the session
    And user clicks on Add Session
    And user enters session details with name "Session 2" and date "2026-05-15" and start time "09:30" and end time "10:30"
    And user selects hall "Overlap Test Hall" for the session
    And user selects track "Overlap Track" for the session
    And user creates the session
    Then user should see error message "Session overlaps"
