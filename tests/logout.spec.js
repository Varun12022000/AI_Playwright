const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/LoginPage');
const { InventoryPage } = require('./pages/InventoryPage');

test.describe('Core storefront user journeys', () => {
  test('Log out and verify authenticated access is ended', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    // 1. Sign in and verify the navigation menu actions.
    await loginPage.goto();
    await loginPage.signIn('standard_user', 'secret_sauce');
    await expect(inventoryPage.productsHeading).toBeVisible();
    await inventoryPage.openMenu();
    await expect(inventoryPage.menuButton('All Items')).toBeVisible();
    await expect(inventoryPage.menuButton('Dynamic Catalog')).toBeVisible();
    await expect(inventoryPage.aboutLink).toBeVisible();
    await expect(inventoryPage.logoutButton).toBeVisible();
    await expect(inventoryPage.menuButton('Reset App State')).toBeVisible();

    // 2. Log out and confirm the login form is displayed again.
    await inventoryPage.logout();
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(inventoryPage.productsHeading).toHaveCount(0);
    await expect(page).toHaveURL('https://www.saucedemo.com/');

    // 3. Try opening the protected inventory URL while signed out.
    await page.goto('https://www.saucedemo.com/inventory.html');
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('You can only access');
    await expect(inventoryPage.productsHeading).toHaveCount(0);
    await expect(inventoryPage.cartButton).toHaveCount(0);
    await expect(page).toHaveURL('https://www.saucedemo.com/');

    // 4. Sign in again and confirm the catalog is available.
    await loginPage.signIn('standard_user', 'secret_sauce');
    await expect(inventoryPage.productsHeading).toBeVisible();
    await expect(inventoryPage.cartButton).toBeVisible();
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  });
});
