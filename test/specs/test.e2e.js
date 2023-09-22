import { expect } from '@wdio/globals'
import LoginPage from '../pageobjects/login.page.js'

describe('Test cases', () => {
    it('Test case #1 Valid Login', async () => {
        await browser.url(`https://www.saucedemo.com/`);
        const userNameField = await $('#user-name');
        await userNameField.setValue('standard_user');
        await expect(userNameField).toHaveValue('standard_user');
        const passwordField = await $('#password');
        await passwordField.setValue('secret_sauce');
        await expect(passwordField).toHaveValue('secret_sauce');
        await expect(passwordField).toHaveAttribute('type', 'password');
        await $('#login-button').click();
        await browser.pause(2000);
        await expect(browser).toHaveUrl('https://www.saucedemo.com/inventory.html');
        const productsBlock = await $('#header_container');
        await expect(productsBlock).toBeDisplayed();
        await expect(productsBlock).toHaveTextContaining('Products');
        const cartIcon = await $('#shopping_cart_container');
        await expect(cartIcon).toBeDisplayed();
    })

    it('test case #2 Login with invalid password', async () => {
        await browser.url(`https://www.saucedemo.com/`);
        const userNameField = await $('#user-name');
        await userNameField.setValue('standard_user');
        await expect(userNameField).toHaveValue('standard_user');
        const passwordField = await $('#password');
        await passwordField.setValue('wrong_password');
        await expect(passwordField).toHaveValue('wrong_password');
        await expect(passwordField).toHaveAttribute('type', 'password');
        await $('#login-button').click();
        await browser.pause(2000);
        const logDiv = await $('//*[@id="login_button_container"]/div/form/div[1]');
        await expect(logDiv).toHaveChildren(2);
        const pasDiv = await $('//*[@id="login_button_container"]/div/form/div[2]');
        await expect(pasDiv).toHaveChildren(2);
        await expect(userNameField).toHaveAttributeContaining('class', 'error');
        await expect(passwordField).toHaveAttributeContaining('class', 'error');
        const epicSadface = await $('//*[@id="login_button_container"]/div/form/div[3]/h3');
        await expect(epicSadface).toBeDisplayed();
        await expect(epicSadface).toHaveText('Epic sadface: Username and password do not match any user in this service');
    })

    it('Test case #3 Login with invalid login', async () => {
        await browser.url(`https://www.saucedemo.com/`);
        const userNameField = await $('#user-name');
        await userNameField.setValue('standarD_user');
        await expect(userNameField).toHaveValue('standarD_user');
        const passwordField = await $('#password');
        await passwordField.setValue('secret_sauce');
        await expect(passwordField).toHaveValue('secret_sauce');
        await expect(passwordField).toHaveAttribute('type', 'password');
        await $('#login-button').click();
        await browser.pause(2000);
        const logDiv = await $('//*[@id="login_button_container"]/div/form/div[1]');
        await expect(logDiv).toHaveChildren(2);
        const pasDiv = await $('//*[@id="login_button_container"]/div/form/div[2]');
        await expect(pasDiv).toHaveChildren(2);
        await expect(userNameField).toHaveAttributeContaining('class', 'error');
        await expect(passwordField).toHaveAttributeContaining('class', 'error');
        const epicSadface = await $('//*[@id="login_button_container"]/div/form/div[3]/h3');
        await expect(epicSadface).toBeDisplayed();
        await expect(epicSadface).toHaveText('Epic sadface: Username and password do not match any user in this service');
    })

    it('Test case #4 Logout', async () => {
        await browser.url(`https://www.saucedemo.com/`);
        await LoginPage.login('standard_user', 'secret_sauce');
        await browser.pause(2000);
        await expect(browser).toHaveUrl('https://www.saucedemo.com/inventory.html');
        const productAddToCart = await $('#add-to-cart-sauce-labs-backpack');
        const cartValue = await $('.shopping_cart_badge');
        let isCartNotEmpty = await cartValue.isDisplayed();
        if (isCartNotEmpty) {
            let startNum = Number(await cartValue.getText());
            await productAddToCart.click();
            let newNum = startNum + 1;
            let newNumText = newNum.toString();
            await browser.pause(2000);
            await expect(cartValue).toHaveText(newNumText);
        } else {
            await productAddToCart.click();
            await browser.pause(2000);
            await expect(cartValue).toHaveText('1');
        }
        const productAddToCartName = 'Sauce Labs Backpack';
        await $('.shopping_cart_link').click();
        await browser.pause(2000);
        await expect(browser).toHaveUrl('https://www.saucedemo.com/cart.html');
        const cartList = await $('.cart_list');
        await expect(cartList).toHaveTextContaining(productAddToCartName);
        const burgerButton = await $('#react-burger-menu-btn');
        await burgerButton.click();
        await browser.pause(2000);
        const burgerMenu = await $('//*[@id="menu_button_container"]/div/div[2]/div[1]/nav');
        await expect(burgerMenu).toBeDisplayed();
        await expect(burgerMenu).toHaveChildren(4);
        const logoutButton = await $('#logout_sidebar_link');
        await logoutButton.click();
        await browser.pause(2000);
        await expect(browser).toHaveUrl('https://www.saucedemo.com/');
        await browser.pause(2000);
        const userNameField = await $('#user-name');
        await expect(userNameField).toHaveValue('');
        const passwordField = await $('#password');
        await expect(passwordField).toHaveValue('');
        await LoginPage.login('standard_user', 'secret_sauce');
        await browser.pause(2000);
        await expect(browser).toHaveUrl('https://www.saucedemo.com/inventory.html');
        const productsBlock = await $('#header_container');
        await expect(productsBlock).toBeDisplayed();
        await expect(productsBlock).toHaveTextContaining('Products');
        const cartIcon = await $('#shopping_cart_container');
        await expect(cartIcon).toBeDisplayed();
    })

    it('Test case #5 Saving the cart after logout', async () => {
        await browser.url(`https://www.saucedemo.com/`);
        await LoginPage.login('standard_user', 'secret_sauce');
        await browser.pause(2000);
        await expect(browser).toHaveUrl('https://www.saucedemo.com/inventory.html');
        const productAddToCart = await $('#add-to-cart-sauce-labs-backpack');
        const cartValue = await $('.shopping_cart_badge');
        let isCartNotEmpty = await cartValue.isDisplayed();
        if (isCartNotEmpty) {
            let startNum = Number(await cartValue.getText());
            await productAddToCart.click();
            let newNum = startNum + 1;
            let newNumText = newNum.toString();
            await browser.pause(2000);
            await expect(cartValue).toHaveText(newNumText);
        } else {
            await productAddToCart.click();
            await browser.pause(2000);
            await expect(cartValue).toHaveText('1');
        }
        const productAddToCartName = 'Sauce Labs Backpack';
        await $('.shopping_cart_link').click();
        await browser.pause(2000);
        await expect(browser).toHaveUrl('https://www.saucedemo.com/cart.html');
        const cartList = await $('.cart_list');
        await expect(cartList).toHaveTextContaining(productAddToCartName);
        const burgerButton = await $('#react-burger-menu-btn');
        await burgerButton.click();
        await browser.pause(2000);
        const burgerMenu = await $('//*[@id="menu_button_container"]/div/div[2]/div[1]/nav');
        await expect(burgerMenu).toBeDisplayed();
        await expect(burgerMenu).toHaveChildren(4);
        const logoutButton = await $('#logout_sidebar_link');
        await logoutButton.click();
        await browser.pause(2000);
        await expect(browser).toHaveUrl('https://www.saucedemo.com/');
        await browser.pause(2000);
        const userNameField = await $('#user-name');
        await expect(userNameField).toHaveValue('');
        const passwordField = await $('#password');
        await expect(passwordField).toHaveValue('');
        await LoginPage.login('standard_user', 'secret_sauce');
        await browser.pause(2000);
        await expect(browser).toHaveUrl('https://www.saucedemo.com/inventory.html');
        const productsBlock = await $('#header_container');
        await expect(productsBlock).toBeDisplayed();
        await expect(productsBlock).toHaveTextContaining('Products');
        const cartIcon = await $('#shopping_cart_container');
        await expect(cartIcon).toBeDisplayed();
    })
})
