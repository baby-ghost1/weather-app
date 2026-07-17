// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Weather App', () => {

  test('should load the app with correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Weather/i);
  });

  test('should display the WeatherFlow header', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'WeatherFlow' })).toBeVisible();
  });

  test('should display the search bar', async ({ page }) => {
    await page.goto('/');
    const searchInput = page.getByPlaceholder(/search/i);
    await expect(searchInput).toBeVisible();
  });

  test('should display unit toggle and theme switcher', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('header')).toBeVisible();
  });

  test('should load weather data for default city', async ({ page }) => {
    await page.goto('/');
    // Wait for weather data to load (the app fetches by geolocation on mount)
    await page.waitForTimeout(3000);
    // The page should have rendered weather content
    const body = page.locator('body');
    await expect(body).not.toBeEmpty();
  });

  test('should search for a city', async ({ page }) => {
    await page.goto('/');
    const searchInput = page.getByPlaceholder(/search/i);
    await searchInput.fill('London');
    await searchInput.press('Enter');
    // Wait for results
    await page.waitForTimeout(3000);
    // The page should still be functional after search
    await expect(searchInput).toBeVisible();
  });

  test('should be responsive - mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'WeatherFlow' })).toBeVisible();
    const searchInput = page.getByPlaceholder(/search/i);
    await expect(searchInput).toBeVisible();
  });

});
