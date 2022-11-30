Feature: Manage Temporary Accommodation - Booking
    Background:
        Given I am logged in
        And I'm viewing an existing premises
        And I'm creating a bedspace
        And I create a bedspace with all necessary details

    Scenario: Creating a booking
        Given I'm creating a booking
        And I create a booking with all necessary details
        Then I should see a confirmation for my new booking

    Scenario: Showing booking creation errors
        Given I'm creating a booking
        And I attempt to create a booking with required details missing
        Then I should see a list of the problems encountered creating the booking

    Scenario: Confirming a booking
        Given I'm creating a booking
        And I create a booking with all necessary details
        And I confirm the booking
        Then I should see the booking with the confirmed status

    Scenario: Marking a booking as arrived
        Given I'm creating a booking
        And I create a booking with all necessary details
        And I confirm the booking
        And I mark the booking as arrived
        Then I should see the booking with the arrived status

    Scenario: Showing booking arrival errors
        Given I'm creating a booking
        And I create a booking with all necessary details
        And I confirm the booking
        And I attempt to mark the booking as arrived with required details missing
        Then I should see a list of the problems encountered marking the booking as arrived

    Scenario: Marking a booking as departed
        Given I'm creating a booking
        And I create a booking with all necessary details
        And I confirm the booking
        And I mark the booking as arrived
        And I mark the booking as departed
        Then I should see the booking with the departed status

    Scenario: Showing booking departure errors
        Given I'm creating a booking
        And I create a booking with all necessary details
        And I confirm the booking
        And I mark the booking as arrived
        And I attempt to mark the booking as departed with required details missing
        Then I should see a list of the problems encountered marking the booking as departed
