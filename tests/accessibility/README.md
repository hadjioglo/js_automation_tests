# Accessibility Test Suite

This directory contains comprehensive accessibility tests for the Factory Direct website using Playwright and axe-core.

## Overview

The accessibility test suite ensures WCAG 2.1 AA compliance across multiple pages and viewports. It includes:

- **Multi-page testing**: Tests 5 different pages from configuration
- **Page Object Model**: Reusable accessibility methods and utilities
- **Element exclusions**: Skip elements that can't be easily fixed
- **Detailed reporting**: HTML, JSON, and CSV reports with violation details
- **Responsive testing**: Tests across desktop, tablet, and mobile viewports
- **Performance monitoring**: Ensures accessibility testing doesn't impact performance

## Quick Start

### Run all accessibility tests:
```bash
npm run test:accessibility
```

### Run quick smoke test:
```bash
npm run test:accessibility:smoke
```

### Run with full reporting:
```bash
npm run test:accessibility:report
```

## Test Configuration

### Pages Tested
Configure test URLs in `config/testUrls.ts`:
- Homepage (`/home`)
- Products Page (`/products`)
- Contact Form (`/contact`)
- About Us (`/about`)
- Support Center (`/support`)

### Viewports Tested
- Desktop: 1920x1080
- Tablet: 768x1024
- Mobile: 375x667

### Excluded Elements
Elements excluded from testing (configured in `config/testUrls.ts`):
- Third-party widgets (chat, recaptcha, iframes)
- Legacy components marked with `data-skip-a11y="true"`
- Dynamic loading indicators

## Test Structure

```
tests/accessibility/
├── accessibility.spec.ts          # Main test suite
├── accessibility.setup.ts         # Test environment setup
└── README.md                      # This file

utils/
├── AccessibilityPageObject.ts     # Page object with accessibility methods
└── AccessibilityReporter.ts       # Report generation utilities

config/
└── testUrls.ts                    # URL and exclusion configuration
```

## Page Object Methods

The `AccessibilityPageObject` class provides:

### Core Methods
- `navigateToPage()` - Navigate and wait for page readiness
- `runAccessibilityScan()` - Execute axe-core accessibility scan
- `setViewport()` - Set viewport for responsive testing

### Additional Checks
- `checkHeadingHierarchy()` - Validate heading structure
- `checkImageAltText()` - Check for missing alt attributes
- `testKeyboardNavigation()` - Test element focusability
- `testColorContrast()` - Validate color contrast ratios

### Utilities
- `takeScreenshot()` - Capture violation screenshots
- `dismissOverlays()` - Handle modal dialogs and banners
- `waitForPageStability()` - Wait for dynamic content

## Reporting

After running tests, reports are generated in `test-results/accessibility/`:

### HTML Report (`accessibility-report.html`)
- Interactive web interface
- Violation summaries grouped by impact and rule
- Detailed element information with failure descriptions
- Visual indicators for passed/failed pages

### JSON Report (`accessibility-report.json`)
- Machine-readable test results
- Complete violation data for integration with other tools
- Metadata including timestamps and viewport information

### CSV Export (`accessibility-violations.csv`)
- Spreadsheet-compatible format
- Easy filtering and analysis
- Suitable for tracking issues over time

## Understanding Results

### Violation Impacts
- **Critical**: Must fix - major accessibility barriers
- **Serious**: Should fix - significant accessibility issues  
- **Moderate**: Consider fixing - minor accessibility issues
- **Minor**: Nice to fix - accessibility improvements

### Common WCAG Rules
- `color-contrast`: Text color contrast ratios
- `image-alt`: Missing alt text on images
- `heading-order`: Incorrect heading hierarchy
- `keyboard`: Keyboard accessibility issues
- `aria-*`: ARIA attribute problems

## Best Practices

### Writing Accessibility Tests
1. **Test real user workflows** - Focus on critical user paths
2. **Include responsive testing** - Test across different screen sizes  
3. **Document exclusions** - Clearly justify any excluded elements
4. **Monitor performance** - Ensure tests run efficiently
5. **Regular testing** - Run accessibility tests in CI/CD pipeline

### Fixing Violations
1. **Prioritize by impact** - Fix critical and serious issues first
2. **Use violation URLs** - Follow axe-core documentation links
3. **Test fixes manually** - Verify with screen readers when possible
4. **Update exclusions carefully** - Only exclude unfixable third-party elements

### Exclusion Guidelines
Only exclude elements that:
- Are third-party components you cannot modify
- Have business requirements that conflict with accessibility
- Are temporary workarounds with planned fixes

## Integration with CI/CD

Add accessibility testing to your pipeline:

```yaml
# GitHub Actions example
- name: Run Accessibility Tests
  run: npm run test:accessibility:smoke

- name: Upload Accessibility Report
  uses: actions/upload-artifact@v3
  if: always()
  with:
    name: accessibility-report
    path: test-results/accessibility/
```

## Troubleshooting

### Common Issues

**Tests timing out**
- Increase timeout in playwright.config.ts
- Check if pages are loading slowly
- Verify network connectivity

**False positives**
- Review excluded elements configuration
- Check if dynamic content is interfering
- Verify page is fully loaded before scanning

**Missing violations**
- Ensure axe-core rules are properly configured
- Check WCAG level settings
- Verify elements aren't being excluded unintentionally

### Debug Mode
Run tests with additional debugging:
```bash
npx playwright test --project=accessibility --headed --debug
```

## Resources

- [axe-core Rules](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Playwright Accessibility Testing](https://playwright.dev/docs/accessibility-testing)
- [Web Accessibility Evaluation Tools](https://www.w3.org/WAI/ER/tools/)

## Contributing

When adding new pages or tests:
1. Update `config/testUrls.ts` with new page configuration
2. Add any necessary element exclusions
3. Run tests to ensure they pass
4. Update this README if needed

For questions or issues, please consult the team accessibility guidelines or reach out to the QA team.