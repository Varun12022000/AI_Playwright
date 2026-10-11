const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./pages/LoginPage');
const { InventoryPage } = require('./pages/InventoryPage');
const { ProductDetailsPage } = require('./pages/ProductDetailsPage');

const productNames = [
  'Sauce Labs Backpack',
  'Sauce Labs Bike Light',
  'Sauce Labs Bolt T-Shirt',
  'Sauce Labs Fleece Jacket',
  'Sauce Labs Onesie',
  'Test.allTheThings() T-Shirt (Red)',
];

test.describe('Core storefront user journeys', () => {
  test('Browse, sort, and inspect catalog products', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const productDetailsPage = new ProductDetailsPage(page);

    // 1. Sign in and verify that the six demo products are listed.
    await loginPage.goto();
    await loginPage.signIn('standard_user', 'secret_sauce');
    await expect(inventoryPage.productsHeading).toBeVisible();
    await expect(inventoryPage.productTitles).toHaveText(productNames);

    // 2. Check the default name order and sort names in descending order.
    await expect(inventoryPage.productTitles).toHaveText(productNames);
    await inventoryPage.sortProducts('za');
    await expect(inventoryPage.productTitles).toHaveText([...productNames].reverse());

    // 3. Sort products by ascending and then descending price.
    await inventoryPage.sortProducts('lohi');
    await expect(inventoryPage.productTitles).toHaveText([
      'Sauce Labs Onesie',
      'Sauce Labs Bike Light',
      'Sauce Labs Bolt T-Shirt',
      'Test.allTheThings() T-Shirt (Red)',
      'Sauce Labs Backpack',
      'Sauce Labs Fleece Jacket',
    ]);
    await inventoryPage.sortProducts('hilo');
    await expect(inventoryPage.productTitles).toHaveText([
      'Sauce Labs Fleece Jacket',
      'Sauce Labs Backpack',
      'Sauce Labs Bolt T-Shirt',
      'Test.allTheThings() T-Shirt (Red)',
      'Sauce Labs Bike Light',
      'Sauce Labs Onesie',
    ]);

    // 4. Open Backpack details and verify its information and actions.
    await inventoryPage.openProduct('Sauce Labs Backpack');
    await expect(page).toHaveURL(/\/inventory-item\.html\?id=4$/);
    await expect(productDetailsPage.backToProductsButton).toBeVisible();
    await expect(productDetailsPage.productName).toBeVisible();
    await expect(productDetailsPage.description).toContainText('sleek, streamlined Sly Pack');
    await expect(productDetailsPage.price).toHaveText('$29.99');
    await expect(productDetailsPage.addToCartButton).toBeVisible();
    await expect(productDetailsPage.backToProductsButton).toBeVisible();

    // 5. Return to the catalog and verify it is available again.
    await productDetailsPage.backToProductsButton.click();
    await expect(inventoryPage.productsHeading).toBeVisible();
    await expect(inventoryPage.productTitles).toHaveCount(6);
  });
});
