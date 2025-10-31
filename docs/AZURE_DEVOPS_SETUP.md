# Azure DevOps Test Results Setup Guide

## Overview
This document explains how test results are generated and published in Azure DevOps for the Factory Direct test automation project.

## Test Result Generation Process

### 1. Cucumber Test Execution
- Tests run using `npm run cucumber:ci` which sets CI=true and HEADLESS=true
- Cucumber generates multiple output formats:
  - `reports/cucumber-report.json` - JSON results for report generation
  - `reports/junit.xml` - JUnit XML for Azure DevOps Test Results tab
  - `reports/cucumber-report.html` - HTML report for human viewing

### 2. Report Generation
- After test execution, `npm run cucumber:report` generates enhanced HTML report
- Results are copied to `test-results/` directory for easier access in Azure artifacts

### 3. Azure DevOps Publishing
- **Test Results Tab**: JUnit XML files are published using `PublishTestResults@2` task
- **Artifacts**: Both `reports/` and `test-results/` directories are published as pipeline artifacts
- **HTML Reports**: Available in the `cucumber-reports` artifact

## Troubleshooting

### No Test Results in Azure DevOps
**Symptoms**: Empty test results, "no tests found" message
**Solutions**:
1. Check that Cucumber tests actually ran (look for JSON/XML files in logs)
2. Verify JUnit XML format is being generated (`reports/junit.xml`)
3. Ensure `PublishTestResults@2` task is finding the XML files

### Empty Cucumber Report
**Symptoms**: Report shows "No Test Results Available"
**Solutions**:
1. Verify `reports/cucumber-report.json` exists and has content
2. Check test execution logs for errors
3. Ensure all feature files have scenarios to execute

### Missing Artifacts
**Symptoms**: No artifacts published to Azure DevOps
**Solutions**:
1. Check `reports/` and `test-results/` directories exist
2. Verify `PublishPipelineArtifact@1` tasks are running
3. Look for file copy operations in pipeline logs

## File Structure After Successful Run
```
reports/
├── cucumber-report.json      # Cucumber test results (JSON)
├── cucumber-report.html      # Generated HTML report
└── junit.xml                 # JUnit XML for Azure DevOps

test-results/
├── cucumber-report.json      # Copy of JSON results
├── cucumber-report.html      # Copy of HTML report
└── junit.xml                 # Copy of JUnit XML
```

## Azure DevOps Pipeline Parameters
- `runCucumberTests`: Enable/disable Cucumber test execution
- `testTags`: Specify which test tags to run (e.g., @smoke, @regression)
- `generateReport`: Enable/disable HTML report generation

## Local vs CI Differences
- **Local**: Tests run in headed mode with slow motion for debugging
- **CI**: Tests run in headless mode for faster execution
- **Reports**: Same format generated in both environments

## Environment Variables
- `CI=true`: Enables CI mode (headless browser)
- `HEADLESS=true`: Forces headless mode
- `ENV`: Sets test environment (development/production)