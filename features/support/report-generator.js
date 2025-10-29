const reporter = require('cucumber-html-reporter');
const path = require('path');
const fs = require('fs');

const options = {
    theme: 'bootstrap',
    jsonFile: 'reports/test-results.json',  // Use the file that actually gets generated
    output: 'reports/cucumber-report.html',
    reportSuiteAsScenarios: true,
    scenarioTimestamp: true,
    launchReport: false, // Don't auto-open in CI
    metadata: {
        "App Version": "2.0.0",
        "Test Environment": process.env.ENV || "development",
        "Browser": "Chromium",
        "Platform": process.platform,
        "Executed": process.env.CI ? "Azure DevOps" : "Local"
    }
};

try {
    // Check if the JSON file exists before trying to generate the report
    if (!fs.existsSync(options.jsonFile)) {
        console.log('⚠️  Cucumber JSON report file not found:', options.jsonFile);
        console.log('💡 This usually means:');
        console.log('   - No Cucumber tests were executed');
        console.log('   - Tests failed before generating results');
        console.log('   - Tests were run without JSON output format');
        console.log('');
        console.log('🔧 To fix this, ensure you run Cucumber tests first:');
        console.log('   npm run cucumber');
        console.log('   npm run cucumber:smoke');
        console.log('   npm run cucumber:regression');
        
        // Create a simple HTML file indicating no tests were run
        const reportsDir = path.dirname(options.output);
        if (!fs.existsSync(reportsDir)) {
            fs.mkdirSync(reportsDir, { recursive: true });
        }
        
        const simpleHtml = `
<!DOCTYPE html>
<html>
<head>
    <title>Cucumber Test Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { color: #333; }
        .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 5px; }
        .info { margin-top: 20px; }
    </style>
</head>
<body>
    <h1 class="header">🥒 Cucumber Test Report</h1>
    <div class="warning">
        <h2>⚠️ No Test Results Available</h2>
        <p>No Cucumber tests were executed or the test run failed before generating results.</p>
    </div>
    <div class="info">
        <h3>💡 How to generate test results:</h3>
        <ul>
            <li>Run all tests: <code>npm run cucumber</code></li>
            <li>Run smoke tests: <code>npm run cucumber:smoke</code></li>
            <li>Run regression tests: <code>npm run cucumber:regression</code></li>
        </ul>
        <p><strong>Generated:</strong> ${new Date().toISOString()}</p>
        <p><strong>Environment:</strong> ${options.metadata["Test Environment"]}</p>
        <p><strong>Platform:</strong> ${options.metadata.Platform}</p>
    </div>
</body>
</html>`;
        
        fs.writeFileSync(options.output, simpleHtml);
        console.log('📝 Created simple HTML report indicating no tests were run');
        console.log(`📊 Report available at: ${path.resolve(options.output)}`);
        return;
    }
    
    // Check if JSON file has content
    const jsonContent = fs.readFileSync(options.jsonFile, 'utf8');
    let reportData;
    try {
        reportData = JSON.parse(jsonContent);
    } catch (parseError) {
        throw new Error(`Invalid JSON format in ${options.jsonFile}: ${parseError.message}`);
    }
    
    // Check if it's an array (proper Cucumber format) or has content
    if (Array.isArray(reportData) && reportData.length === 0) {
        console.log('⚠️  JSON file exists but contains no test results');
        const simpleHtml = `
<!DOCTYPE html>
<html>
<head>
    <title>Cucumber Test Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { color: #333; }
        .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 5px; }
    </style>
</head>
<body>
    <h1 class="header">🥒 Cucumber Test Report</h1>
    <div class="warning">
        <h2>📝 Empty Test Run</h2>
        <p>Cucumber ran but no scenarios were executed. This could mean:</p>
        <ul>
            <li>No feature files matched the specified tags</li>
            <li>All scenarios were skipped</li>
            <li>Feature files have no scenarios</li>
        </ul>
        <p><strong>Generated:</strong> ${new Date().toISOString()}</p>
    </div>
</body>
</html>`;
        fs.writeFileSync(options.output, simpleHtml);
        console.log('📝 Created report for empty test run');
        return;
    }
    
    // Generate the actual Cucumber HTML report
    reporter.generate(options);
    console.log('✅ Cucumber HTML report generated successfully!');
    console.log(`📊 Report available at: ${path.resolve(options.output)}`);
    
    // Log summary if JSON file has content
    if (Array.isArray(reportData) && reportData.length > 0) {
        const totalScenarios = reportData.reduce((sum, feature) => 
            sum + (feature.elements ? feature.elements.length : 0), 0);
        console.log(`📈 Report contains ${reportData.length} feature(s) with ${totalScenarios} scenario(s)`);
    }
    
} catch (error) {
    console.error('❌ Error generating Cucumber report:', error.message);
    if (process.env.CI) {
        console.error('🔍 Full error details:', error);
    }
    process.exit(1);
}