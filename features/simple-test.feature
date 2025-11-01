Feature: Simple Page Loading Test
  Test basic page loading functionality

  @simple
  Scenario: Basic page loading test
    Given a guest visits the Factory Direct homepage
    When the guest lands on the homepage
    Then the platform's core value should be clearly communicated