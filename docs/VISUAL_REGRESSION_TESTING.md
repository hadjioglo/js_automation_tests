# Visual Regression Testing Guide

## Overview
This guide explains how to use the visual regression tests for the Factory Direct homepage to detect layout changes and maintain visual consistency.

## Visual Test Files
- `tests/e2e/specs/homepage-visual.spec.ts` - Main visual regression test suite

## Test Coverage
The visual regression tests cover:

### 1. Full Page Layout (`homepage-full-layout.png`)
- Complete homepage screenshot for overall layout verification
- Masks dynamic content (timestamps, live elements)
- Threshold: 30% pixel difference tolerance
- Max diff pixels: 1000

### 2. Hero Section (`homepage-hero-section.png`)
- Focused screenshot of the main hero/banner area
- Threshold: 20% pixel difference tolerance
- Max diff pixels: 500

### 3. Registration Form (`homepage-registration-form.png`)
- Form layout and styling verification
- Falls back to form area screenshot if form not found
- Threshold: 20% pixel difference tolerance
- Max diff pixels: 300

### 4. Navigation (`homepage-navigation.png`)
- Header/navigation bar layout
- Falls back to top area screenshot if navigation not found
- Threshold: 20% pixel difference tolerance
- Max diff pixels: 200

### 5. Multi-Viewport Testing
- Desktop (1920x1080)
- Laptop (1366x768)
- Tablet (768x1024)
- Mobile (375x667)

### 6. Footer Layout (`homepage-footer.png`)
- Footer area verification
- Falls back to bottom area screenshot if footer not found
- Threshold: 20% pixel difference tolerance
- Max diff pixels: 300

## Running Visual Tests

### Run all visual regression tests:
```bash
npx playwright test --project=visual-regression
```

### Run specific visual test:
```bash
npx playwright test homepage-visual.spec.ts --project=visual-regression
```

### Update visual baselines (when layout changes are intentional):
```bash
npx playwright test homepage-visual.spec.ts --project=visual-regression --update-snapshots
```

### Run visual tests in UI mode for debugging:
```bash
npx playwright test homepage-visual.spec.ts --project=visual-regression --ui
```

## Screenshots Storage
- Baseline screenshots are stored in: `tests/e2e/specs/homepage-visual.spec.ts-snapshots/`
- Failed test screenshots and diffs are stored in: `test-results/`
- Screenshots are organized by browser and viewport

## Best Practices

### 1. Consistent Test Environment
- Tests use fixed viewport sizes for consistency
- Dynamic content is masked or hidden
- Animations are disabled during screenshots
- Network idle state is awaited before capturing

### 2. Threshold Configuration
- Thresholds are set to account for minor rendering differences
- Different thresholds for different elements based on criticality
- Full page tests have higher tolerance than component tests

### 3. Masking Dynamic Content
The tests automatically mask:
- Timestamps and time-based elements
- Live chat widgets
- Notification counters
- Any elements with classes/IDs containing "timestamp" or "live"

### 4. Updating Baselines
Only update baselines when:
- Intentional design changes are made
- New features are added to the layout
- UI improvements are implemented

## Troubleshooting

### Test Failures
1. **Minor pixel differences**: Check if threshold adjustment is needed
2. **Font rendering differences**: Ensure consistent font smoothing is applied
3. **Dynamic content**: Add additional masking for new dynamic elements
4. **Browser differences**: Run tests in same browser type consistently

### Screenshot Issues
1. **Missing elements**: Check if selectors need updating
2. **Timing issues**: Increase wait times for slow-loading content
3. **Viewport differences**: Ensure viewport size is set correctly

### Maintenance
- Review and update selectors as the website evolves
- Adjust thresholds if needed for new content types
- Add new visual tests for new page sections
- Update masking rules for new dynamic content

## Integration with CI/CD
The visual tests are configured to run in the `visual-regression` project and can be integrated into your Azure Pipeline by running:
```bash
npx playwright test --project=visual-regression --reporter=junit
```

## Tags
Visual tests are tagged with `@visual` and can be run specifically using:
```bash
npx playwright test --grep "@visual"
```