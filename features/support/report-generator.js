const reporter = require('cucumber-html-reporter');
const path = require('path');

const options = {
    theme: 'bootstrap',
    jsonFile: 'reports/cucumber-report.json',
    output: 'reports/cucumber-report.html',
    reportSuiteAsScenarios: true,
    scenarioTimestamp: true,
    launchReport: true,
    metadata: {
        "App Version": "2.0.0",
        "Test Environment": process.env.ENV || "development",
        "Browser": "Chromium",
        "Platform": process.platform,
        "Executed": "Local"
    }
};

try {
    reporter.generate(options);
    console.log('✅ Cucumber HTML report generated successfully!');
    console.log(`📊 Report available at: ${path.resolve(options.output)}`);
} catch (error) {
    console.error('❌ Error generating Cucumber report:', error.message);
}