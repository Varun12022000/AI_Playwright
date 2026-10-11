class ProductDetailsPage {
  constructor(page) {
    this.page = page;
    this.productName = page.getByText('Sauce Labs Backpack', { exact: true });
    this.description = page.getByText(/carry\.allTheThings\(\) with the sleek, streamlined Sly Pack/);
    this.price = page.getByText('$29.99', { exact: true });
    this.addToCartButton = page.getByRole('button', { name: 'Add to cart' });
    this.backToProductsButton = page.getByRole('button', { name: 'Back to products' });
  }
}

module.exports = { ProductDetailsPage };
