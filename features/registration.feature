Feature: Business Partnership Registration
  As a business stakeholder in manufacturing or procurement
  The platform should enable secure and validated partner onboarding
  So that legitimate business connections can be established efficiently

  Background:
    Given a business stakeholder visits the Factory Direct platform

  @regression
  Scenario: Factory owner completes partnership registration
    Given a factory owner wants to showcase manufacturing capabilities
    When they provide valid business contact information:
      | Business Detail | Example Value    |
      | Company Name    | Smith Manufacturing |
      | Business Email  | contact@smith-mfg.com|
      | Contact Number  | +1-555-0123      |
    Then the platform should accept their registration details
    And the registration process should advance to the next step

  @regression  
  Scenario Outline: Platform validates business email authenticity
    Given a <user_type> attempts to register with email "<email_address>"
    When they submit their contact information
    Then the system should <validation_outcome> the email format
    And appropriate guidance should be provided for next steps

    Examples:
      | user_type     | email_address      | validation_outcome |
      | factory_owner | contact@company.com| accept            |
      | buyer_agent   | buyer@business.org | accept            |
      | guest_user    | invalid-format     | reject            |
      | prospect      | incomplete@        | reject            |
      | visitor       | @missing-user.com  | reject            |
      | applicant     | user@incomplete    | reject            |

  @regression
  Scenario: Business user modifies registration information
    Given a business user has partially completed their registration
    When they need to update their contact details
    Then the form should allow information modification
    And previously entered data should be cleared when requested

  @smoke
  Scenario: Factory owner discovers registration pathway
    Given a factory owner seeks manufacturing partnership opportunities
    When they explore registration options
    Then the factory registration pathway should be clearly identified
    And the registration form should be immediately accessible

  @smoke  
  Scenario: Procurement buyer identifies supplier connection process
    Given a procurement buyer needs to source manufacturing partners
    When they investigate buyer registration options
    Then the buyer registration pathway should be prominently displayed
    And the connection process should be straightforward