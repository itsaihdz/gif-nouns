import http from 'k6/http'
import { check, sleep } from 'k6'
import { Rate } from 'k6/metrics'

// Custom metrics
const errorRate = new Rate('errors')

export const options = {
  stages: [
    { duration: '2m', target: 10 }, // Ramp up to 10 users
    { duration: '5m', target: 10 }, // Stay at 10 users
    { duration: '2m', target: 20 }, // Ramp up to 20 users
    { duration: '5m', target: 20 }, // Stay at 20 users
    { duration: '2m', target: 0 },  // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<3000'], // 95% of requests must complete below 3s
    http_req_failed: ['rate<0.1'],     // Error rate must be less than 10%
    errors: ['rate<0.1'],              // Custom error rate
  },
}

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000'

export default function () {
  // Test 1: Health check
  const healthCheck = http.get(`${BASE_URL}/api/upload`)
  check(healthCheck, {
    'health check status is 200': (r) => r.status === 200,
    'health check response time < 500ms': (r) => r.timings.duration < 500,
  })

  // Test 2: File upload simulation
  const fileData = 'mock-image-data'.repeat(1000) // ~16KB file
  const payload = {
    file: fileData,
    fileName: 'test-noun.png',
    fileType: 'image/png',
  }

  const uploadResponse = http.post(`${BASE_URL}/api/upload`, payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  const uploadCheck = check(uploadResponse, {
    'upload status is 200': (r) => r.status === 200,
    'upload response time < 5s': (r) => r.timings.duration < 5000,
    'upload returns success': (r) => {
      try {
        const body = JSON.parse(r.body)
        return body.success === true
      } catch {
        return false
      }
    },
  })

  // Test 3: GIF generation simulation
  const gifPayload = JSON.stringify({
    imageUrl: 'https://example.com/test-image.png',
    noggleColor: 'blue',
    eyeAnimation: 'glow',
    width: 800,
    height: 800,
  })

  const gifResponse = http.post(`${BASE_URL}/api/generate-gif`, gifPayload, {
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const gifCheck = check(gifResponse, {
    'gif generation status is 200': (r) => r.status === 200,
    'gif generation response time < 10s': (r) => r.timings.duration < 10000,
    'gif generation returns success': (r) => {
      try {
        const body = JSON.parse(r.body)
        return body.success === true
      } catch {
        return false
      }
    },
  })

  // Record errors
  if (!uploadCheck || !gifCheck) {
    errorRate.add(1)
  }

  // Think time between requests
  sleep(1)
}

export function handleSummary(data) {
  return {
    'load-test-results.json': JSON.stringify(data, null, 2),
    stdout: `
      Load Test Results:
      =================
      Total Requests: ${data.metrics.http_reqs.values.count}
      Average Response Time: ${data.metrics.http_req_duration.values.avg.toFixed(2)}ms
      P95 Response Time: ${data.metrics.http_req_duration.values['p(95)'].toFixed(2)}ms
      Error Rate: ${(data.metrics.http_req_failed.values.rate * 100).toFixed(2)}%
      Requests per Second: ${data.metrics.http_reqs.values.rate.toFixed(2)}
    `,
  }
} 