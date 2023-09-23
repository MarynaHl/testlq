import { expect } from '@wdio/globals';
import LoginPage from '../pageobjects/login.page.js';

describe('Test cases', () => {
    beforeEach(async () => {
        await browser.url(`https://www.saucedemo.com/`);
    });

    it('Test case #1 Valid Login', async () => {
        const userNameField = await $('#user-name');
        await userNameField.setValue('standard_user');
        await expect(userNameField).toHaveValue('standard_user');

        const passwordField = await $('#password');
        await passwordField.setValue('secret_sauce');
        await expect(passwordField).toHaveValue('secret_sauce');
        await expect(passwordField).toHaveAttribute('type', 'password');

        const loginButton = await $('#login-button');
        await loginButton.click();

        const inventoryPage = await $('#inventory_container');
        await inventoryPage.waitForDisplayed();
        await expect(browser).toHaveUrl('https://www.saucedemo.com/inventory.html');

        const productsBlock = await $('#header_container');
        await expect(productsBlock).toBeDisplayed();
        await expect(productsBlock).toHaveTextContaining('Products');

        const cartIcon = await $('#shopping_cart_container');
        await expect(cartIcon).toBeDisplayed();
    });

    it('Test case #2 Login with invalid password', async () => {
        const userNameField = await $('#user-name');
        await userNameField.setValue('standard_user');
        await expect(userNameField).toHaveValue('standard_user');

        const passwordField = await $('#password');
        await passwordField.setValue('wrong_password');
        await expect(passwordField).toHaveValue('wrong_password');
        await expect(passwordField).toHaveAttribute('type', 'password');

        const loginButton = await $('#login-button');
        await loginButton.click();

        const logDiv = await $('//*[@id="login_button_container"]/div/form/div[1]');
        await expect(logDiv).toHaveChildren(2);

        const pasDiv = await $('//*[@id="login_button_container"]/div/form/div[2]');
        await expect(pasDiv).toHaveChildren(2);

        await expect(userNameField).toHaveAttributeContaining('class', 'error');
        await expect(passwordField).toHaveAttributeContaining('class', 'error');

        const epicSadface = await $('//*[@id="login_button_container"]/div/form/div[3]/h3');
        await expect(epicSadface).toBeDisplayed();
        await expect(epicSadface).toHaveText('Epic sadface: Username and password do not match any user in this service');
    });

    it('Test case #3 Login with invalid login', async () => {
        const userNameField = await $('#user-name');
        await userNameField.setValue('standarD_user');
        await expect(userNameField).toHaveValue('standarD_user');

        const passwordField = await $('#password');
        await passwordField.setValue('secret_sauce');
        await expect(passwordField).toHaveValue('secret_sauce');
        await expect(passwordField).toHaveAttribute('type', 'password');

        const loginButton = await $('#login-button');
        await loginButton.click();

        const logDiv = await $('//*[@id="login_button_container"]/div/form/div[1]');
        await expect(logDiv).toHaveChildren(2);

        const pasDiv = await $('//*[@id="login_button_container"]/div/form/div[2]');
        await expect(pasDiv).toHaveChildren(2);

        await expect(userNameField).toHaveAttributeContaining('class', 'error');
        await expect(passwordField).toHaveAttributeContaining('class', 'error');

        const epicSadface = await $('//*[@id="login_button_container"]/div/form/div[3]/h3');
        await expect(epicSadface).toBeDisplayed();
        await expect(epicSadface).toHaveText('Epic sadface: Username and password do not match any user in this service');
    });

    it('Test case#4 Logout', async () => {
        await LoginPage.login('standard_user', 'secret_sauce');

        const burgerButton = await $('#react-burger-menu-btn');
        await burgerButton.click();

        const burgerMenu = await $('//*[@id="menu_button_container"]/div/div[2]/div[1]/nav');
        await expect(burgerMenu).toBeDisplayed();
        await expect(burgerMenu).toHaveChildren(4);

        const logoutButton = await $('#logout_sidebar_link');
        await logoutButton.click();

        await expect(browser).toHaveUrl('https://www.saucedemo.com/');

        const userNameField = await $('#user-name');
        await expect(userNameField).toHaveValue('');

        const passwordField = await $('#password');
        await expect(passwordField).toHaveValue('');
    });

    it('Test case #5 Saving the cart after logout', async () => {
        await LoginPage.login('standard_user', 'secret_sauce');

        const productAddToCart = await $('#add-to-cart-sauce-labs-backpack');
        const cartValue = await $('.shopping_cart_badge');

        let isCartNotEmpty = await cartValue.isDisplayed();
        if (isCartNotEmpty) {
            let startNum = Number(await cartValue.getText());
            await productAddToCart.click();
            let newNum = startNum + 1;
            let newNumText = newNum.toString();
            await expect(cartValue).toHaveText(newNumText);
        } else {
            await productAddToCart.click();
            await expect(cartValue).toHaveText('1');
        }

        const productAddToCartName = 'Sauce Labs Backpack';
        await $('.shopping_cart_link').click();

        await expect(browser).toHaveUrl('https://www.saucedemo.com/cart.html');

        const cartList = await $('.cart_list');
        await expect(cartList).toHaveTextContaining(productAddToCartName);
    });
});
// Test case #6 Sorting
const sortingBox = await $('.product_sort_container');
const inventoryList = await $('.inventory_list');

// Define a function for sorting and assertions
async function testSortingAndAssertions(value, expectedTexts) {
    await sortingBox.selectByAttribute('value', value);

    const items = await inventoryList.$$('.inventory_item');
    for (let i = 0; i < expectedTexts.length; i++) {
        const item = items[i];
        await expect(item).toHaveTextContaining(expectedTexts[i]);
    }
}

// Check if sorting 'Price(low to high)' sorts correctly
await testSortingAndAssertions('lohi', ['7.99', '9.99', '15.99', '15.99', '29.99', '49.99']);

// Check if sorting 'Price(high to low)' sorts correctly
await testSortingAndAssertions('hilo', ['49.99', '29.99', '15.99', '15.99', '9.99', '7.99']);

// Check if sorting 'Name(A to Z)' sorts correctly
await testSortingAndAssertions('az', ['Backpack', 'Bike', 'Bolt', 'Fleece', 'Onesie', 'Test']);

// Check if sorting 'Name(Z to A)' sorts correctly
await testSortingAndAssertions('za', ['Test', 'Onesie', 'Fleece', 'Bolt', 'Bike', 'Backpack']);

// Test case #7 Footer Links
it('Test case #7 Footer Links', async () => {
    // Check if user is on the inventory page
    await expect(browser).toHaveUrl('https://www.saucedemo.com/inventory.html');

    // Assertions for Footer Links
    const twitterLink = await $('[data-test="social-twitter"]');
    await expect(twitterLink).toHaveAttribute('href', 'https://twitter.com/saucelabs');
    const facebookLink = await $('[data-test="social-facebook"]');
    await expect(facebookLink).toHaveAttribute('href', 'https://www.facebook.com/saucelabs');
    const linkedinLink = await $('[data-test="social-linkedin"]');
    await expect(linkedinLink).toHaveAttribute('href', 'https://www.linkedin.com/company/saucelabs');
});

// Test case #8 Valid Checkout
it('Test case #8 Valid Checkout', async () => {
    // Preconditions
    await browser.url(`https://www.saucedemo.com/`);
    await LoginPage.login('standard_user', 'secret_sauce');
    await expect(browser).toHaveUrl('https://www.saucedemo.com/inventory.html');

    // Step 1
    const productAddToCart = await $('#add-to-cart-sauce-labs-backpack');
    await productAddToCart.click();
    await expect(productAddToCart).toBeClickable(); // Ensure the click is complete
    const cartValue = await $('.shopping_cart_badge');
    const startNum = Number(await cartValue.getText());
    await expect(startNum).toEqual(1);

    // Step 2
    const productAddToCartName = 'Sauce Labs Backpack';
    const cartLink = await $('.shopping_cart_link');
    await cartLink.click();
    await browser.pause(2000);
    await expect(browser).toHaveUrl('https://www.saucedemo.com/cart.html');
    const cartList = await $('.cart_list');
    await expect(cartList).toHaveTextContaining(productAddToCartName);

    // Step 3
    const checkoutButton = await $('#checkout');
    await checkoutButton.click();
    await expect(browser).toHaveUrl('https://www.saucedemo.com/checkout-step-one.html');
    const checkoutForm = await $('//*[@id="checkout_info_container"]/div/form');
    await expect(checkoutForm).toBeDisplayed();

    // Step 4
    const firstName = await $('#first-name');
    await firstName.setValue('Peter');
    await expect(firstName).toHaveValue('Peter');
    const lastName = await $('#last-name');
    await lastName.setValue('Pan');
    await expect(lastName).toHaveValue('Pan');
    const postalCode = await $('#postal-code');
    await postalCode.setValue('79000');
    await expect(postalCode).toHaveValue('79000');

    // Step 5
    const contButton = await $('#continue');
    await contButton.click();
    await browser.pause(2000);
    await expect(browser).toHaveUrl('https://www.saucedemo.com/checkout-step-two.html');
    const prodList = await $('.cart_list');
    await expect(prodList).toHaveTextContaining(productAddToCartName);
    const totalPrice = await $('.summary_subtotal_label');
    await expect(totalPrice).toHaveTextContaining('29.99');

    // Step 6
    const finishButton = await $('#finish');
    await finishButton.click();
    await expect(browser).toHaveUrl('https://www.saucedemo.com/checkout-complete.html');
    const thanksMessage = await $('.complete-header');
    await expect(thanksMessage).toBeDisplayed();
    await expect(thanksMessage).toHaveText('Thank you for your order!');

    // Step 7
    const backHomeButton = await $('#back-to-products');
    await backHomeButton.click();
    await expect(browser).toHaveUrl('https://www.saucedemo.com/inventory.html');
    const productsBlock = await $('#header_container');
    await expect(productsBlock).toBeDisplayed();
    await expect(productsBlock).toHaveTextContaining('Products');
    const cartLinkAgain = await $('.shopping_cart_link');
    await expect(cartLinkAgain).toHaveChildren(0);
});

// Skip 'Test case #9 Checkout without products'
it.skip('Test case #9 Checkout without products', async () => {
    // ...
});

// Test case #10(optional) Add a product to the Cart if the Cart is not empty
it('Test case #10(optional) Add a product to the Cart if the Cart is not empty', async () => {
    // ...
});
