import { test as base } from '@playwright/test';
import { AccountPage } from '../pages/account-page';
import { CartPage } from '../pages/cart-page';
import { CheckoutPage } from '../pages/checkout-page';
import { ProductPage } from '../pages/product-page';
import { StorePage } from '../pages/store-page';

type PageObjects = {
  store: StorePage;
  product: ProductPage;
  cart: CartPage;
  account: AccountPage;
  checkout: CheckoutPage;
};

// This fixture creates one reusable page object for each application page.
// Tests receive these objects as parameters instead of constructing them repeatedly.
export const test = base.extend<PageObjects>({
  store: async ({ page }, use) => use(new StorePage(page)),
  product: async ({ page }, use) => use(new ProductPage(page)),
  cart: async ({ page }, use) => use(new CartPage(page)),
  account: async ({ page }, use) => use(new AccountPage(page)),
  checkout: async ({ page }, use) => use(new CheckoutPage(page)),
});

export { expect } from '@playwright/test';