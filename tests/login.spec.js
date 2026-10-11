const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/LoginPage');
const { InventoryPage } = require('./pages/InventoryPage');

test.describe('Core storefront user journeys', () => {
  test('Sign in and reject invalid or incomplete credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    // 1. Open the site and check the login form and documented demo credentials.
    await loginPage.goto();
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
    await expect(page.getByText('standard_user', { exact: false })).toBeVisible();
    await expect(page.getByText('secret_sauce', { exact: false })).toBeVisible();

    // 2. Submit empty credentials and confirm username validation is shown.
    await loginPage.loginButton.click();
    await expect(loginPage.errorMessage).toContainText('Username is required');
    await expect(page).toHaveURL('https://www.saucedemo.com/');

    // 3. Submit invalid credentials and confirm authentication is rejected.
    await loginPage.signIn('invalid_user', 'wrong_password');
    await expect(loginPage.errorMessage).toContainText('Username and password do not match');
    await expect(page).toHaveURL('https://www.saucedemo.com/');

    // 4. Sign in with the documented standard account and verify the inventory.
    await loginPage.signIn('standard_user', 'secret_sauce');
    await expect(inventoryPage.productsHeading).toBeVisible();
    await expect(inventoryPage.cartButton).toBeVisible();
  });
});
