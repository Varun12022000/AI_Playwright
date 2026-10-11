# Sauce Demo Core User Operations Test Plan

## Application Overview

Based on exploration of https://www.saucedemo.com/, this plan covers five core user operations: signing in, discovering products, managing a cart, completing checkout, and logging out. The storefront presents six products, supports sorting by name and price, provides product detail pages, and uses a two-step checkout flow with required name and postal-code fields. Tests use the documented standard_user / secret_sauce account and should start from a fresh browser session with no existing cart state. No payment-card or shipping-address input is collected; the overview shows a demo SauceCard and free delivery. Each scenario is standalone and includes success checks and relevant negative paths.

## Test Scenarios

### 1. Core storefront user journeys

**Seed:** ``

#### 1.1. Sign in and reject invalid or incomplete credentials

**File:** `tests/saucedemo/sign-in.spec.ts`

**Steps:**
  1. Starting from a fresh browser session, open https://www.saucedemo.com/.
    - expect: The Swag Labs login form shows Username and Password fields and a Login button. The page lists accepted demo usernames and the shared password.
  2. Submit the login form with both fields empty.
    - expect: Sign-in is blocked and a visible validation message identifies the missing username. The user remains on the login page.
  3. Enter an invalid username and a non-empty password, then select Login.
    - expect: Authentication is rejected with a visible error. No inventory page or authenticated controls are displayed.
  4. Enter standard_user and secret_sauce, then select Login.
    - expect: The user is taken to the Products inventory page. The catalog and shopping-cart control are visible.

#### 1.2. Browse, sort, and inspect catalog products

**File:** `tests/saucedemo/product-discovery.spec.ts`

**Steps:**
  1. Starting with a fresh session, sign in using standard_user / secret_sauce.
    - expect: The Products page displays the six demo products, each with a name, description, price, and Add to cart action.
  2. Check the default product ordering, then choose Name (Z to A) from Sort products.
    - expect: The products are ordered in descending alphabetical name order.
  3. Choose Price (low to high), then Price (high to low).
    - expect: The catalog reorders in ascending and then descending price order; the displayed prices remain associated with the correct products.
  4. Select the Sauce Labs Backpack name or image to open its product detail page.
    - expect: The product detail page shows Sauce Labs Backpack, its description and $29.99 price, with Add to cart and Back to products actions.
  5. Select Back to products.
    - expect: The Products catalog is displayed again and remains usable.

#### 1.3. Add, review, and remove products in the cart

**File:** `tests/saucedemo/cart-management.spec.ts`

**Steps:**
  1. Starting with a fresh session, sign in using standard_user / secret_sauce and open the Products page.
    - expect: The cart is empty and the catalog is available.
  2. Add Sauce Labs Backpack ($29.99) and Sauce Labs Bike Light ($9.99) to the cart.
    - expect: Each product's Add to cart action changes to Remove, and the cart badge reflects two items.
  3. Open the cart.
    - expect: Your Cart shows both selected products, quantity 1 for each, and their matching descriptions and prices. Continue Shopping and Checkout are available.
  4. Remove Sauce Labs Bike Light.
    - expect: The Bike Light is no longer listed, the badge changes to one item, and Sauce Labs Backpack remains.
  5. Select Continue Shopping, then remove Sauce Labs Backpack from its catalog card.
    - expect: The Products page is displayed, Backpack's action changes to Remove and then back to Add to cart, and the cart badge becomes empty.
  6. Open the cart after removing the final product.
    - expect: The cart contains no product rows, and Checkout does not allow progression with an empty cart.

#### 1.4. Validate checkout details and complete an order

**File:** `tests/saucedemo/checkout.spec.ts`

**Steps:**
  1. Starting with a fresh session, sign in using standard_user / secret_sauce, add Sauce Labs Backpack ($29.99), open the cart, and select Checkout.
    - expect: Checkout: Your Information displays First Name, Last Name, and Zip/Postal Code fields with Continue and Cancel actions.
  2. Leave all customer information fields blank and select Continue.
    - expect: Checkout does not advance and shows a visible error that First Name is required.
  3. Enter Alex as First Name and Tester as Last Name, leave Zip/Postal Code blank, and select Continue.
    - expect: Checkout does not advance and displays a visible validation error for the missing postal code.
  4. Enter a valid postal code such as 10001 and select Continue.
    - expect: Checkout: Overview shows the Backpack and demo payment/shipping information. Item total is $29.99, tax is $2.40, and total is $32.39.
  5. Select Finish.
    - expect: Checkout: Complete! displays a Thank you for your order! confirmation and dispatch message. The cart is empty.
  6. Select Back Home.
    - expect: The Products page is displayed for continued shopping.

#### 1.5. Log out and verify authenticated access is ended

**File:** `tests/saucedemo/logout.spec.ts`

**Steps:**
  1. Starting with a fresh session, sign in using standard_user / secret_sauce and open the navigation menu.
    - expect: The menu exposes All Items, Dynamic Catalog, About, Logout, and Reset App State controls.
  2. Select Logout.
    - expect: The login page is displayed and the authenticated inventory view is no longer shown.
  3. Attempt to open the inventory URL directly in the same browser session.
    - expect: Unauthenticated access is redirected to the login page or otherwise denied; product/cart controls are not available.
  4. Sign in again with standard_user / secret_sauce.
    - expect: The user can authenticate again and return to the Products page.
