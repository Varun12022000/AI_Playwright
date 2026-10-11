const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/LoginPage');
const { InventoryPage } = require('./pages/InventoryPage');
const { CartPage } = require('./pages/CartPage');
const { CheckoutInformationPage } = require('./pages/CheckoutInformationPage');

test.describe('Core storefront user journeys', () => {
  test('Add, review, and remove products in the cart', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutInformationPage = new CheckoutInformationPage(page);

    // 1. Sign in and confirm the cart starts empty.
    await loginPage.goto();
    await loginPage.signIn('standard_user', 'secret_sauce');
    await expect(inventoryPage.productsHeading).toBeVisible();
    await expect(inventoryPage.cartButton).toHaveAccessibleName('Cart, empty');

    // 2. Add Backpack and Bike Light and check the cart count.
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.addProductToCart('Sauce Labs Bike Light');
    await expect(inventoryPage.productAction('Sauce Labs Backpack', 'Remove')).toBeVisible();
    await expect(inventoryPage.productAction('Sauce Labs Bike Light', 'Remove')).toBeVisible();
    await expect(inventoryPage.cartButton).toHaveAccessibleName('Cart, 2 items');

    // 3. Review the cart items, quantities, prices, and available actions.
    await inventoryPage.openCart();
    await expect(cartPage.cartHeading).toBeVisible();
    await expect(cartPage.items).toHaveCount(2);
    await expect(cartPage.product('Sauce Labs Backpack')).toBeVisible();
    await expect(cartPage.quantity('Sauce Labs Backpack')).toHaveText('1');
    await expect(cartPage.price('Sauce Labs Backpack')).toHaveText('$29.99');
    await expect(cartPage.product('Sauce Labs Bike Light')).toBeVisible();
    await expect(cartPage.quantity('Sauce Labs Bike Light')).toHaveText('1');
    await expect(cartPage.price('Sauce Labs Bike Light')).toHaveText('$9.99');
    await expect(cartPage.continueShoppingButton).toBeVisible();
    await expect(cartPage.checkoutButton).toBeVisible();

    // 4. Remove Bike Light and verify Backpack remains in the cart.
    await cartPage.removeProduct('Sauce Labs Bike Light');
    await expect(cartPage.items).toHaveCount(1);
    await expect(cartPage.product('Sauce Labs Backpack')).toBeVisible();
    await expect(cartPage.product('Sauce Labs Bike Light')).toHaveCount(0);
    await expect(cartPage.cartButton).toHaveAccessibleName('Cart, 1 items');

    // 5. Return to the catalog and remove the remaining Backpack.
    await cartPage.continueShoppingButton.click();
    await inventoryPage.removeProductFromCart('Sauce Labs Backpack');
    await expect(inventoryPage.productAction('Sauce Labs Backpack', 'Add to cart')).toBeVisible();
    await expect(inventoryPage.cartButton).toHaveAccessibleName('Cart, empty');

    // 6. Confirm the cart is empty and record the observed empty-cart checkout behavior.
    await inventoryPage.openCart();
    await expect(cartPage.items).toHaveCount(0);
    await expect(cartPage.checkoutButton).toBeVisible();
    await cartPage.checkoutButton.click();
    await expect(checkoutInformationPage.heading).toBeVisible();
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-one.html');
  });
});
