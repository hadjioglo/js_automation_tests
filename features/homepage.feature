Feature: Factory Direct Platform Access
  As a business owner looking for manufacturing partners
  The system should provide immediate access to registration capabilities
  So that potential partners can quickly connect with manufacturers

  Background:
    Given a guest visits the Factory Direct homepage

  @smoke
  Scenario: Homepage loads successfully with proper structure
    When the guest lands on the homepage
    Then the platform's core value should be clearly communicated
    And registration opportunities should be prominently displayed
    And the page should load within acceptable performance standards
    And the registration form should be present and functional

  @smoke  
  Scenario: Business owner can identify registration path
    Given a business owner needs to connect with manufacturers
    When they visit the Factory Direct platform
    Then registration options should be clearly visible
    And essential contact fields should be available:
      | Field Purpose | Expected Input Type | Business Requirement |
      | Business Name | text input          | Required for identification |
      | Contact Email | email validation    | Required for communication |
      | Phone Number  | telephone format    | Required for direct contact |
    And the registration process should be intuitive

  @smoke
  Scenario Outline: Platform accessibility across device types
    Given a <user_type> accesses the platform via <device_type>
    When they view the homepage
    Then core functionality should remain accessible
    And registration capabilities should be preserved
    And the user experience should be optimized for their device

    Examples:
      | user_type        | device_type |
      | factory_owner    | mobile      |
      | procurement_buyer| tablet      |
      | business_manager | desktop     |

  @regression
  Scenario: Registration form validates user data correctly
    When a user fills the registration form with valid data
    Then the form should accept the data
    And the submit button should be enabled
    And no validation errors should be displayed

  @regression
  Scenario: Factory owner completes registration workflow
    When they click the register factory button
    And they fill factory registration data with:
      | Field         | Value                    |
      | Company Name  | Advanced Manufacturing Co|
      | Email         | contact@advmfg.com       |
      | Phone         | +1-555-0199             |
      | Account Type  | Factory                  |
    Then the factory data should be accepted
    And the registration should proceed to next step

  @regression
  Scenario: Buyer completes registration workflow  
    When they click the register buyer button
    And they fill buyer registration data with:
      | Field         | Value                    |
      | Company Name  | Procurement Solutions LLC|
      | Email         | buyer@procsol.com        |
      | Phone         | +1-555-0299             |
      | Account Type  | Buyer                    |
    Then the buyer data should be accepted
    And the registration should proceed to next step

  @regression
  Scenario Outline: Email format validation requirements
    When a user enters email "<email>" in the registration form
    Then the system should <validation_result> the email format
    And appropriate validation feedback should be provided

    Examples:
      | email                           | validation_result |
      | invalid-email                   | reject           |
      | test@                          | reject           |
      | @domain.com                    | reject           |
      | user@.com                      | reject           |
      | user@domain                    | reject           |
      |                                | reject           |
      | user@example.com               | accept           |
      | test.email@domain.co.uk        | accept           |
      | user+tag@subdomain.example.org | accept           |
      | name123@test-domain.net        | accept           |

  @regression
  Scenario Outline: Phone number format support
    When a user enters phone number "<phone>" in the registration form
    Then the system should accept the phone format
    And the phone number should be properly validated

    Examples:
      | phone              |
      | +1234567890        |
      | +1 (555) 123-4567  |
      | 555-123-4567       |
      | +86 138 0013 8000  |
      | +44 20 7946 0958   |

  @regression
  Scenario Outline: Special characters in business names
    When a user enters business name "<name>" in the registration form
    Then the system should accept the special characters
    And the name should be properly stored

    Examples:
      | name                    |
      | José María              |
      | O'Connor-Smith          |
      | Jean-François           |
      | Li Wei (李维)           |
      | Müller & Associates     |

  @regression
  Scenario: Social sharing functionality
    When a user attempts to share on social media platforms
    Then Facebook sharing should work correctly
    And Twitter sharing should work correctly
    And social sharing links should be accessible

  @regression
  Scenario: Page navigation and scrolling behavior
    When a user scrolls through the homepage
    Then scroll to top should work correctly
    And scroll to bottom should work correctly 
    And scroll to registration form should work correctly
    And all elements should remain accessible during navigation