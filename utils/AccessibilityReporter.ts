import { AccessibilityResult, AccessibilityViolation } from './AccessibilityPageObject';
import * as fs from 'fs';
import * as path from 'path';

export interface AccessibilityReport {
  testRun: {
    timestamp: string;
    totalPages: number;
    totalViolations: number;
    passedPages: number;
    failedPages: number;
  };
  results: AccessibilityResult[];
  summary: {
    violationsByImpact: Record<string, number>;
    violationsByRule: Record<string, number>;
    commonViolations: Array<{
      rule: string;
      count: number;
      impact: string;
      description: string;
    }>;
  };
}

export class AccessibilityReporter {
  private results: AccessibilityResult[] = [];
  private reportDir: string;

  constructor(reportDir: string = 'test-results/accessibility') {
    this.reportDir = reportDir;
    this.ensureReportDirectory();
  }

  /**
   * Ensure the report directory exists
   */
  private ensureReportDirectory(): void {
    if (!fs.existsSync(this.reportDir)) {
      fs.mkdirSync(this.reportDir, { recursive: true });
    }
  }

  /**
   * Add a test result to the collection
   */
  addResult(result: AccessibilityResult): void {
    this.results.push(result);
  }

  /**
   * Generate a comprehensive accessibility report
   */
  generateReport(): AccessibilityReport {
    const violationsByImpact: Record<string, number> = {};
    const violationsByRule: Record<string, number> = {};
    const ruleDetails: Record<string, { count: number; impact: string; description: string }> = {};

    let totalViolations = 0;
    let passedPages = 0;

    this.results.forEach(result => {
      if (result.violations.length === 0) {
        passedPages++;
      }

      result.violations.forEach(violation => {
        totalViolations++;
        
        // Count by impact
        violationsByImpact[violation.impact] = (violationsByImpact[violation.impact] || 0) + 1;
        
        // Count by rule
        violationsByRule[violation.id] = (violationsByRule[violation.id] || 0) + 1;
        
        // Store rule details
        if (!ruleDetails[violation.id]) {
          ruleDetails[violation.id] = {
            count: 0,
            impact: violation.impact,
            description: violation.description
          };
        }
        ruleDetails[violation.id].count++;
      });
    });

    // Get common violations (sorted by frequency)
    const commonViolations = Object.entries(ruleDetails)
      .map(([rule, details]) => ({
        rule,
        count: details.count,
        impact: details.impact,
        description: details.description
      }))
      .sort((a, b) => b.count - a.count);

    return {
      testRun: {
        timestamp: new Date().toISOString(),
        totalPages: this.results.length,
        totalViolations,
        passedPages,
        failedPages: this.results.length - passedPages
      },
      results: this.results,
      summary: {
        violationsByImpact,
        violationsByRule,
        commonViolations
      }
    };
  }

  /**
   * Save the report to files
   */
  async saveReport(): Promise<void> {
    const report = this.generateReport();
    
    // Save JSON report
    const jsonPath = path.join(this.reportDir, 'accessibility-report.json');
    fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));

    // Save HTML report
    const htmlPath = path.join(this.reportDir, 'accessibility-report.html');
    const htmlContent = this.generateHtmlReport(report);
    fs.writeFileSync(htmlPath, htmlContent);

    // Save CSV summary for easy analysis
    const csvPath = path.join(this.reportDir, 'accessibility-violations.csv');
    const csvContent = this.generateCsvReport(report);
    fs.writeFileSync(csvPath, csvContent);

    console.log(`📊 Accessibility reports saved:`);
    console.log(`   JSON: ${jsonPath}`);
    console.log(`   HTML: ${htmlPath}`);
    console.log(`   CSV:  ${csvPath}`);
  }

  /**
   * Generate HTML report
   */
  private generateHtmlReport(report: AccessibilityReport): string {
    const { testRun, results, summary } = report;
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Accessibility Test Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .header { border-bottom: 2px solid #007acc; padding-bottom: 20px; margin-bottom: 30px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .card { background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; border-left: 4px solid #007acc; }
        .card.error { border-left-color: #dc3545; }
        .card.warning { border-left-color: #ffc107; }
        .card.success { border-left-color: #28a745; }
        .violation { background: #fff; border: 1px solid #dee2e6; border-radius: 4px; margin-bottom: 15px; padding: 15px; }
        .violation-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
        .impact { padding: 2px 8px; border-radius: 4px; color: white; font-size: 12px; font-weight: bold; }
        .impact.critical { background: #dc3545; }
        .impact.serious { background: #fd7e14; }
        .impact.moderate { background: #ffc107; color: #000; }
        .impact.minor { background: #6c757d; }
        .page-result { margin-bottom: 40px; }
        .page-header { background: #e9ecef; padding: 15px; border-radius: 4px; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #dee2e6; }
        th { background: #f8f9fa; font-weight: bold; }
        .no-violations { color: #28a745; font-weight: bold; text-align: center; padding: 40px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔍 Accessibility Test Report</h1>
            <p>Generated on ${new Date(testRun.timestamp).toLocaleString()}</p>
        </div>

        <div class="summary">
            <div class="card">
                <h3>${testRun.totalPages}</h3>
                <p>Pages Tested</p>
            </div>
            <div class="card ${testRun.totalViolations > 0 ? 'error' : 'success'}">
                <h3>${testRun.totalViolations}</h3>
                <p>Total Violations</p>
            </div>
            <div class="card success">
                <h3>${testRun.passedPages}</h3>
                <p>Pages Passed</p>
            </div>
            <div class="card ${testRun.failedPages > 0 ? 'error' : 'success'}">
                <h3>${testRun.failedPages}</h3>
                <p>Pages Failed</p>
            </div>
        </div>

        <h2>📊 Violation Summary</h2>
        <table>
            <thead>
                <tr>
                    <th>Rule</th>
                    <th>Occurrences</th>
                    <th>Impact</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>
                ${summary.commonViolations.map(violation => `
                    <tr>
                        <td><code>${violation.rule}</code></td>
                        <td>${violation.count}</td>
                        <td><span class="impact ${violation.impact}">${violation.impact.toUpperCase()}</span></td>
                        <td>${violation.description}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>

        <h2>📋 Detailed Results</h2>
        ${results.map(result => `
            <div class="page-result">
                <div class="page-header">
                    <h3>${result.pageName}</h3>
                    <p><strong>URL:</strong> ${result.url}</p>
                    <p><strong>Viewport:</strong> ${result.viewport.name} (${result.viewport.width}x${result.viewport.height})</p>
                    <p><strong>Violations:</strong> ${result.violations.length} | <strong>Passes:</strong> ${result.passes}</p>
                </div>
                
                ${result.violations.length === 0 
                    ? '<div class="no-violations">✅ No accessibility violations found!</div>'
                    : result.violations.map(violation => `
                        <div class="violation">
                            <div class="violation-header">
                                <h4>${violation.help}</h4>
                                <span class="impact ${violation.impact}">${violation.impact.toUpperCase()}</span>
                            </div>
                            <p><strong>Rule:</strong> <code>${violation.id}</code></p>
                            <p><strong>Description:</strong> ${violation.description}</p>
                            <p><strong>Help:</strong> <a href="${violation.helpUrl}" target="_blank">Learn more</a></p>
                            <details>
                                <summary>Affected Elements (${violation.nodes.length})</summary>
                                <ul>
                                    ${violation.nodes.map(node => `
                                        <li>
                                            <strong>Selector:</strong> <code>${node.target.join(', ')}</code><br>
                                            <strong>HTML:</strong> <code>${node.html}</code><br>
                                            <strong>Issue:</strong> ${node.failureSummary}
                                        </li>
                                    `).join('')}
                                </ul>
                            </details>
                        </div>
                    `).join('')
                }
            </div>
        `).join('')}
    </div>
</body>
</html>`;
  }

  /**
   * Generate CSV report for easy analysis
   */
  private generateCsvReport(report: AccessibilityReport): string {
    const headers = ['Page', 'URL', 'Viewport', 'Rule ID', 'Impact', 'Description', 'Element Count', 'Help URL'];
    const rows = [headers.join(',')];

    report.results.forEach(result => {
      if (result.violations.length === 0) {
        // Add a row for pages with no violations
        rows.push([
          `"${result.pageName}"`,
          `"${result.url}"`,
          `"${result.viewport.name}"`,
          'No violations',
          'N/A',
          'Page passed accessibility tests',
          '0',
          'N/A'
        ].join(','));
      } else {
        result.violations.forEach(violation => {
          rows.push([
            `"${result.pageName}"`,
            `"${result.url}"`,
            `"${result.viewport.name}"`,
            `"${violation.id}"`,
            violation.impact,
            `"${violation.description.replace(/"/g, '""')}"`,
            violation.nodes.length.toString(),
            `"${violation.helpUrl}"`
          ].join(','));
        });
      }
    });

    return rows.join('\n');
  }

  /**
   * Print summary to console
   */
  printSummary(): void {
    const report = this.generateReport();
    const { testRun, summary } = report;

    console.log('\n🔍 ACCESSIBILITY TEST SUMMARY');
    console.log('================================');
    console.log(`📄 Pages tested: ${testRun.totalPages}`);
    console.log(`✅ Pages passed: ${testRun.passedPages}`);
    console.log(`❌ Pages failed: ${testRun.failedPages}`);
    console.log(`🚨 Total violations: ${testRun.totalViolations}`);

    if (testRun.totalViolations > 0) {
      console.log('\n📊 Violations by Impact:');
      Object.entries(summary.violationsByImpact)
        .sort(([,a], [,b]) => b - a)
        .forEach(([impact, count]) => {
          console.log(`   ${impact}: ${count}`);
        });

      console.log('\n🔝 Most Common Issues:');
      summary.commonViolations.slice(0, 5).forEach((violation, index) => {
        console.log(`   ${index + 1}. ${violation.rule} (${violation.count} occurrences) - ${violation.impact}`);
      });
    }

    console.log('\n================================\n');
  }
}