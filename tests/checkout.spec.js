const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/LoginPage');
const { InventoryPage } = require('./pages/InventoryPage');
const { CartPage } = require('./pages/CartPage');
const { CheckoutInformationPage } = require('./pages/CheckoutInformationPage');
const { CheckoutOverviewPage } = require('./pages/CheckoutOverviewPage');
const { CheckoutCompletePage } = require('./pages/CheckoutCompletePage');

test.describe('Core storefront user journeys', () => {
  test('Validate checkout details and complete an order', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const informationPage = new CheckoutInformationPage(page);
    const overviewPage = new CheckoutOverviewPage(page);
    const completePage = new CheckoutCompletePage(page);

    // 1. Sign in, add Backpack, and start checkout.
    await loginPage.goto();
    await loginPage.signIn('standard_user', 'secret_sauce');
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.openCart();
    await cartPage.checkoutButton.click();
    await expect(informationPage.heading).toBeVisible();
    await expect(informationPage.firstNameInput).toBeVisible();
    await expect(informationPage.lastNameInput).toBeVisible();
    await expect(informationPage.postalCodeInput).toBeVisible();
    await expect(informationPage.continueButton).toBeVisible();
    await expect(informationPage.cancelButton).toBeVisible();

    // 2. Submit an empty form and verify the required first-name message.
    await informationPage.continueButton.click();
    await expect(informationPage.errorMessage).toContainText('First Name is required');
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-one.html');

    // 3. Supply names but omit postal code to verify its validation.
    await informationPage.firstNameInput.fill('Alex');
    await informationPage.lastNameInput.fill('Tester');
    await informationPage.continueButton.click();
    await expect(informationPage.errorMessage).toContainText('Postal Code is required');
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-one.html');

    // 4. Complete the information and verify the order overview and totals.
    await informationPage.postalCodeInput.fill('10001');
    await informationPage.continueButton.click();
    await expect(overviewPage.heading).toBeVisible();
    await expect(overviewPage.backpack).toBeVisible();
    await expect(overviewPage.paymentInformation).toBeVisible();
    await expect(overviewPage.shippingInformation).toBeVisible();
    await expect(overviewPage.itemTotal).toHaveText('Item total: $29.99');
    await expect(overviewPage.tax).toHaveText('Tax: $2.40');
    await expect(overviewPage.total).toHaveText('Total: $32.39');

    // 5. Finish the purchase and verify the confirmation and cleared cart.
    await overviewPage.finishButton.click();
    await expect(completePage.heading).toBeVisible();
    await expect(completePage.confirmationMessage).toBeVisible();
    await expect(completePage.cartButton).toHaveAccessibleName('Cart, empty');

    // 6. Return to the catalog from the completed order.
    await completePage.backHomeButton.click();
    await expect(inventoryPage.productsHeading).toBeVisible();
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  });
});
