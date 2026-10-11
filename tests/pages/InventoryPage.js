class InventoryPage {
  constructor(page) {
    this.page = page;
    this.productsHeading = page.getByText('Products', { exact: true });
    this.sortControl = page.getByRole('combobox', { name: 'Sort products' });
    this.productTitles = page.locator('.inventory_item_name');
    this.cartButton = page.getByRole('button', { name: /^Cart/ });
    this.aboutLink = page.getByRole('link', { name: 'About' });
    this.logoutButton = page.getByRole('button', { name: 'Logout' });
  }

  async sortProducts(optionValue) {
    await this.sortControl.selectOption(optionValue);
  }

  async openProduct(name) {
    const product = this.page.locator('.inventory_item').filter({ hasText: name });
    await product.getByRole('button', { name: `View details for ${name}` }).last().click();
    await this.page.waitForURL(/\/inventory-item\.html(?:\?|$)/);
  }

  productAction(name, actionName) {
    const product = this.page.locator('.inventory_item').filter({ hasText: name });
    return product.getByRole('button', { name: actionName });
  }

  menuButton(name) {
    return this.page.getByRole('button', { name, exact: true });
  }

  async addProductToCart(name) {
    await this.productAction(name, 'Add to cart').click();
  }

  async removeProductFromCart(name) {
    await this.productAction(name, 'Remove').click();
  }

  async openCart() {
    await this.cartButton.click();
  }

  async openMenu() {
    await this.page.getByRole('button', { name: 'Open Menu' }).click();
  }

  async logout() {
    await this.logoutButton.click();
  }
}

module.exports = { InventoryPage };
