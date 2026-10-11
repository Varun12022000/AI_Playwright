class CheckoutOverviewPage {
  constructor(page) {
    this.page = page;
    this.heading = page.getByText('Checkout: Overview', { exact: true });
    this.backpack = page.getByText('Sauce Labs Backpack', { exact: true });
    this.paymentInformation = page.getByText('SauceCard #31337', { exact: true });
    this.shippingInformation = page.getByText('Free Pony Express Delivery!', { exact: true });
    this.itemTotal = page.getByText('Item total: $29.99', { exact: true });
    this.tax = page.getByText('Tax: $2.40', { exact: true });
    this.total = page.getByText('Total: $32.39', { exact: true });
    this.finishButton = page.getByRole('button', { name: 'Finish' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
  }
}

module.exports = { CheckoutOverviewPage };
