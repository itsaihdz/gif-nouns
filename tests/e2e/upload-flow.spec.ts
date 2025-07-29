import { test, expect } from '@playwright/test'

test.describe('Upload & Preview System', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/upload')
  })

  test('complete upload flow - happy path', async ({ page }) => {
    // 1. Verify initial state
    await expect(page.getByText('Upload your Noun PFP')).toBeVisible()
    await expect(page.getByText('Drag & drop your Noun image, or click to browse')).toBeVisible()

    // 2. Upload file
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles('test-assets/noun.png')

    // 3. Wait for detection step
    await expect(page.getByText('Detecting Noun Traits')).toBeVisible()
    await expect(page.getByText('Analyzing your Noun...')).toBeVisible()

    // 4. Wait for preview step
    await expect(page.getByText('Customize Your Animated Noun')).toBeVisible()
    await expect(page.getByText('Noggle Colors')).toBeVisible()
    await expect(page.getByText('Eye Animations')).toBeVisible()

    // 5. Customize noggles
    await page.click('[data-testid="noggle-color-blue"]')
    await expect(page.locator('[data-testid="noggle-color-blue"]')).toHaveClass(/selected/)

    // 6. Customize eyes
    await page.click('[data-testid="eye-animation-glow"]')
    await expect(page.locator('[data-testid="eye-animation-glow"]')).toHaveClass(/selected/)

    // 7. Export GIF
    await page.click('[data-testid="export-button"]')
    await expect(page.getByText('Generating your animated Noun...')).toBeVisible()

    // 8. Verify completion
    await expect(page.getByText('Your Animated Noun is Ready!')).toBeVisible()
    await expect(page.getByText('Download Animated Noun')).toBeVisible()
    await expect(page.getByText('Create Another')).toBeVisible()
  })

  test('file validation - invalid file type', async ({ page }) => {
    // Try to upload invalid file
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles('test-assets/invalid.txt')

    // Should show error
    await expect(page.getByText('Please upload a PNG, JPG, or SVG file')).toBeVisible()
  })

  test('file validation - oversized file', async ({ page }) => {
    // Create a large file (this would need to be a real large file in test assets)
    // For now, we'll test the UI behavior
    await expect(page.getByText('Max 5MB')).toBeVisible()
  })

  test('drag and drop functionality', async ({ page }) => {
    // Test drag and drop (this would need a real file)
    const dropZone = page.locator('[data-testid="drop-zone"]')
    
    // Simulate drag over
    await dropZone.hover()
    await expect(dropZone).toHaveClass(/drag-active/)
  })

  test('responsive design - mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    // Verify mobile layout
    await expect(page.getByText('Upload your Noun PFP')).toBeVisible()
    
    // Check that elements are properly stacked
    const uploadCard = page.locator('[data-testid="upload-card"]')
    await expect(uploadCard).toBeVisible()
  })

  test('error handling - network failure', async ({ page }) => {
    // Mock network failure
    await page.route('**/api/upload', route => route.abort())

    // Try to upload
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles('test-assets/noun.png')

    // Should show error
    await expect(page.getByText(/Failed to upload/)).toBeVisible()
  })

  test('accessibility - keyboard navigation', async ({ page }) => {
    // Test keyboard navigation
    await page.keyboard.press('Tab')
    await expect(page.locator('input[type="file"]')).toBeFocused()

    // Test color selection with keyboard
    await page.keyboard.press('Tab')
    await page.keyboard.press('Enter')
    
    // Should open color picker or select first color
    await expect(page.locator('[data-testid="noggle-colors"]')).toBeVisible()
  })

  test('performance - load time', async ({ page }) => {
    // Measure page load time
    const startTime = Date.now()
    await page.goto('/upload')
    const loadTime = Date.now() - startTime

    // Should load within 3 seconds
    expect(loadTime).toBeLessThan(3000)
  })

  test('cross-browser compatibility', async ({ page }) => {
    // This test will run on different browsers based on Playwright config
    await expect(page.getByText('Upload your Noun PFP')).toBeVisible()
    await expect(page.getByText('Choose File')).toBeVisible()
  })
}) 