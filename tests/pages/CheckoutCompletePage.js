class CheckoutCompletePage {
  constructor(page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Thank you for your order!' });
    this.confirmationMessage = page.getByText('Your order has been dispatched, and will arrive just as fast as the pony can get there!', { exact: true });
    this.backHomeButton = page.getByRole('button', { name: 'Back Home' });
    this.cartButton = page.getByRole('button', { name: /^Cart/ });
  }
}

module.exports = { CheckoutCompletePage };
