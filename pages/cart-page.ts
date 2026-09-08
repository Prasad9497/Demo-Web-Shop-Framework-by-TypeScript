import { Locator, Page } from '@playwright/test';

// Page Object for cart actions. Assertions stay in the spec files.
export class CartPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly productRow: Locator;
  readonly updateButton: Locator;
  readonly continueShoppingButton: Locator;
  readonly termsCheckbox: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Shopping cart', exact: true });
    this.productRow = page.getByRole('row', { name: /14\.1-inch Laptop/ });
    this.updateButton = page.getByRole('button', { name: 'Update shopping cart', exact: true });
    this.continueShoppingButton = page.getByRole('button', { name: 'Continue shopping', exact: true });
    this.termsCheckbox = page.locator('#termsofservice');
    this.checkoutButton = page.getByRole('button', { name: 'Checkout', exact: true });
  }

  async open(): Promise<void> {
    await this.page.goto('/cart');
  }

  // Change the line quantity and ask the site to recalculate totals.
  async updateQuantity(quantity: number): Promise<void> {
    await this.productRow.getByRole('textbox').fill(String(quantity));
    await this.updateButton.click();
  }

  async removeProduct(): Promise<void> {
    await this.productRow.getByRole('checkbox').check();
    await this.updateButton.click();
  }

  async startCheckout(acceptTerms = false): Promise<void> {
    if (acceptTerms) {
      await this.termsCheckbox.check();
    }
    await this.checkoutButton.click();
  }
}