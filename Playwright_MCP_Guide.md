# Playwright MCP Guide

## 1. What is Playwright MCP?

Playwright MCP (Model Context Protocol) allows an AI assistant to interact with web applications through Playwright.

Instead of only generating Playwright code, an AI agent can use browser automation capabilities to:

- Open web pages
- Navigate between pages
- Inspect page content
- Identify elements
- Click buttons and links
- Fill forms
- Select dropdown values
- Handle tabs/windows
- Take screenshots
- Inspect accessibility information
- Debug UI behavior
- Build or improve Playwright tests

### Playwright vs Playwright MCP

| Playwright | Playwright MCP |
|---|---|
| Browser automation library | MCP server exposing browser automation to AI |
| You write the automation code | AI can interact with the browser through MCP tools |
| Good for automated test suites | Good for AI-assisted exploration, debugging and test creation |
| Uses JavaScript/TypeScript/Python/.NET | Commonly used by AI clients such as coding assistants |
| Tests are deterministic when properly written | AI interaction can be exploratory |

Playwright MCP does **not replace Playwright**. It provides an AI-friendly interface to browser automation.

---

# 2. Why use Playwright MCP?

Playwright MCP can be useful during test development.

### Example workflow

You can ask an AI assistant:

> Open my application, go to the login page, inspect the available fields, log in with the test account, and identify the selectors needed for automation.

The MCP server can interact with the browser and provide information back to the AI.

This can reduce manual work when:

- Exploring a new application
- Finding reliable locators
- Understanding page structure
- Debugging failures
- Creating initial test cases
- Reproducing UI issues
- Investigating dynamic elements

---

# 3. Prerequisites

Recommended setup:

- Node.js
- npm
- VS Code or another MCP-compatible AI client
- Playwright
- An MCP-compatible AI assistant
- Your web application/test environment

Check Node and npm:

```bash
node --version
npm --version
```

For an existing Playwright project:

```bash
npx playwright --version
```

---

# 4. Create a Playwright project

If you do not already have a project:

```bash
npm init playwright@latest
```

Typical questions:

```text
Where to put your end-to-end tests?
tests

Add a GitHub Actions workflow?
Yes/No

Install Playwright browsers?
Yes
```

Then run:

```bash
npx playwright test
```

Run headed:

```bash
npx playwright test --headed
```

Open Playwright UI mode:

```bash
npx playwright test --ui
```

---

# 5. Playwright MCP installation

The exact MCP package/configuration can change over time, so use the current official Playwright MCP documentation when installing or configuring the server.

Official Playwright MCP repository:

https://github.com/microsoft/playwright-mcp

Typical setup involves:

1. Installing or invoking the Playwright MCP server.
2. Registering it with your MCP-compatible client.
3. Restarting the client if required.
4. Starting a browser session through the MCP tools.

Do not copy an old configuration blindly. MCP clients and server options can change between versions.

---

# 6. MCP configuration concept

MCP clients generally use a configuration containing:

- A server name
- A command
- Arguments
- Optional environment variables

A conceptual example is:

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "@playwright/mcp@latest"
      ]
    }
  }
}
```

The exact configuration file and location depend on the MCP client you are using.

For example, the configuration may be placed in a client-specific MCP configuration file.

### Important

If the client already provides a Playwright MCP integration, use its recommended setup rather than creating duplicate configurations.

---

# 7. Using Playwright MCP with VS Code

A common workflow is:

```text
VS Code
   |
   v
AI coding assistant
   |
   v
MCP
   |
   v
Playwright MCP Server
   |
   v
Browser
   |
   v
Web Application
```

The AI assistant sends browser actions through MCP.

For example:

```text
User
  ↓
"Open the application and check the login page"
  ↓
AI Assistant
  ↓
Playwright MCP
  ↓
Chromium
  ↓
Application
```

The assistant can then use the browser state to reason about the page.

---

# 8. Example: Exploring a login page

Suppose your application is:

```text
https://example.com/login
```

You could ask your AI assistant:

```text
Open the login page and inspect the username and password fields.
Identify reliable locators for both fields and the Login button.
```

The assistant can inspect the page and determine suitable locators such as:

```javascript
page.getByLabel('Username')
page.getByLabel('Password')
page.getByRole('button', { name: 'Login' })
```

These are generally preferable to fragile selectors.

---

# 9. Locator strategy

Prefer locators based on user-facing semantics.

### Recommended order

1. `getByRole()`
2. `getByLabel()`
3. `getByPlaceholder()`
4. `getByText()`
5. `getByTestId()`
6. CSS selectors
7. XPath when necessary

Example:

```javascript
await page.getByRole('button', { name: 'Login' }).click();
```

Instead of:

```javascript
await page.locator('#btn-login').click();
```

And avoid unnecessarily long XPath:

```javascript
await page.locator(
  '/html/body/div[1]/div[2]/form/div[3]/button'
).click();
```

---

# 10. Using MCP to discover locators

A useful prompt:

```text
Inspect the current page and identify stable Playwright locators
for all important fields and buttons. Prefer role, label, placeholder,
test id, or accessible name over XPath.
```

This is especially useful when working with unfamiliar applications.

---

# 11. Generate a Playwright test

After exploring a workflow, ask the AI:

```text
Create a Playwright JavaScript test for the login workflow.
Use Page Object Model and stable locators.
Do not use hard waits.
```

A generated test may look like:

```javascript
import { test, expect } from '@playwright/test';

test('valid login', async ({ page }) => {
  await page.goto('https://example.com/login');

  await page.getByLabel('Username').fill('testuser');
  await page.getByLabel('Password').fill('password');

  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL(/dashboard/);
});
```

Review generated code before adding it to your production test suite.

---

# 12. MCP with Page Object Model

If your framework uses POM, keep the MCP-generated knowledge separate from your framework architecture.

Example:

```text
tests/
├── login.spec.js
├── checkout.spec.js
└── cart.spec.js

pages/
├── LoginPage.js
├── HomePage.js
├── CartPage.js
└── CheckoutPage.js

utils/
├── testData.js
└── helpers.js

playwright.config.js
package.json
```

Example Page Object:

```javascript
export class LoginPage {
  constructor(page) {
    this.page = page;

    this.username = page.getByLabel('Username');
    this.password = page.getByLabel('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
  }

  async login(username, password) {
    await this.username.fill(username);
    await this.password.fill(password);
    await this.loginButton.click();
  }
}
```

Test:

```javascript
import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test('user login', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await page.goto('https://example.com/login');

  await loginPage.login('testuser', 'password');
});
```

---

# 13. MCP for debugging

MCP can be useful when a test fails.

Example prompt:

```text
The login test is failing after clicking Login.
Inspect the current page and determine why the expected dashboard
is not displayed. Check the URL, visible messages and relevant elements.
```

You can then ask:

```text
Suggest the likely root cause and a Playwright fix.
```

This is useful for investigating:

- Incorrect selectors
- Changed UI
- Unexpected redirects
- Validation messages
- Popups
- Authentication issues
- Timing problems
- Missing elements

---

# 14. Avoid hard waits

Do not rely on:

```javascript
await page.waitForTimeout(5000);
```

Prefer Playwright's built-in waiting and assertions:

```javascript
await expect(page.getByRole('heading', {
  name: 'Dashboard'
})).toBeVisible();
```

Or:

```javascript
await page.waitForURL(/dashboard/);
```

MCP can help identify what the browser is actually waiting for, but your final automation should use proper Playwright synchronization.

---

# 15. Screenshots and debugging

When investigating a failure, screenshots can help:

```javascript
await page.screenshot({
  path: 'screenshots/login-failure.png',
  fullPage: true
});
```

Playwright debugging:

```bash
npx playwright test --debug
```

Run a specific test:

```bash
npx playwright test tests/login.spec.js
```

---

# 16. Browser contexts

Playwright MCP can operate with browser sessions/contexts depending on the MCP server configuration.

A Playwright test normally uses:

```javascript
test('example', async ({ page }) => {
  // test
});
```

The browser context provides isolation between tests.

Conceptually:

```text
Browser
├── Context A
│   ├── Page 1
│   └── Page 2
│
└── Context B
    └── Page 1
```

This is useful for scenarios involving:

- Multiple users
- Authentication
- Separate sessions
- Multi-tab workflows

---

# 17. Multiple tabs

Playwright example:

```javascript
const pagePromise = context.waitForEvent('page');

await page.getByRole('link', {
  name: 'Open New Window'
}).click();

const newPage = await pagePromise;

await newPage.waitForLoadState();
```

You can ask MCP to inspect a workflow that opens:

- New tabs
- New windows
- External pages

Then convert the discovered workflow into normal Playwright code.

---

# 18. Frames

For iframe-based applications:

```javascript
const frame = page.frameLocator('#payment-frame');

await frame.getByLabel('Card Number').fill('4111111111111111');
```

When debugging iframe issues, ask:

```text
Inspect the page and identify whether the payment fields are inside
an iframe. If they are, identify the iframe locator and the field locators.
```

---

# 19. API testing with Playwright

Playwright also supports API testing.

Example:

```javascript
const response = await request.get('/api/users');

expect(response.ok()).toBeTruthy();

const body = await response.json();

console.log(body);
```

MCP is primarily useful for browser interaction, while Playwright's APIRequestContext is useful for API testing.

You can combine both:

```text
API setup
   ↓
Create test data
   ↓
Browser UI
   ↓
Perform workflow
   ↓
Validate UI
   ↓
API cleanup
```

---

# 20. E-commerce example

For an e-commerce application, your workflow could be:

```text
Login
  ↓
Product Search
  ↓
Product Details
  ↓
Add to Cart
  ↓
Wishlist
  ↓
Checkout
  ↓
Payment
  ↓
Order Confirmation
  ↓
Order History
```

You can use MCP during exploration:

```text
Explore the complete shopping workflow.
Identify reliable locators and important validation points.
```

Then implement the final automation using your existing POM framework.

---

# 21. MCP and existing Playwright framework

If you already have a Playwright framework, do not rebuild the framework just because MCP is available.

Use MCP as an assistant for:

### Exploration

```text
Find the login button.
```

### Locator discovery

```text
Find the most stable locator for the checkout button.
```

### Debugging

```text
Why is this element not visible?
```

### Test creation

```text
Generate a test for this workflow using my existing POM structure.
```

### Maintenance

```text
The selector for the checkout button changed.
Inspect the current page and suggest the replacement locator.
```

---

# 22. MCP vs Playwright Codegen

Playwright Codegen can generate automation based on browser interactions.

Example:

```bash
npx playwright codegen https://example.com
```

MCP goes further by allowing an AI assistant to reason about browser state and combine browser interaction with natural-language instructions and coding tasks.

### Codegen

Best for:

- Quickly recording interactions
- Generating initial locators
- Getting a starting test

### MCP

Best for:

- AI-assisted exploration
- Debugging
- Locator investigation
- Understanding workflows
- Combining browser interaction with coding assistance

Neither should be treated as a replacement for good test design.

---

# 23. MCP vs normal Playwright automation

A simple way to explain it in an interview:

> Playwright is the automation framework I use to write and execute browser tests. Playwright MCP exposes Playwright browser capabilities through the Model Context Protocol, allowing an AI assistant to interact with the application, inspect elements, explore workflows, and assist with test creation and debugging. I would use MCP as an AI-assisted development and troubleshooting layer, while keeping the actual regression suite maintainable and deterministic in Playwright.

---

# 24. Important security considerations

Do not expose sensitive information unnecessarily.

Avoid giving an AI tool access to:

- Production credentials
- Real customer information
- Payment-card information
- Private tokens
- API secrets
- SSH keys
- Environment secrets

Use dedicated test accounts and test environments.

For example:

```text
Development/Test Environment
        ↓
Test Account
        ↓
Playwright MCP
        ↓
Browser
```

Avoid:

```text
Production Environment
        ↓
Real Customer Account
        ↓
AI Browser Automation
```

unless your organization's security policies explicitly allow it.

---

# 25. Best practices

### 1. Use stable locators

Prefer:

```javascript
page.getByRole()
page.getByLabel()
page.getByTestId()
```

### 2. Avoid hard waits

Avoid:

```javascript
page.waitForTimeout()
```

when a proper condition can be used.

### 3. Keep POM clean

Do not put random generated code directly into page objects without review.

### 4. Review AI-generated tests

AI-generated automation can contain:

- Incorrect assumptions
- Fragile selectors
- Redundant steps
- Incorrect assertions
- Unnecessary waits

### 5. Use test data safely

Use dedicated test data.

### 6. Keep MCP permissions limited

Give browser automation only the access it needs.

### 7. Keep the regression suite deterministic

MCP is excellent for exploration and assistance, but your final regression tests should be predictable and repeatable.

---

# 26. Useful prompts

## Page exploration

```text
Open the application and explore the login workflow.
Identify all important fields, buttons and validation messages.
```

## Locator discovery

```text
Inspect this page and suggest the most stable Playwright locators.
Prefer role, label and test id. Avoid XPath unless necessary.
```

## Test creation

```text
Create a Playwright JavaScript test for this workflow using Page Object Model.
```

## Debugging

```text
Inspect the current page and explain why the expected element is not visible.
```

## Regression test

```text
Explore the checkout workflow and identify the important assertions
that should be included in a regression test.
```

## Existing framework

```text
Review my existing Playwright framework structure.
Add this new test using the existing Page Object Model and coding style.
Do not create duplicate utilities.
```

## Selector maintenance

```text
The existing selector no longer works.
Inspect the current DOM and suggest a stable replacement.
```

---

# 27. Troubleshooting

## MCP server does not start

Check:

```bash
node --version
npm --version
```

Then verify that the MCP package/command is installed or available through `npx`.

Also check the MCP client's logs.

---

## Browser does not launch

Check:

```bash
npx playwright install
```

If using a restricted corporate environment, check:

- Proxy settings
- Firewall
- Browser installation
- Node.js permissions
- Corporate security policies

---

## Locator cannot be found

Ask the assistant to inspect the current page:

```text
Inspect the current page and determine why this locator
does not match an element.
```

Then verify the locator manually.

---

## Authentication problems

Check:

- Correct test account
- Environment URL
- Cookies
- Storage state
- Authentication redirects
- MFA requirements

Never paste production credentials into an AI conversation.

---

## Configuration problems

MCP client configuration varies by client and version.

Check the current official documentation for the exact configuration syntax.

Official repository:

https://github.com/microsoft/playwright-mcp

---

# 28. Recommended workflow for your Playwright project

If you already have a Playwright + JavaScript + POM framework, a practical workflow is:

```text
1. Start your application
          ↓
2. Start/connect Playwright MCP
          ↓
3. Ask AI to explore the workflow
          ↓
4. Inspect locators
          ↓
5. Identify test scenarios
          ↓
6. Generate/update Playwright code
          ↓
7. Put locators/methods into POM
          ↓
8. Add assertions
          ↓
9. Run Playwright tests
          ↓
10. Debug failures with MCP
          ↓
11. Commit reviewed code to Git
          ↓
12. Execute regression in CI/CD
```

---

# 29. CI/CD recommendation

For Jenkins or another CI/CD system:

```text
Developer
   ↓
Git
   ↓
Pull Request
   ↓
Jenkins
   ↓
npm install
   ↓
Playwright install/dependencies
   ↓
Playwright Tests
   ↓
Allure Report
   ↓
Test Result
```

MCP does not need to be part of every CI regression execution.

A good approach is to use MCP mainly during:

- Test development
- Exploration
- Debugging
- Maintenance

and keep CI execution based on your normal Playwright test suite.

---

# 30. Interview questions

### Q1. What is Playwright MCP?

**Answer:**

Playwright MCP is an MCP server that exposes Playwright browser automation capabilities to AI assistants. It allows the AI to interact with web applications, inspect pages, identify elements and assist with test development and debugging.

### Q2. Does Playwright MCP replace Playwright?

**Answer:**

No. Playwright MCP uses Playwright capabilities. I would consider it an AI-assisted layer around browser automation rather than a replacement for the Playwright test framework.

### Q3. How would you use MCP in your project?

**Answer:**

I would use it mainly during application exploration, locator identification, debugging and initial test creation. After that, I would integrate the reviewed code into our existing Playwright framework using Page Object Model, reusable utilities and proper assertions.

### Q4. Can MCP automatically create production-ready tests?

**Answer:**

It can assist in creating tests, but I would not blindly commit generated tests. I would review locators, assertions, synchronization, test data and framework conventions before adding them to the regression suite.

### Q5. What is the benefit of MCP?

**Answer:**

The main benefit is faster AI-assisted browser exploration and troubleshooting. Instead of only asking an AI to guess the DOM or selectors, the AI can interact with the browser through Playwright MCP and use the observed application state to assist with the task.

---

# 31. Final recommendation

For an existing Playwright automation engineer, the best approach is:

```text
Playwright
    +
Page Object Model
    +
JavaScript/TypeScript
    +
API testing
    +
Git
    +
Jenkins
    +
Allure
    +
Playwright MCP
```

Treat MCP as a productivity tool rather than a replacement for your automation framework.

The strongest practical use cases are:

1. Application exploration
2. Locator discovery
3. Debugging
4. Test-case generation
5. Test maintenance
6. Understanding unfamiliar applications
7. AI-assisted framework development

Always review generated automation before using it in a production regression suite.

---

## Official Resources

Playwright MCP repository:

https://github.com/microsoft/playwright-mcp

Playwright documentation:

https://playwright.dev/

Model Context Protocol:

https://modelcontextprotocol.io/

---

## Quick Cheat Sheet

```text
Playwright
→ Browser automation framework

MCP
→ Standard protocol for connecting AI assistants to tools

Playwright MCP
→ Playwright browser automation exposed through MCP

Best use
→ AI-assisted exploration, locator discovery, debugging and test development

Not recommended
→ Blindly committing AI-generated tests

Final automation
→ Keep it maintainable, deterministic and integrated with your existing POM framework
```
