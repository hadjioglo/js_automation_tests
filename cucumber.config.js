const { setDefaultTimeout } = require('@cucumber/cucumber');

// Set default timeout for steps (increased for web navigation)
setDefaultTimeout(30 * 1000);

module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: [
      'features/step_definitions/**/*.js',
      'features/support/**/*.js'
    ],
    format: [
      'progress-bar',
      'html:reports/cucumber-report.html',
      'json:reports/cucumber-report.json',
      'junit:reports/junit.xml'  // Add JUnit XML format for Azure DevOps
    ],
    formatOptions: {
      snippetInterface: 'async-await'
    },
    publishQuiet: true
  }
};