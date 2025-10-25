# Factory Direct Playwright Testing Framework

![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)

A production-ready, scalable Playwright TypeScript testing framework for the Factory Direct website (https://factory-direct.tilda.ws/). This framework follows industry best practices with comprehensive E2E testing, API testing, and robust reporting capabilities.

## 🏗️ Framework Architecture

```
factoryDirect/
├── config/                          # Environment configurations
│   ├── dev.env                      # Development environment settings
│   ├── staging.env                  # Staging environment settings
│   ├── prod.env                     # Production environment settings
│   └── environments.ts              # Environment configuration manager
├── data/                            # Test data and fixtures
│   ├── testData.json               # Static test data
│   └── users.json                  # User account data
├── fixtures/                       # Custom Playwright fixtures
│   └── customFixtures.ts          # Advanced test fixtures
├── reports/                        # Test execution reports
│   └── html/                       # HTML test reports
├── tests/                          # Test specifications
│   ├── api/                        # API testing
│   │   ├── services/               # API service layer
│   │   │   └── UserApiService.ts   # User management API service
│   │   └── specs/                  # API test specifications
│   │       └── userApi.spec.ts     # User API test cases
│   └── e2e/                        # End-to-end testing
│       ├── pageObjects/            # Page Object Model implementation
│       │   ├── BasePage.ts         # Base page class
│       │   └── FactoryDirectHomePage.ts # Homepage page object
│       └── specs/                  # E2E test specifications
│           └── homepage.spec.ts    # Homepage test cases
├── utils/                          # Utility modules
│   ├── customCommands.ts          # Custom Playwright commands
│   ├── dataGenerator.ts           # Test data generation utilities
│   ├── helpers.ts                 # General helper functions
│   └── logger.ts                  # Logging utility
├── playwright.config.ts           # Playwright configuration
├── package.json                   # Project dependencies and scripts
└── README.md                      # This file
```

## 🚀 Quick Start

### Prerequisites

- **Node.js**: Version 16.0.0 or higher
- **npm**: Version 8.0.0 or higher

### Installation

1. **Install dependencies**:
   ```powershell
   npm install
   ```

2. **Install Playwright browsers**:
   ```powershell
   npm run setup
   ```

3. **Verify installation**:
   ```powershell
   npm run test:smoke
   ```

## 🔧 Configuration

### Environment Setup

The framework is configured for production environment:

- **Production**: `config/prod.env` - Production testing configuration

### Environment Variables

Key configuration options available in each environment file:

```env
# Application Settings
BASE_URL=https://factory-direct.tilda.ws/
ENV=development
API_BASE_URL=https://api.factory-direct.com/v1
TIMEOUT=30000

# Browser Configuration
BROWSER=chromium
VIEWPORT_WIDTH=1920
VIEWPORT_HEIGHT=1080
HEADLESS=true

# Test Configuration
PARALLEL_WORKERS=2
RETRIES=1
SCREENSHOT_MODE=only-on-failure
```

## 🧪 Test Execution

### Basic Commands

```powershell
# Run all tests
npm test

# Run tests with browser visible
npm run test:headed

# Run in debug mode
npm run test:debug

# Run with Playwright UI
npm run test:ui
```

### Test Categories

```powershell
# Smoke tests (critical functionality)
npm run test:smoke

# Regression tests (comprehensive coverage)
npm run test:regression

# API tests only
npm run test:api

# E2E tests only
npm run test:e2e
```

### Production Testing

```powershell
# Production environment
npm run test:prod
```

### Browser-Specific Testing

```powershell
# Mobile testing
npm run test:mobile

# Desktop browsers
npm run test:desktop

# Cross-browser testing
npm run test:cross-browser
```

## 📊 Reporting

### Available Reports

1. **HTML Report** (Default):
   ```powershell
   npm run report:html
   ```

2. **Allure Report** (Advanced):
   ```powershell
   npm run report:allure
   ```

### Report Locations

- HTML Reports: `reports/html/index.html`
- Allure Reports: `reports/allure-report/index.html`

## 🔄 CI/CD Pipeline

The project includes a comprehensive Azure DevOps pipeline for automated testing across multiple environments and browsers. 

### Pipeline Features

- **Cross-browser testing** on Windows and Linux agents
- **Parallel test execution** with browser sharding
- **Automated reporting** with HTML artifacts
- **Email notifications** on test failures
- **Test result aggregation** across all browsers

### Configuration

For detailed pipeline setup and configuration instructions, see:
📄 **[Pipeline Configuration Guide](docs/PIPELINE_CONFIGURATION.md)**

The pipeline supports:
- Multiple notification methods (Graph API, SMTP)
- Configurable test parameters
- Artifact publishing and retention
- Environment-specific deployments

## 🏛️ Framework Components

### Page Object Model

**BasePage.ts** - Abstract base class providing:
- Common page interactions
- Element waiting strategies
- Screenshot capabilities
- Logging integration

**FactoryDirectHomePage.ts** - Specific implementation for:
- Registration form interactions
- Content validation
- Social sharing features
- Responsive design testing

### API Testing

**UserApiService.ts** - Comprehensive API service providing:
- HTTP client wrapper
- Authentication handling
- CRUD operations
- Error handling and logging

### Custom Fixtures

**customFixtures.ts** - Advanced Playwright patterns:
- Worker-scoped fixtures
- Authentication state management
- API testing contexts
- Page object initialization

### Utilities

- **Logger**: Structured logging with multiple levels
- **DataGenerator**: Custom test data generation
- **Helpers**: Common utility functions
- **CustomCommands**: Extended Playwright functionality

## 🎯 Test Coverage

### Current Test Scenarios (85+ tests)

#### Homepage Testing
- ✅ Page load and rendering
- ✅ Registration form validation
- ✅ Social sharing functionality
- ✅ Responsive design testing
- ✅ Content validation
- ✅ Error handling

#### API Testing
- ✅ User management operations
- ✅ Authentication flows
- ✅ Data validation
- ✅ Error response handling

#### Cross-Browser Testing
- ✅ Chromium, Firefox, WebKit
- ✅ Mobile Safari, Mobile Chrome
- ✅ Desktop and tablet viewports

## 🔍 Development Workflow

### Code Quality

```powershell
# Lint TypeScript files
npm run lint

# Format code with Prettier
npm run format

# Type checking
npm run typecheck
```

### Debugging

```powershell
# Debug mode with browser
npm run test:debug

# Update visual snapshots
npm run test:update-snapshots

# Clean reports and cache
npm run clean
```

## 📋 Best Practices

### Test Writing Guidelines

1. **Use Page Object Model**: Encapsulate page interactions
2. **Implement Proper Waits**: Use explicit waits over fixed delays
3. **Data-Driven Testing**: Utilize JSON test data files
4. **Comprehensive Assertions**: Validate both positive and negative scenarios
5. **Error Handling**: Implement robust error handling and logging

### Framework Maintenance

1. **Regular Updates**: Keep Playwright and dependencies updated
2. **Test Data Management**: Maintain clean, realistic test data
3. **Report Analysis**: Regularly review test reports for insights
4. **Performance Monitoring**: Monitor test execution times

## 📞 Support

### Common Issues

1. **Browser Installation**: Run `npm run setup` if browsers fail to launch
2. **Environment Issues**: Verify environment file configurations
3. **Test Failures**: Check browser compatibility and network connectivity

### Getting Help

- Review test reports in `reports/html/index.html`
- Check logs in `logs/` directory
- Consult Playwright documentation: https://playwright.dev/

## 📈 Roadmap

### Upcoming Features

- [ ] Visual regression testing
- [ ] Performance testing integration
- [ ] Accessibility testing automation
- [ ] Database testing capabilities
- [ ] Advanced reporting dashboards

### Version History

- **v2.0.0**: Complete framework restructure with best practices
- **v1.0.0**: Initial website exploration and basic test implementation

---

**Built with ❤️ by the QA Team**

*This framework follows industry best practices for maintainable, scalable test automation.*

### 5. Lint and format
```
npm run lint
npm run format
```

### 6. CI/CD
See `.github/workflows/ci.yml` for GitHub Actions setup.

## Extending the Framework
- Add new page objects in `pages/`
- Add new tests in `tests/`
- Add test data in `fixtures/`
- Add helpers in `utils/`

## API Testing
See Playwright docs for [APIRequestContext](https://playwright.dev/docs/api/class-apirequestcontext).

---
