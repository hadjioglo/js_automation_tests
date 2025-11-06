import http from 'k6/http';
import { check, sleep } from 'k6';
import { Counter, Rate, Trend } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const responseTime = new Trend('response_time');
const successfulRequests = new Counter('successful_requests');

// Test configuration
export let options = {
  // Stress test stages as requested:
  // - Start with 10 users
  // - Ramp up to 50 users over 5 minutes
  // - Maintain 50 users for 10 minutes
  // - Ramp down to 0 over 2 minutes
  stages: [
    { duration: '5m', target: 50 },   // Ramp up to 50 users over 5 minutes
    { duration: '10m', target: 50 },  // Maintain 50 users for 10 minutes
    { duration: '2m', target: 0 },    // Ramp down to 0 over 2 minutes
  ],
  
  // Start with 10 users
  vus: 10,
  
  // Thresholds for performance validation
  thresholds: {
    http_req_duration: ['p(95)<5000'], // 95% of requests should be below 5s
    http_req_failed: ['rate<0.1'],     // Error rate should be less than 10%
    errors: ['rate<0.1'],              // Custom error rate should be less than 10%
  },
  
  // Additional options
  userAgent: 'k6-stress-test/1.0',
  insecureSkipTLSVerify: false,
  noConnectionReuse: false,
  noVUConnectionReuse: false,
  minIterationDuration: '1s',
  maxRedirects: 4,
  batch: 15,
  batchPerHost: 5,
  httpDebug: 'none',
  tlsVersion: {
    min: 'tls1.2',
    max: 'tls1.3',
  },
};

// Test data and configuration
const BASE_URL = 'https://factory-direct.tilda.ws';
const endpoints = [
  '/',
  '/#products',
  '/#contact',
  '/#about',
  '/#support'
];

// Setup function - runs once at the beginning
export function setup() {
  console.log('🚀 Starting stress test for Factory Direct website');
  console.log(`📊 Test configuration:`);
  console.log(`   - Starting VUs: 10`);
  console.log(`   - Peak VUs: 50`);
  console.log(`   - Test duration: 17 minutes total`);
  console.log(`   - Target website: ${BASE_URL}`);
  
  // Verify the target site is accessible
  const response = http.get(BASE_URL);
  if (response.status !== 200) {
    throw new Error(`Target site is not accessible. Status: ${response.status}`);
  }
  
  return { baseUrl: BASE_URL };
}

// Main test function - runs for each virtual user iteration
export default function(data) {
  // Select a random endpoint to test
  const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
  const url = `${data.baseUrl}${endpoint}`;
  
  // Configure request parameters
  const params = {
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Cache-Control': 'no-cache',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) k6-stress-test',
    },
    timeout: '30s',
  };
  
  // Record start time for custom metrics
  const startTime = Date.now();
  
  // Make the HTTP request
  const response = http.get(url, params);
  
  // Calculate response time
  const responseTime_ms = Date.now() - startTime;
  responseTime.add(responseTime_ms);
  
  // Check response status and content
  const isSuccess = check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 5s': (r) => r.timings.duration < 5000,
    'response body is not empty': (r) => r.body && r.body.length > 0,
    'response contains expected content': (r) => 
      r.body && (
        r.body.includes('Factory Direct') || 
        r.body.includes('factory-direct') ||
        r.body.includes('tilda')
      ),
    'no server errors': (r) => r.status < 500,
    'response has valid headers': (r) => r.headers['Content-Type'] !== undefined,
  });
  
  // Record metrics
  if (isSuccess) {
    successfulRequests.add(1);
  } else {
    errorRate.add(1);
    console.log(`❌ Request failed for ${url}: Status ${response.status}, Duration: ${responseTime_ms}ms`);
  }
  
  // Log performance data for monitoring
  if (__ITER % 50 === 0) { // Log every 50th iteration to avoid spam
    console.log(`📊 VU ${__VU} - Iteration ${__ITER}: ${url} - ${response.status} (${responseTime_ms}ms)`);
  }
  
  // Simulate realistic user behavior with random think time
  const thinkTime = Math.random() * 3 + 1; // Random sleep between 1-4 seconds
  sleep(thinkTime);
}

// Teardown function - runs once at the end
export function teardown(data) {
  console.log('🏁 Stress test completed');
  console.log('📈 Final metrics summary will be displayed by k6');
}

// Handle setup errors
export function handleSummary(data) {
  return {
    'reports/stress-test-summary.json': JSON.stringify(data, null, 2),
    stdout: `
🎯 STRESS TEST SUMMARY
====================
Test Duration: ${data.metrics.iteration_duration.values.avg.toFixed(2)}ms avg iteration
Total Requests: ${data.metrics.http_reqs.values.count}
Failed Requests: ${data.metrics.http_req_failed.values.rate.toFixed(2)}%
Average Response Time: ${data.metrics.http_req_duration.values.avg.toFixed(2)}ms
95th Percentile: ${data.metrics.http_req_duration.values['p(95)'].toFixed(2)}ms
Peak VUs: ${data.metrics.vus_max.values.max}

🔍 Performance Analysis:
- Response Time Target (p95 < 5s): ${data.metrics.http_req_duration.values['p(95)'] < 5000 ? '✅ PASSED' : '❌ FAILED'}
- Error Rate Target (< 10%): ${data.metrics.http_req_failed.values.rate < 0.1 ? '✅ PASSED' : '❌ FAILED'}
- Peak Load Handled: ${data.metrics.vus_max.values.max} concurrent users

📊 Test completed successfully!
====================
`,
  };
}
