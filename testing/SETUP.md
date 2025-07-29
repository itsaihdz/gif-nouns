# Testing Setup Guide

This guide will help you set up and run the complete testing infrastructure for the Upload & Preview System.

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

## 1. Install Dependencies

```bash
# Install testing dependencies
npm install --save-dev @testing-library/jest-dom @testing-library/react @testing-library/user-event @types/jest jest jest-environment-jsdom @playwright/test lighthouse k6

# Install additional dependencies for testing
npm install --save-dev @next/bundle-analyzer
```

## 2. Setup Test Environment

### Create Test Assets Directory
```bash
mkdir -p test-assets
```

### Add Sample Test Files
```bash
# Create a sample Noun image for testing
# You can use any PNG file under 5MB
cp path/to/your/noun.png test-assets/noun.png

# Create an invalid file for testing
echo "This is not an image" > test-assets/invalid.txt
```

## 3. Configure Environment Variables

Create `.env.test` for testing environment:

```bash
# .env.test
NODE_ENV=test
NEXT_PUBLIC_API_URL=http://localhost:3000
DATABASE_URL=test-database-url
UPLOAD_BUCKET=test-uploads
```

## 4. Run Different Types of Tests

### Unit Tests
```bash
# Run all unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- FileUpload.test.tsx
```

### E2E Tests
```bash
# Install Playwright browsers
npx playwright install

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run specific browser
npx playwright test --project=chromium
```

### Performance Tests
```bash
# Run Lighthouse performance test
npm run test:performance

# Run load tests with k6
k6 run load-tests/upload-flow.js

# Run load tests against staging
k6 run -e BASE_URL=https://staging.gif-nouns.vercel.app load-tests/upload-flow.js
```

### Smoke Tests
```bash
# Run basic smoke tests
npm run test:smoke
```

## 5. Test Data Setup

### Mock Database
The tests use a mock database. In a real implementation, you would:

1. Set up a test database
2. Run migrations
3. Seed test data
4. Clean up after tests

### Test Files
Ensure you have these test files in `test-assets/`:
- `noun.png` - Valid Noun image for testing
- `invalid.txt` - Invalid file for error testing
- `large.png` - File > 5MB for size limit testing

## 6. Continuous Integration Setup

### GitHub Actions Example
Create `.github/workflows/test.yml`:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run unit tests
      run: npm test
    
    - name: Run E2E tests
      run: npm run test:e2e
    
    - name: Run performance tests
      run: npm run test:performance
    
    - name: Upload test results
      uses: actions/upload-artifact@v3
      if: always()
      with:
        name: test-results
        path: |
          playwright-report/
          lighthouse-report.json
          coverage/
```

## 7. Monitoring Setup

### Vercel Analytics
The app already includes Vercel Analytics. To monitor in production:

1. Go to your Vercel dashboard
2. Navigate to Analytics tab
3. Set up custom events for:
   - Upload success/failure
   - Export completion
   - Error rates
   - Performance metrics

### Custom Metrics
Add these metrics to your monitoring dashboard:

```typescript
// Key metrics to track
const metrics = {
  uploadSuccessRate: 0,
  averageUploadTime: 0,
  exportSuccessRate: 0,
  averageExportTime: 0,
  errorRate: 0,
  dailyActiveUsers: 0,
  conversionRate: 0,
};
```

## 8. User Testing Setup

### Feedback Collection
The app includes a feedback widget. To use it:

1. Add the widget to your components:
```tsx
import { FeedbackWidget } from '../components/feedback/FeedbackWidget';

// In your component
const [showFeedback, setShowFeedback] = useState(false);

{showFeedback && (
  <FeedbackWidget
    onSubmit={handleFeedback}
    onClose={() => setShowFeedback(false)}
  />
)}
```

2. Handle feedback submission:
```tsx
const handleFeedback = async (feedback) => {
  const response = await fetch('/api/feedback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(feedback),
  });
  
  if (response.ok) {
    // Show success message
  }
};
```

### User Testing Script
Use the script in `testing/README.md` to conduct user testing sessions.

## 9. Troubleshooting

### Common Issues

**Jest tests failing:**
```bash
# Clear Jest cache
npm test -- --clearCache

# Check if all dependencies are installed
npm install
```

**Playwright tests failing:**
```bash
# Reinstall browsers
npx playwright install

# Run with debug
npx playwright test --debug
```

**Performance tests failing:**
```bash
# Check if app is running
npm run dev

# Run with verbose output
npm run test:performance -- --verbose
```

### Debug Mode
```bash
# Debug Jest tests
npm test -- --verbose --no-coverage

# Debug E2E tests
npx playwright test --debug

# Debug load tests
k6 run --verbose load-tests/upload-flow.js
```

## 10. Test Reports

### Coverage Report
After running `npm run test:coverage`, view the report at:
- `coverage/lcov-report/index.html`

### E2E Report
After running E2E tests, view the report at:
- `playwright-report/index.html`

### Performance Report
After running performance tests, view the report at:
- `lighthouse-report.json`

## 11. Next Steps

1. **Set up real database** for integration tests
2. **Configure CI/CD** pipeline
3. **Set up monitoring** and alerting
4. **Conduct user testing** sessions
5. **Iterate** based on feedback

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review test logs for specific error messages
3. Ensure all dependencies are properly installed
4. Verify environment variables are set correctly 