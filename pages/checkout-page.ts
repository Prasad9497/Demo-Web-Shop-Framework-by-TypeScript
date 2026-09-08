import { Locator, Page } from '@playwright/test';
import { AccountCredentials } from './account-page';

// Page Object for checkout entry and billing controls.
export class CheckoutPage {
  readonly page: Page;
  readonly guestCheckoutButton: Locator;
  readonly registerButton: Locator;
  readonly loginEmail: Locator;
  readonly loginPassword: Locator;
  readonly loginButton: Locator;
  readonly checkoutHeading: Locator;
  readonly billingFirstName: Locator;
  readonly billingLastName: Locator;
  readonly billingEmail: Locator;
  readonly country: Locator;
  readonly state: Locator;
  readonly city: Locator;
  readonly address: Locator;
  readonly postalCode: Locator;
  readonly phone: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.guestCheckoutButton = page.getByRole('button', { name: 'Checkout as Guest', exact: true });
    this.registerButton = page.getByRole('button', { name: 'Register', exact: true });
    this.loginEmail = page.getByRole('textbox', { name: 'Email:', exact: true }).last();
    this.loginPassword = page.getByRole('textbox', { name: 'Password:', exact: true }).last();
    this.loginButton = page.getByRole('button', { name: 'Log in', exact: true });
    this.checkoutHeading = page.getByRole('heading', { name: 'Checkout', exact: true });
    this.billingFirstName = page.getByRole('textbox', { name: 'First name:', exact: true });
    this.billingLastName = page.getByRole('textbox', { name: 'Last name:', exact: true });
    this.billingEmail = page.getByRole('textbox', { name: 'Email:', exact: true });
    this.country = page.getByRole('combobox', { name: 'Country:', exact: true });
    this.state = page.getByRole('combobox', { name: 'State / province:', exact: true });
    this.city = page.getByRole('textbox', { name: 'City:', exact: true });
    this.address = page.getByRole('textbox', { name: 'Address 1:', exact: true });
    this.postalCode = page.getByRole('textbox', { name: 'Zip / postal code:', exact: true });
    this.phone = page.getByRole('textbox', { name: 'Phone number:', exact: true });
    this.continueButton = page.getByRole('button', { name: 'Continue', exact: true }).first();
  }

  async login(credentials: AccountCredentials): Promise<void> {
    await this.loginEmail.fill(credentials.email);
    await this.loginPassword.fill(credentials.password);
    await this.loginButton.click();
  }

  async fillBillingAddress(email: string): Promise<void> {
    await this.billingFirstName.fill('Playwright');
    await this.billingLastName.fill('Tester');
    await this.billingEmail.fill(email);
    await this.country.selectOption({ label: 'United States' });
    await this.state.selectOption({ label: 'California' });
    await this.city.fill('Los Angeles');
    await this.address.fill('123 Test Street');
    await this.postalCode.fill('90001');
    await this.phone.fill('5555555555');
  }

  async continueBilling(): Promise<void> {
    await this.continueButton.click();
  }
}