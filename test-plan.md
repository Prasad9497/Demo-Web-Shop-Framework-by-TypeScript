# Demo Web Shop UI Test Plan

Target: https://demowebshop.tricentis.com/

## Scope

This plan covers five core end-user operations observed in the live application:

1. Search and browse the catalog
2. View a product and add it to the cart
3. Review and update the shopping cart
4. Register and sign in
5. Start checkout

## Preconditions and test data

- Use a fresh browser context for each test unless the case explicitly requires a prior cart or authenticated session.
- Use `laptop` as a known search term; the observed result was `14.1-inch Laptop`.
- Use a unique email address for registration.
- Use a valid registered account for authenticated checkout cases.
- Do not depend on the cart state left by another test.

## Test cases

### TC-01 - Search and browse products

Priority: P0

Steps:

1. Open the home page.
2. Enter `laptop` in the `Search store` field and submit.
3. Select the `14.1-inch Laptop` result.

Expected results:

- The search navigates to `/search?q=laptop` and displays the `Search` heading.
- A matching `14.1-inch Laptop` result is available.
- Selecting the result opens `/141-inch-laptop`.
- The product page shows the product details, quantity field, and `Add to cart` action.

Negative checks:

- Submit an unknown term and verify that no misleading product result is shown.
- Submit an empty search and verify the application remains usable and gives an appropriate result or validation response.

### TC-02 - View product and add it to the cart

Priority: P0

Steps:

1. Open the `14.1-inch Laptop` product page.
2. Verify the `Qty:` field defaults to `1`.
3. Click `Add to cart`.

Expected results:

- The product remains available for inspection.
- The header changes from `Shopping cart (0)` to `Shopping cart (1)`.
- The cart count reflects the quantity added.

Additional checks:

- Add a quantity greater than one and verify the cart count and line total.
- Verify the product can be added from a clean cart without duplicate or stale entries.

### TC-03 - Review and update the shopping cart

Priority: P0

Steps:

1. Open `Shopping cart (1)` after TC-02 setup.
2. Verify the line contains `14.1-inch Laptop`, price `1590.00`, quantity `1`, and total `1590.00`.
3. Change the quantity and select `Update shopping cart`.
4. Verify the recalculated total.
5. Remove the product and verify the empty-cart state.

Expected results:

- The cart page has a `Shopping cart` heading and a product table.
- `Update shopping cart` recalculates quantity and totals correctly.
- Product removal updates the header count and leaves the cart empty.
- `Continue shopping` returns the user to catalog shopping.

### TC-04 - Register and sign in

Priority: P0

Registration steps:

1. Select `Register`.
2. Provide gender, first name, last name, unique email, password, and confirm password.
3. Select `Register`.

Registration expected results:

- The form exposes `First name:`, `Last name:`, `Email:`, `Password:`, and `Confirm password:` fields.
- A successful registration shows the site success state and an authenticated account navigation.

Login steps:

1. Sign out or start a clean context.
2. Select `Log in`.
3. Enter the registered email and password.
4. Optionally select `Remember me?`, then select `Log in`.

Login expected results:

- The login form exposes `Email:`, `Password:`, `Remember me?`, and `Forgot password?`.
- Valid credentials authenticate the user and replace the anonymous account links with the signed-in state.
- Invalid credentials show a clear validation error and do not authenticate the user.
- Password confirmation mismatch and missing required registration fields are rejected.

### TC-05 - Start checkout and enforce terms acceptance

Priority: P0

Precondition: The cart contains at least one product.

Steps:

1. Open the cart.
2. Select `Checkout` without accepting the terms of service.
3. Verify the `Terms of service` dialog appears.
4. Close the dialog, select the terms checkbox, and select `Checkout` again.
5. Continue as an authenticated customer or use the available guest-checkout path.

Expected results:

- Checkout cannot proceed until the terms checkbox is accepted.
- The warning dialog is titled `Terms of service` and explains that acceptance is required.
- After acceptance, checkout navigates to the login/checkout entry route (`/login/checkoutasguest?returnUrl=%2Fcart`) when the user is anonymous.
- An authenticated flow proceeds to address, shipping, payment, order review, and order confirmation.
- The final confirmation displays an order-success state and the order is visible in the customer order history.

## Locator evidence from exploration

- Header links: `Register`, `Log in`, `Shopping cart (n)`, `Wishlist (n)`.
- Search controls: textbox `Search store`, button `Search`.
- Catalog links: `Books`, `Computers`, `Electronics`, `Apparel & Shoes`, `Digital downloads`, `Jewelry`, `Gift Cards`.
- Product controls: textbox `Qty:`, button `Add to cart`.
- Cart controls: `Update shopping cart`, `Continue shopping`, `Checkout`.
- Terms control: checkbox followed by `I agree with the terms of service and I adhere to them unconditionally (read)`.

## Execution order and exit criteria

Run TC-01 through TC-03 with isolated cart state, then TC-04 with a unique account, and TC-05 with both anonymous and authenticated variants. The core suite passes when all P0 cases meet their expected navigation, visible state, totals, validation, and checkout-gating assertions without hardcoded waits.


Available commands:
npm run test:dev
npm run test:stg
npm run test:prod
npm run report:allure
npm run report:allure:open

https://demowebshop.tricentis.com

npm run test:stg -- --headed --workers=1