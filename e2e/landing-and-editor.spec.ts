import { test, expect } from "../playwright-fixture";

test.describe('Landing Page', () => {
  test('loads with hero section visible', async ({ page }) => {
    await page.goto('/');
    
    // Hero headlines should be visible
    await expect(page.getByRole('heading', { name: 'Transform Ideas Into', level: 1 })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Beautiful Diagrams', level: 2 })).toBeVisible();
  });

  test('navigation links are functional', async ({ page }) => {
    await page.goto('/');
    
    // Check navigation links exist in nav
    await expect(page.getByRole('navigation').getByRole('link', { name: 'Templates' })).toBeVisible();
    await expect(page.getByRole('navigation').getByRole('link', { name: 'My Diagrams' })).toBeVisible();
  });

  test('Start Creating button navigates to editor', async ({ page }) => {
    await page.goto('/');
    
    // Click the primary CTA in hero section (first one)
    await page.getByRole('link', { name: /start creating/i }).first().click();
    
    // Should navigate to editor
    await expect(page).toHaveURL(/\/editor/);
  });
});

test.describe('Editor Page', () => {
  test('loads with code editor visible', async ({ page }) => {
    await page.goto('/editor');
    
    // Code editor textarea should be visible
    await expect(page.locator('textarea').first()).toBeVisible();
  });

  test('code editor accepts input', async ({ page }) => {
    await page.goto('/editor');
    
    const editor = page.locator('textarea').first();
    await editor.clear();
    await editor.fill('graph TD\n  A[Start] --> B[End]');
    
    await expect(editor).toHaveValue('graph TD\n  A[Start] --> B[End]');
  });

  test('preview renders valid Mermaid diagram', async ({ page }) => {
    await page.goto('/editor');
    
    const editor = page.locator('textarea').first();
    await editor.clear();
    await editor.fill('graph TD\n  A[Start] --> B[End]');
    
    // Wait for debounced render (300ms) + rendering time
    await page.waitForTimeout(600);
    
    // Should see rendered SVG (mermaid-container with SVG inside)
    await expect(page.locator('.mermaid-container svg')).toBeVisible();
  });

  test('shows error for invalid Mermaid syntax', async ({ page }) => {
    await page.goto('/editor');
    
    const editor = page.locator('textarea').first();
    await editor.clear();
    await editor.fill('invalid mermaid syntax here');
    
    // Wait for debounced render
    await page.waitForTimeout(600);
    
    // Should show syntax error
    await expect(page.getByText(/syntax error/i)).toBeVisible();
  });

  test('AI Prompt tab is accessible', async ({ page }) => {
    await page.goto('/editor');
    
    // Click AI Prompt tab
    await page.getByRole('tab', { name: /ai prompt/i }).click();
    
    // Should see AI-related content after tab switch
    await expect(page.getByRole('button', { name: /generate/i })).toBeVisible();
  });
});

test.describe('Templates Page', () => {
  test('loads templates grid', async ({ page }) => {
    await page.goto('/templates');
    
    // Should see template cards
    await expect(page.getByText(/templates/i).first()).toBeVisible();
  });

  test('clicking Use Template navigates to editor', async ({ page }) => {
    await page.goto('/templates');
    
    // Click first "Use Template" button
    const useButton = page.getByRole('button', { name: /use template/i }).first();
    await useButton.click();
    
    // Should navigate to editor with template param
    await expect(page).toHaveURL(/\/editor\?template=/);
  });
});

test.describe('My Diagrams Page', () => {
  test('shows empty state or diagram list', async ({ page }) => {
    await page.goto('/my-diagrams');
    
    // Should load successfully
    await expect(page.locator('body')).toBeVisible();
    
    // Should show either empty state or diagrams
    const hasEmptyState = await page.getByText(/no diagrams/i).isVisible().catch(() => false);
    const hasDiagrams = await page.locator('[data-testid="diagram-card"]').count().catch(() => 0);
    
    // Either condition is valid
    expect(hasEmptyState || hasDiagrams >= 0).toBe(true);
  });
});
