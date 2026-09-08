import { Locator, Page } from '@playwright/test';

// Page Object for the shared store header and search area.
export class StorePage {
  readonly page: Page;
  readonly searchBox: Locator;
  readonly searchButton: Locator;
  readonly cartLink: Locator;
  readonly registerLink: Locator;
  readonly loginLink: Locator;
  readonly productSearchResult: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchBox = page.locator('#small-searchterms');
    this.searchButton = page.getByRole('button', { name: 'Search', exact: true });
    this.cartLink = page.getByRole('link', { name: /Shopping cart \(\d+\)/ });
    this.registerLink = page.getByRole('link', { name: 'Register', exact: true });
    this.loginLink = page.getByRole('link', { name: 'Log in', exact: true });
    this.productSearchResult = page.getByRole('link', { name: '14.1-inch Laptop', exact: true });
  }

  async open(): Promise<void> {
    await this.page.goto('/');
  }

  // Reusable user action: search from the store header.
  async search(term: string): Promise<void> {
    await this.searchBox.fill(term);
    await this.searchButton.click();
  }

}