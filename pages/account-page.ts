import { Locator, Page } from '@playwright/test';

export interface AccountCredentials {
  email: string;
  password: string;
}

// Page Object for registration and login forms.
export class AccountPage {
  readonly page: Page;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly email: Locator;
  readonly password: Locator;
  readonly confirmPassword: Locator;
  readonly registerButton: Locator;
  readonly loginButton: Locator;
  readonly rememberMe: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstName = page.getByRole('textbox', { name: 'First name:', exact: true });
    this.lastName = page.getByRole('textbox', { name: 'Last name:', exact: true });
    this.email = page.getByRole('textbox', { name: 'Email:', exact: true }).first();
    this.password = page.getByRole('textbox', { name: 'Password:', exact: true }).first();
    this.confirmPassword = page.getByRole('textbox', { name: 'Confirm password:', exact: true });
    this.registerButton = page.getByRole('button', { name: 'Register', exact: true });
    this.loginButton = page.getByRole('button', { name: 'Log in', exact: true });
    this.rememberMe = page.getByRole('checkbox', { name: 'Remember me?', exact: true });
  }

  async openRegistration(): Promise<void> {
    await this.page.goto('/register');
  }

  async openLogin(): Promise<void> {
    await this.page.goto('/login');
  }

  // Fill every registration field in one readable business action.
  async register(credentials: AccountCredentials): Promise<void> {
    await this.page.getByRole('radio', { name: 'Male', exact: true }).check();
    await this.firstName.fill('Playwright');
    await this.lastName.fill('Tester');
    await this.email.fill(credentials.email);
    await this.password.fill(credentials.password);
    await this.confirmPassword.fill(credentials.password);
    await this.registerButton.click();
  }

  async login(credentials: AccountCredentials): Promise<void> {
    await this.email.fill(credentials.email);
    await this.password.fill(credentials.password);
    await this.loginButton.click();
  }

}