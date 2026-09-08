import { Locator, Page } from '@playwright/test';

// Page Object for the product details page.
export class ProductPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly quantity: Locator;
  readonly addToCartButton: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: '14.1-inch Laptop', exact: true });
    this.quantity = page.getByRole('textbox', { name: 'Qty:', exact: true });
    this.addToCartButton = page.getByRole('button', { name: 'Add to cart', exact: true }).first();
    this.cartLink = page.getByRole('link', { name: /Shopping cart \(\d+\)/ });
  }

  async open(): Promise<void> {
    await this.page.goto('/141-inch-laptop');
  }

  // The cart counter changes after the site's add-to-cart request finishes.
  async addToCart(quantity = 1): Promise<void> {
    await this.quantity.fill(String(quantity));
    await this.addToCartButton.click();
    await this.cartLink.filter({ hasText: `(${quantity})` }).waitFor();
  }
}