import { test, expect } from "../playwright-fixture";

test.describe('Diagram Save/Load (Guest Mode)', () => {
  
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test to start fresh
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('can save diagram with title and tags', async ({ page }) => {
    // Navigate to editor
    await page.goto('/editor');
    
    // Enter some diagram code
    const editor = page.locator('textarea').first();
    await editor.clear();
    await editor.fill('graph TD\n  A[Test Start] --> B[Test End]');
    
    // Click save button
    await page.getByRole('button', { name: /save/i }).click();
    
    // Save dialog should appear
    await expect(page.getByRole('dialog')).toBeVisible();
    
    // Fill in title
    const titleInput = page.getByLabel(/title/i);
    await titleInput.clear();
    await titleInput.fill('My Test Diagram');
    
    // Click save in dialog
    await page.getByRole('button', { name: /save diagram/i }).click();
    
    // Toast should confirm save
    await expect(page.getByText(/saved/i)).toBeVisible();
  });

  test('saved diagram appears in My Diagrams', async ({ page }) => {
    // First, save a diagram
    await page.goto('/editor');
    
    const editor = page.locator('textarea').first();
    await editor.clear();
    await editor.fill('graph TD\n  A[Saved] --> B[Diagram]');
    
    await page.getByRole('button', { name: /save/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    
    const titleInput = page.getByLabel(/title/i);
    await titleInput.clear();
    await titleInput.fill('Saved Diagram Test');
    
    await page.getByRole('button', { name: /save diagram/i }).click();
    
    // Wait for toast
    await expect(page.getByText(/saved/i)).toBeVisible();
    
    // Navigate to My Diagrams
    await page.goto('/my-diagrams');
    
    // Diagram should appear
    await expect(page.getByText('Saved Diagram Test')).toBeVisible();
  });

  test('can edit saved diagram', async ({ page }) => {
    // Save a diagram first
    await page.goto('/editor');
    
    const editor = page.locator('textarea').first();
    await editor.clear();
    await editor.fill('graph TD\n  A[Edit] --> B[Me]');
    
    await page.getByRole('button', { name: /save/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    
    const titleInput = page.getByLabel(/title/i);
    await titleInput.clear();
    await titleInput.fill('Edit Test Diagram');
    
    await page.getByRole('button', { name: /save diagram/i }).click();
    await expect(page.getByText(/saved/i)).toBeVisible();
    
    // Go to My Diagrams
    await page.goto('/my-diagrams');
    
    // Click Edit on the diagram
    await page.getByRole('button', { name: /edit/i }).first().click();
    
    // Should navigate to editor with diagram param
    await expect(page).toHaveURL(/\/editor\?diagram=/);
    
    // Editor should contain the saved code
    const loadedEditor = page.locator('textarea').first();
    await expect(loadedEditor).toContainText('Edit');
  });

  test('can delete saved diagram', async ({ page }) => {
    // Save a diagram first
    await page.goto('/editor');
    
    const editor = page.locator('textarea').first();
    await editor.clear();
    await editor.fill('graph TD\n  A[Delete] --> B[Me]');
    
    await page.getByRole('button', { name: /save/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    
    const titleInput = page.getByLabel(/title/i);
    await titleInput.clear();
    await titleInput.fill('Delete Test Diagram');
    
    await page.getByRole('button', { name: /save diagram/i }).click();
    await expect(page.getByText(/saved/i)).toBeVisible();
    
    // Go to My Diagrams
    await page.goto('/my-diagrams');
    
    // Diagram should exist
    await expect(page.getByText('Delete Test Diagram')).toBeVisible();
    
    // Click delete
    await page.getByRole('button', { name: /delete/i }).first().click();
    
    // Confirm deletion in dialog
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.getByRole('button', { name: /delete/i }).click();
    
    // Diagram should be gone
    await expect(page.getByText('Delete Test Diagram')).not.toBeVisible();
  });

  test('diagram persists after page reload', async ({ page }) => {
    // Save a diagram
    await page.goto('/editor');
    
    const editor = page.locator('textarea').first();
    await editor.clear();
    await editor.fill('graph TD\n  A[Persist] --> B[Test]');
    
    await page.getByRole('button', { name: /save/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    
    const titleInput = page.getByLabel(/title/i);
    await titleInput.clear();
    await titleInput.fill('Persist Test Diagram');
    
    await page.getByRole('button', { name: /save diagram/i }).click();
    await expect(page.getByText(/saved/i)).toBeVisible();
    
    // Navigate to My Diagrams and reload
    await page.goto('/my-diagrams');
    await expect(page.getByText('Persist Test Diagram')).toBeVisible();
    
    // Reload page
    await page.reload();
    
    // Diagram should still be there
    await expect(page.getByText('Persist Test Diagram')).toBeVisible();
  });
});

test.describe('Authentication Flow', () => {
  
  test('auth page loads correctly', async ({ page }) => {
    await page.goto('/auth');
    
    // Should see login form
    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
  });

  test('can toggle between login and signup', async ({ page }) => {
    await page.goto('/auth');
    
    // Should start in login mode
    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible();
    
    // Click to switch to signup
    await page.getByText(/don't have an account/i).click();
    
    // Should now be in signup mode
    await expect(page.getByRole('heading', { name: /create your account/i })).toBeVisible();
    
    // Click to switch back to login
    await page.getByText(/already have an account/i).click();
    
    // Should be back in login mode
    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible();
  });

  test('shows validation errors for invalid input', async ({ page }) => {
    await page.goto('/auth');
    
    // Try to submit with invalid email
    await page.getByLabel(/email/i).fill('invalid-email');
    await page.getByLabel(/password/i).fill('123');
    
    await page.getByRole('button', { name: /log in/i }).click();
    
    // Should show validation errors
    await expect(page.getByText(/valid email/i)).toBeVisible();
  });

  test('sign in link appears in navigation for guests', async ({ page }) => {
    await page.goto('/');
    
    // Should see Sign In link in navigation
    await expect(page.getByRole('navigation').getByRole('link', { name: /sign in/i })).toBeVisible();
  });
});

test.describe('Cloud Storage Indicators', () => {
  
  test('My Diagrams shows local storage indicator for guests', async ({ page }) => {
    await page.goto('/my-diagrams');
    
    // Should see Local indicator
    await expect(page.getByText(/local/i)).toBeVisible();
  });

  test('Editor toolbar shows local storage indicator for guests', async ({ page }) => {
    await page.goto('/editor');
    
    // Should see Local indicator in toolbar
    await expect(page.getByText(/local/i)).toBeVisible();
  });
});
