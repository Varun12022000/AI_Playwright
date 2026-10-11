class CartPage {
  constructor(page) {
    this.page = page;
    this.cartHeading = page.getByText('Your Cart', { exact: true });
    this.items = page.locator('.cart_item');
    this.cartButton = page.getByRole('button', { name: /^Cart/ });
    this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' });
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
  }

  product(name) {
    return this.page.getByText(name, { exact: true });
  }

  quantity(name) {
    return this.items.filter({ hasText: name }).locator('.cart_quantity');
  }

  price(name) {
    return this.items.filter({ hasText: name }).locator('.inventory_item_price');
  }

  async removeProduct(name) {
    const item = this.items.filter({ hasText: name });
    await item.getByRole('button', { name: 'Remove' }).click();
  }
}

module.exports = { CartPage };
