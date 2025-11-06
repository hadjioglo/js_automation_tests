# K6 Performance Testing - Factory Direct

## 🎯 Stress Test Configuration

This stress test has been configured exactly as requested:

- **Starting VUs**: 10 users
- **Ramp up**: To 50 users over 5 minutes
- **Sustain**: 50 users for 10 minutes
- **Ramp down**: To 0 users over 2 minutes
- **Total duration**: 17 minutes

## 🚀 Running the Tests

### Prerequisites
- k6 is installed (already completed)
- PowerShell or command line access

### Run Commands

```bash
# Run the stress test
npm run test:performance:stress

# Run stress test with JSON report output
npm run test:performance:stress:report

# Or run directly with k6
k6 run tests/performance/stress-test.js
```

## 📊 Test Features

- **Multiple endpoints tested**: Homepage, products, contact, about, support sections
- **Realistic user behavior**: Random think time between requests (1-4 seconds)
- **Performance thresholds**:
  - 95% of requests under 5 seconds
  - Error rate under 10%
- **Comprehensive metrics**:
  - Response times
  - Error rates
  - Throughput
  - Custom business metrics

## 🎯 Target Website

- **URL**: `https://factory-direct.tilda.ws`
- **Test endpoints**:
  - `/` (Homepage)
  - `/#products` (Products section)
  - `/#contact` (Contact section)
  - `/#about` (About section)
  - `/#support` (Support section)

## 📈 Expected Results

The test validates:
- ✅ Website can handle 50 concurrent users
- ✅ Response times remain under performance thresholds
- ✅ Error rates stay minimal during peak load
- ✅ System performs well during ramp-up and sustained load

## 🔍 Interpreting Results

When the test completes, you'll see:
- **Total requests made**
- **Average and 95th percentile response times**
- **Error rate percentage**
- **Pass/fail status for performance thresholds**
- **Summary report with performance analysis**

Reports are saved to:
- Console output with summary
- `reports/stress-test-summary.json` (detailed metrics)
- `reports/stress-test-results.json` (when using report command)