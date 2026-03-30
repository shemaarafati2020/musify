import { test, expect } from '@playwright/test';

test.describe('Musify Music Player', () => {
  test('has correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Musify/);
  });

  test('navigation works correctly', async ({ page }) => {
    await page.goto('/');
    
    // Test Home link
    await page.click('text=Home');
    await expect(page).toHaveURL('/');
    
    // Test Search link
    await page.click('text=Search');
    await expect(page).toHaveURL('/search');
    
    // Test Library link
    await page.click('text=Your Library');
    await expect(page).toHaveURL('/library');
  });

  test('sidebar can be collapsed and expanded', async ({ page }) => {
    await page.goto('/');
    
    // Check sidebar is initially expanded
    await expect(page.locator('text=Musify')).toBeVisible();
    
    // Collapse sidebar
    await page.click('[data-testid="collapse-button"]');
    await expect(page.locator('text=Musify')).not.toBeVisible();
    
    // Expand sidebar
    await page.click('[data-testid="collapse-button"]');
    await expect(page.locator('text=Musify')).toBeVisible();
  });

  test('search functionality works', async ({ page }) => {
    await page.goto('/search');
    
    // Type in search box
    await page.fill('input[placeholder*="What do you want to listen to"]', 'test');
    
    // Check if search results appear
    await expect(page.locator('text=Top results')).toBeVisible();
  });

  test('playback bar is visible', async ({ page }) => {
    await page.goto('/');
    
    // Check if playback bar is present
    await expect(page.locator('[data-testid="playback-bar"]')).toBeVisible();
  });
});
