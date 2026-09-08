import { AccountCredentials } from '../pages/account-page';
import { products } from '../test-data/products';
import { expect, test } from '../fixtures/test-fixtures';

// The fixture creates page objects. Tests contain only business steps and assertions.
test.describe('Demo Web Shop core user operations', () => {
  const createCredentials = (): AccountCredentials => ({
    email: `playwright-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`,
    password: 'Playwright!123',
  });
  test('TC-01 searches and browses to a product', async ({ page, store, product }) => {
    await store.open();
    await store.search('laptop');
    await expect(page).toHaveURL(/\/search\?q=laptop$/);
    await expect(page.getByRole('heading', { name: 'Search', exact: true })).toBeVisible();
    await store.productSearchResult.click();
    await expect(page).toHaveURL(/\/141-inch-laptop$/);
    await expect(product.heading).toHaveText(products.laptop.name);
    await expect(product.quantity).toHaveValue('1');
    await expect(product.addToCartButton).toBeVisible();
  });

  test('TC-01 rejects an unknown search without showing a misleading product', async ({ page, store }) => {
    await store.open();
    await store.search(`no-such-product-${Date.now()}`);
    await expect(page).toHaveURL(/\/search\?q=no-such-product-/);
    await expect(page.getByRole('link', { name: '14.1-inch Laptop', exact: true })).toHaveCount(0);

    await store.open();
    await store.search('');
    await expect(page).toHaveURL(/\/$/);
    await expect(store.searchBox).toBeVisible();
  });

  test('TC-02 adds a selected quantity to the cart', async ({ page, product, cart }) => {
    await product.open();
    await expect(product.quantity).toHaveValue('1');
    await product.addToCart(2);
    await expect(product.cartLink).toHaveText('Shopping cart (2)');
    await cart.open();
    await expect(cart.productRow.getByRole('textbox')).toHaveValue('2');
    await expect(cart.productRow).toContainText('3180.00');
  });

  test('TC-03 updates and removes a cart item', async ({ page, product, cart }) => {
    await product.open();
    await product.addToCart();
    await cart.open();
    await expect(cart.heading).toBeVisible();
    await expect(cart.productRow.getByRole('textbox')).toHaveValue('1');
    await expect(cart.productRow).toContainText('1590.00');
    await cart.updateQuantity(2);
    await expect(cart.productRow.getByRole('textbox')).toHaveValue('2');
    await expect(cart.productRow).toContainText('3180.00');
    await cart.removeProduct();
    await expect(page.getByRole('link', { name: 'Shopping cart (0)', exact: true })).toBeVisible();
    await expect(cart.productRow).toHaveCount(0);
  });

  test('TC-03 continues shopping from the cart', async ({ page, product, cart }) => {
    await product.open();
    await product.addToCart();
    await cart.open();
    await cart.continueShoppingButton.click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole('link', { name: 'Books', exact: true }).first()).toBeVisible();
  });

  test('TC-04 registers a new customer and signs in', async ({ page, account }) => {
    const credentials: AccountCredentials = {
      email: `playwright-${Date.now()}@example.com`,
      password: 'Playwright!123',
    };

    await account.openRegistration();
    await account.register(credentials);
    await expect(page.getByText('Your registration completed', { exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Log out', exact: true })).toBeVisible();

    await page.getByRole('link', { name: 'Log out', exact: true }).click();
    await account.openLogin();
    await expect(account.rememberMe).toBeVisible();
    await account.login(credentials);
    await expect(page.getByRole('link', { name: 'Log out', exact: true })).toBeVisible();
  });

  test('TC-04 validates invalid login credentials', async ({ page, account }) => {
    await account.openLogin();
    await account.login({ email: `unknown-${Date.now()}@example.com`, password: 'Wrong!123' });
    await expect(page.getByText('Login was unsuccessful', { exact: false })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Log out', exact: true })).toHaveCount(0);
  });

  test('TC-04 validates password confirmation and required registration fields', async ({ page, account }) => {
    await account.openRegistration();
    await account.password.fill('Playwright!123');
    await account.confirmPassword.fill('Different!123');
    await account.registerButton.click();
    await expect(page.getByText('The password and confirmation password do not match.', { exact: true })).toBeVisible();
    await expect(page.getByText('First name is required.', { exact: true })).toBeVisible();
    await expect(page.getByText('Last name is required.', { exact: true })).toBeVisible();
    await expect(page.getByText('Email is required.', { exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Register', exact: true })).toBeVisible();
  });

  test('TC-05 blocks checkout until terms are accepted and exposes guest checkout', async ({ page, product, cart, checkout }) => {
    await product.open();
    await product.addToCart();
    await cart.open();
    await cart.startCheckout();
    const termsDialog = page.getByRole('dialog', { name: 'Terms of service' });
    await expect(termsDialog).toBeVisible();
    await expect(termsDialog).toContainText('Please accept the terms of service before the next step.');
    await termsDialog.getByRole('button', { name: 'close', exact: true }).click();
    await cart.startCheckout(true);
    await expect(page).toHaveURL(/\/login\/checkoutasguest\?returnUrl=%2Fcart$/);
    await expect(page.getByText('Checkout as a guest or register', { exact: true })).toBeVisible();
    await expect(checkout.guestCheckoutButton).toBeVisible();
    await expect(checkout.registerButton).toBeVisible();
  });

  test('TC-05 enters guest checkout and exposes all order stages', async ({ page, product, cart, checkout }) => {
    await product.open();
    await product.addToCart();
    await cart.open();
    await cart.termsCheckbox.check();
    await cart.checkoutButton.click();
    await checkout.guestCheckoutButton.click();
    await expect(page).toHaveURL(/\/onepagecheckout$/);
    await expect(checkout.checkoutHeading).toBeVisible();
    for (const stage of ['Billing address', 'Shipping address', 'Shipping method', 'Payment method', 'Payment information', 'Confirm order']) {
      await expect(page.getByRole('heading', { name: stage, exact: true })).toBeVisible();
    }
  });

  test('TC-05 allows an authenticated customer to enter checkout', async ({ page, account, product, cart, checkout }) => {
    const user = createCredentials();

    await account.openRegistration();
    await account.register(user);
    await expect(page.getByRole('link', { name: 'Log out', exact: true })).toBeVisible();
    await product.open();
    await product.addToCart();
    await cart.open();
    await cart.termsCheckbox.check();
    await cart.checkoutButton.click();
    await expect(page).toHaveURL(/\/onepagecheckout$/);
    await expect(checkout.checkoutHeading).toBeVisible();
    await expect(checkout.billingFirstName).toBeVisible();
    await expect(checkout.billingLastName).toBeVisible();
    await expect(checkout.billingEmail).toBeVisible();
  });
});