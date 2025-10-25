# Azure Pipeline Configuration Guide

## Pipeline Tasks Fixed

The Azure DevOps pipeline has been updated to resolve missing task references:

### 1. HTML Report Publishing (Fixed)

**Previous Issue:** `PublishHtmlReport@1` task was not available
**Solution:** Replaced with built-in `PublishPipelineArtifact@1` task

The HTML test reports are now published as pipeline artifacts that can be:
- Downloaded from the pipeline run results
- Viewed in the "Artifacts" section of the build
- Shared with team members

### 2. Email Notifications (Fixed)

**Previous Issue:** `SendEmail@1` task was not available
**Solution:** Replaced with PowerShell script supporting multiple email methods

## Email Notification Configuration

The pipeline now supports two methods for sending email notifications when tests fail:

### Option 1: Microsoft Graph API (Recommended)

Set these pipeline variables:
- `GRAPH_CLIENT_ID`: Azure App Registration Client ID
- `GRAPH_CLIENT_SECRET`: Azure App Registration Client Secret  
- `GRAPH_TENANT_ID`: Azure AD Tenant ID

#### Setup Steps:
1. Register an Azure App in Azure AD
2. Grant "Mail.Send" permission to the app
3. Add the variables to your Azure DevOps pipeline
4. Update the sender email in the script if needed

### Option 2: SMTP Server

Set these pipeline variables:
- `SMTP_SERVER`: SMTP server address (e.g., smtp.office365.com)
- `SMTP_USERNAME`: Email username
- `SMTP_PASSWORD`: Email password
- `SMTP_PORT`: SMTP port (optional, defaults to 587)

#### Common SMTP Settings:
- **Office 365/Outlook:** smtp.office365.com:587
- **Gmail:** smtp.gmail.com:587
- **Yahoo:** smtp.mail.yahoo.com:587

## Parallelism Considerations

### Current Configuration
The pipeline is configured to run only on Windows agents to avoid Azure DevOps hosted parallelism limitations. This means:

- All test jobs run sequentially
- Only Windows browser testing is performed
- Reduced pipeline execution time compared to parallel execution
- Compatible with free Azure DevOps accounts

### Enabling Parallel Execution
If your organization has parallelism grants or purchases, you can:

1. **Request Free Parallelism**: Visit https://aka.ms/azpipelines-parallelism-request
2. **Purchase Parallelism**: Add parallel jobs in Azure DevOps organization settings
3. **Restore Linux Testing**: Uncomment the Linux stage in the pipeline
4. **Enable Cross-Platform**: Test on both Windows and Linux agents

### Pipeline Optimization Tips
- Use `condition: succeeded()` to prevent unnecessary job execution
- Set appropriate `timeoutInMinutes` to avoid hanging jobs
- Use `continueOnError: true` for non-critical test failures
- Cache dependencies to speed up build times

## Pipeline Features

### Cross-Browser Testing
- Tests run on Windows agents only (due to parallelism limitations)
- Supports Chrome, Firefox, and Edge browsers
- Sequential execution to avoid parallelism constraints

> **Note**: The pipeline is configured for Windows-only execution due to Azure DevOps hosted parallelism limitations. For organizations with parallelism grants, the pipeline can be easily modified to include Linux agents for broader platform coverage.

### Test Reporting
- JUnit XML results for Azure DevOps integration
- HTML reports published as artifacts
- Screenshots captured on failures
- Test results aggregated across all browsers

### Notifications
- Email alerts when tests fail
- Rich HTML email format with build information
- Links to build results and repository

## Pipeline Variables

### Built-in Variables Used
- `nodeVersion`: Node.js version (18.x)
- `testResultsPath`: Path for test results
- `screenshotsPath`: Path for screenshots
- `reportsPath`: Path for reports

### Parameters
- `runE2ETests`: Enable/disable E2E tests (default: true)
- `runApiTests`: Enable/disable API tests (default: true)
- `browsers`: Array of browsers to test (chrome, firefox, edge)

## Troubleshooting

### Common Issues

1. **Email not sending**
   - Check if email variables are configured
   - Verify SMTP settings or Graph API permissions
   - Check pipeline logs for error messages

2. **HTML reports not found**
   - Ensure Playwright generates HTML reports
   - Check artifact publishing step logs
   - Verify report paths in test configuration

3. **Tests failing to run**
   - Check Node.js version compatibility
   - Verify browser installation on agents
   - Review test setup templates

### Monitoring

Monitor pipeline health through:
- Azure DevOps dashboard
- Email notifications on failures
- Test result trends in Azure DevOps
- Artifact storage usage

## Future Enhancements

Consider these improvements:
- Teams notifications integration
- Slack notifications
- Custom test report formatting
- Performance trend analysis
- Automated retries for flaky tests

## Support

For issues with the pipeline configuration:
1. Check the pipeline logs in Azure DevOps
2. Review this documentation
3. Contact the development team