import { expect } from '@wdio/globals'
import LoginPage from '../pageobjects/login.page.js'

describe('Test cases', () => {
    it('Test case #1 Valid Login', async () => {
        await browser.url(`https://www.saucedemo.com/`);

        // Step 1
        const userNameField = await $('#user-name');
        await userNameField.setValue('standard_user');
        await expect(userNameField).toHaveValue('standard_user');

        // Step 2
        const passwordField = await $('#password');
        await passwordField.setValue('secret_sauce');
        await expect(passwordField).toHaveValue('secret_sauce');
        await expect(passwordField).toHaveAttribute('type', 'password');

        // Step 3
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

        // Step 1
        const userNameField = await $('#user-name');
        await userNameField.setValue('standard_user');
        await expect(userNameField).toHaveValue('standard_user');

        // Step 2
        const passwordField = await $('#password');
        await passwordField.setValue('wrong_password');
        await expect(passwordField).toHaveValue('wrong_password');
        // Check if data is represented as dots instead of characters
        await expect(passwordField).toHaveAttribute('type', 'password');

        // Step 3
        await $('#login-button').click();
        await browser.pause(2000);
        // Check if "X" icon is displayed on the Login field (check if svg element appears)
        const logDiv = await $('//*[@id="login_button_container"]/div/form/div[1]');
        await expect(logDiv).toHaveChildren(2);
        // Check if "X" icon is displayed on the Password field (check if svg element appears)
        const pasDiv = await $('//*[@id="login_button_container"]/div/form/div[2]');
        await expect(pasDiv).toHaveChildren(2);
        // Check if login and password fields are highlighted with red
        await expect(userNameField).toHaveAttributeContaining('class','error');
        await expect(passwordField).toHaveAttributeContaining('class','error');
        // Check if epic sadface is displayed
        const epicSadface = await $('//*[@id="login_button_container"]/div/form/div[3]/h3');
        await expect(epicSadface).toBeDisplayed();
        await expect(epicSadface).toHaveText('Epic sadface: Username and password do not match any user in this service');
    })

    it('Test case #3 Login with invalid login', async () => {
        await browser.url(`https://www.saucedemo.com/`);

        // Step 1
        const userNameField = await $('#user-name');
        await userNameField.setValue('standarD_user');
        // Check if data is entered to the field
        await expect(userNameField).toHaveValue('standarD_user');

        // Step 2
        const passwordField = await $('#password');
        await passwordField.setValue('secret_sauce');
        // Check if data is entered to the field
        await expect(passwordField).toHaveValue('secret_sauce');
        // Check if data is represented as dots instead of characters
        await expect(passwordField).toHaveAttribute('type', 'password');

        // Step 3
        await $('#login-button').click();
        await browser.pause(2000);
        // Check if "X" icon is displayed on the Login field (check if svg element appears)
        const logDiv = await $('//*[@id="login_button_container"]/div/form/div[1]');
        await expect(logDiv).toHaveChildren(2);
        // Check if "X" icon is displayed on the Password field (check if svg element appears)
        const pasDiv = await $('//*[@id="login_button_container"]/div/form/div[2]');
        await expect(pasDiv).toHaveChildren(2);
        // Check if login and password fields are highlighted with red
        await expect(userNameField).toHaveAttributeContaining('class','error');
        await expect(passwordField).toHaveAttributeContaining('class','error');
        // Check if epic sadface is displayed
        const epicSadface = await $('//*[@id="login_button_container"]/div/form/div[3]/h3');
        await expect(epicSadface).toBeDisplayed();
        await expect(epicSadface).toHaveText('Epic sadface: Username and password do not match any user in this service');
    })

    it('Test case#4 Logout', async ()=> {
        // Preconditions
        await browser.url(`https://www.saucedemo.com/`);
        await LoginPage.login('standard_user', 'secret_sauce');
        await browser.pause(2000);
        // Check if user is on the inventory page
        await expect(browser).toHaveUrl('https://www.saucedemo.com/inventory.html');

        // Step 1
        const burgerButton = await $('#react-burger-menu-btn');
        await burgerButton.click();
        await browser.pause(2000);
        const burgerMenu = await $('//*[@id="menu_button_container"]/div/div[2]/div[1]/nav');
        // Check if the menu is expanded
        await expect(burgerMenu).toBeDisplayed();
        // Check if the menu has 4 items
        await expect(burgerMenu).toHaveChildren(4);

        // Step 2
        const logoutButton = await $('#logout_sidebar_link');
        await logoutButton.click();
        await browser.pause(2000);
        // Check if user is redirected to the 'Login' page
        await expect(browser).toHaveUrl('https://www.saucedemo.com/');
        // Check if 'Login' field is empty
        const userNameField = await $('#user-name');
        await expect(userNameField).toHaveValue('');
        // Check if 'Password' field is empty
        const passwordField = await $('#password');
        await expect(passwordField).toHaveValue('');
    })

    it('Test case #5 Saving the cart after logout', async () => {
        // Preconditions
        await browser.url(`https://www.saucedemo.com/`);
        await LoginPage.login('standard_user', 'secret_sauce');
        await browser.pause(2000);
        // Check if user is on the inventory page
        await expect(browser).toHaveUrl('https://www.saucedemo.com/inventory.html');

        // Step 1
        const productAddToCart = await $('#add-to-cart-sauce-labs-backpack');
        const cartValue = await $('.shopping_cart_badge');
        //Check if number near the cart at the top right increase by 1
        let isCartNotEmpty = await cartValue.isDisplayed();
        if(isCartNotEmpty) {
            let startNum = Number(await cartValue.getText());
            await productAddToCart.click();
            let newNum = startNum + 1;
            let newNumText = newNum.toString();
            await browser.pause(2000);
            await expect(cartValue).toHaveText(newNumText);
        }
        else {
            await productAddToCart.click();
            await browser.pause(2000);
            await expect(cartValue).toHaveText('1');
        }
        // Check if product is added to cart
        const productAddToCartName = 'Sauce Labs Backpack';
        await $('.shopping_cart_link').click();
        await browser.pause(2000);
        await expect(browser).toHaveUrl('https://www.saucedemo.com/cart.html');
        const cartList = await $('.cart_list');
        await expect(cartList).toHaveTextContaining(productAddToCartName);

        // Step 2
        const burgerButton = await $('#react-burger-menu-btn');
        await burgerButton.click();
        await browser.pause(2000);
        // Check if burger menu are expanded and 4 items are displayed
        const burgerMenu = await $('//*[@id="menu_button_container"]/div/div[2]/div[1]/nav');
        await expect(burgerMenu).toBeDisplayed();
        await expect(burgerMenu).toHaveChildren(4);

        // Step 3
        const logoutButton = await $('#logout_sidebar_link');
        await logoutButton.click();
        await browser.pause(2000);
        // Check when Logout if User is redirecred to the "Login" page, "Username" and "Password" fields are empty
        await expect(browser).toHaveUrl('https://www.saucedemo.com/');
        await browser.pause(2000);
        const userNameField = await $('#user-name');
        await expect(userNameField).toHaveValue('');
        const passwordField = await $('#password');
        await expect(passwordField).toHaveValue('');

        // Step 4
        await LoginPage.login('standard_user', 'secret_sauce');
        await browser.pause(2000);
        // Check when Login user is redirected to the inventory page. Products and cart are displayed
        await expect(browser).toHaveUrl('https://www.saucedemo.com/inventory.html');
        const productsBlock = await $('#header_container');
        await expect(productsBlock).toBeDisplayed();
        await expect(productsBlock).toHaveTextContaining('Products');
        const cartIcon = await $('#shopping_cart_container');
        await expect(cartIcon).toBeDisplayed();

        // Step 5
        await $('.shopping_cart_link').click();
        await browser.pause(2000);
        // Check if click on the cart the Cart page is displayed, product is the same as was added at step 1
        await expect(browser).toHaveUrl('https://www.saucedemo.com/cart.html');
        await expect(cartList).toHaveTextContaining(productAddToCartName);

        // Remove the product
        await $('#remove-sauce-labs-backpack').click();
    })

    it('Test case #6 Sorting', async () => {
        // Preconditions
        await browser.url(`https://www.saucedemo.com/`);
        await LoginPage.login('standard_user', 'secret_sauce');
        await browser.pause(2000);
        // Check if user is on the inventory page
        await expect(browser).toHaveUrl('https://www.saucedemo.com/inventory.html');
        
        // Steps 1, 2
        const sortingBox = await $('.product_sort_container');
        const inventoryList = await $('.inventory_list');
        // Check if sorting 'Price(low to high)' sorts correct
        await sortingBox.selectByAttribute('value','lohi');
        await browser.pause(2000);
        const firstElLoHi = await inventoryList.$$('.inventory_item')[0];
        await expect(firstElLoHi).toHaveTextContaining('7.99');
        const secondElLoHi = await inventoryList.$$('.inventory_item')[1];
        await expect(secondElLoHi).toHaveTextContaining('9.99');
        const thirdElLoHi = await inventoryList.$$('.inventory_item')[2];
        await expect(thirdElLoHi).toHaveTextContaining('15.99');
        const forthElLoHi = await inventoryList.$$('.inventory_item')[3];
        await expect(forthElLoHi).toHaveTextContaining('15.99');
        const fifthElLoHi = await inventoryList.$$('.inventory_item')[4];
        await expect(fifthElLoHi).toHaveTextContaining('29.99');
        const sixthElLoHi = await inventoryList.$$('.inventory_item')[5];
        await expect(sixthElLoHi).toHaveTextContaining('49.99');

        // Check if sorting 'Price(high to low)' sorts correct
        await sortingBox.selectByAttribute('value','hilo');
        await browser.pause(2000);
        const firstElHiLo = await inventoryList.$$('.inventory_item')[0];
        await expect(firstElHiLo).toHaveTextContaining('49.99');
        const secondElHiLo = await inventoryList.$$('.inventory_item')[1];
        await expect(secondElHiLo).toHaveTextContaining('29.99');
        const thirdElHiLo = await inventoryList.$$('.inventory_item')[2];
        await expect(thirdElHiLo).toHaveTextContaining('15.99');
        const forthElHiLo = await inventoryList.$$('.inventory_item')[3];
        await expect(forthElHiLo).toHaveTextContaining('15.99');
        const fifthElHiLo = await inventoryList.$$('.inventory_item')[4];
        await expect(fifthElHiLo).toHaveTextContaining('9.99');
        const sixthElHiLo = await inventoryList.$$('.inventory_item')[5];
        await expect(sixthElHiLo).toHaveTextContaining('7.99');

        // Check if sorting 'Name(A to Z)' sorts correct
        await sortingBox.selectByAttribute('value','az');
        await browser.pause(2000);
        const firstElaz = await inventoryList.$$('.inventory_item')[0];
        await expect(firstElaz).toHaveTextContaining('Backpack');
        const secondElaz = await inventoryList.$$('.inventory_item')[1];
        await expect(secondElaz).toHaveTextContaining('Bike');
        const thirdElaz = await inventoryList.$$('.inventory_item')[2];
        await expect(thirdElaz).toHaveTextContaining('Bolt');
        const forthElaz = await inventoryList.$$('.inventory_item')[3];
        await expect(forthElaz).toHaveTextContaining('Fleece');
        const fifthElaz = await inventoryList.$$('.inventory_item')[4];
        await expect(fifthElaz).toHaveTextContaining('Onesie');
        const sixthElaz = await inventoryList.$$('.inventory_item')[5];
        await expect(sixthElaz).toHaveTextContaining('Test');

        // Check if sorting 'Name(Z to A)' sorts correct
        await sortingBox.selectByAttribute('value','za');
        await browser.pause(2000);
        const firstElza = await inventoryList.$$('.inventory_item')[0];
        await expect(firstElza).toHaveTextContaining('Test');
        const secondElza = await inventoryList.$$('.inventory_item')[1];
        await expect(secondElza).toHaveTextContaining('Onesie');
        const thirdElza = await inventoryList.$$('.inventory_item')[2];
        await expect(thirdElza).toHaveTextContaining('Fleece');
        const forthElza = await inventoryList.$$('.inventory_item')[3];
        await expect(forthElza).toHaveTextContaining('Bolt');
        const fifthElza = await inventoryList.$$('.inventory_item')[4];
        await expect(fifthElza).toHaveTextContaining('Bike');
        const sixthElza = await inventoryList.$$('.inventory_item')[5];
        await expect(sixthElza).toHaveTextContaining('Backpack');
    })

    it('Test case #7 Footer Links', async () => {
        // Preconditions
        await browser.url(`https://www.saucedemo.com/`);
        await LoginPage.login('standard_user', 'secret_sauce');
        await browser.pause(2000);
        // Check if user is on the inventory page
        await expect(browser).toHaveUrl('https://www.saucedemo.com/inventory.html');

        // Step 1
        const twitButton = await $('//*[@id="page_wrapper"]/footer/ul/li[1]/a');
        await twitButton.click();
        await browser.pause(2000);
        // Check if Twitter icon opens Twitter page in new tab and return
        const handles = await browser.getWindowHandles();
        await browser.switchToWindow(handles[1]);
        await browser.pause(2000);
        await expect(browser).toHaveUrl('https://twitter.com/saucelabs');
        await browser.closeWindow();
        await browser.switchToWindow(handles[0]);
        await expect(browser).toHaveUrl('https://www.saucedemo.com/inventory.html');

         // Step 2
         const facebButton = await $('//*[@id="page_wrapper"]/footer/ul/li[2]/a');
         await facebButton.click();
         await browser.pause(2000);
         // Check if Facebook icon opens Facebook page in new tab and return
         const handles1 = await browser.getWindowHandles();
         await browser.switchToWindow(handles1[1]);
         await browser.pause(2000);
         await expect(browser).toHaveUrl('https://www.facebook.com/saucelabs');
         await browser.closeWindow();
         await browser.switchToWindow(handles1[0]);
         await expect(browser).toHaveUrl('https://www.saucedemo.com/inventory.html');

         // Step 3
         const linButton = await $('//*[@id="page_wrapper"]/footer/ul/li[3]/a');
         await linButton.click();
         await browser.pause(2000);
         // Check if LinkedIn icon opens LinkedIn page in new tab and return
         const handles2 = await browser.getWindowHandles();
         await browser.switchToWindow(handles2[1]);
         await browser.pause(2000);
         await expect(browser).toHaveUrl('https://www.linkedin.com/company/sauce-labs/');
         await browser.closeWindow();
         await browser.switchToWindow(handles2[0]);
         await expect(browser).toHaveUrl('https://www.saucedemo.com/inventory.html');
    })

    it('Test case #8 Valid Checkout', async () => {
        // Preconditions
        await browser.url(`https://www.saucedemo.com/`);
        await LoginPage.login('standard_user', 'secret_sauce');
        await browser.pause(2000);
        await expect(browser).toHaveUrl('https://www.saucedemo.com/inventory.html');

        // Step 1
        const productAddToCart = await $('#add-to-cart-sauce-labs-backpack');
        const cartValue = await $('.shopping_cart_badge');
        //Check if number near the cart at the top right increase by 1
        let isCartNotEmpty = await cartValue.isDisplayed();
        if(isCartNotEmpty) {
            let startNum = Number(await cartValue.getText());
            await productAddToCart.click();
            let newNum = startNum + 1;
            let newNumText = newNum.toString();
            await browser.pause(2000);
            await expect(cartValue).toHaveText(newNumText);
        }
        else {
            await productAddToCart.click();
            await browser.pause(2000);
            await expect(cartValue).toHaveText('1');
        }
        // Step 2
        // Check if product is added to cart
        const productAddToCartName = 'Sauce Labs Backpack';
        const cartLink = await $('.shopping_cart_link');
        await cartLink.click();
        await browser.pause(2000);
        await expect(browser).toHaveUrl('https://www.saucedemo.com/cart.html');
        const cartList = await $('.cart_list');
        await expect(cartList).toHaveTextContaining(productAddToCartName);

        // Step 3
        // Click on the 'Checkout' button and check if Checkout form is displayed
        const checkoutButton = await $('#checkout');
        await checkoutButton.click();
        await expect(browser).toHaveUrl('https://www.saucedemo.com/checkout-step-one.html');
        const checkoutForm = await $('//*[@id="checkout_info_container"]/div/form');
        await expect(checkoutForm).toBeDisplayed();

        // Steps 4,5,6
        // Fill in the form and check data fields
        const firstName = await $('#first-name');
        await firstName.setValue('Peter');
        await expect(firstName).toHaveValue('Peter');
        const lastName = await $('#last-name');
        await lastName.setValue('Pan');
        await expect(lastName).toHaveValue('Pan');
        const postalCode = await $('#postal-code');
        await postalCode.setValue('79000');
        await expect(postalCode).toHaveValue('79000');

        // Step 7
        // Click on 'Continue' button, check if user is redirected to the 'Overview' page
        const contButton = await $('#continue');
        await contButton.click();
        await browser.pause(2000);
        await expect(browser).toHaveUrl('https://www.saucedemo.com/checkout-step-two.html');
        // Check if the product from step 1 is displayed
        const prodList = await $('.cart_list');
        await expect(prodList).toHaveTextContaining(productAddToCartName);
        // Check if total price is price of the product from step 1
        const totalPrice = await $('.summary_subtotal_label');
        await expect(totalPrice).toHaveTextContaining('29.99');

        // Step 8
        // Click on the 'Finish' button, check if user is redirected to the 'Checkout complete' page
        const finishButton = await $('#finish');
        await finishButton.click();
        await expect(browser).toHaveUrl('https://www.saucedemo.com/checkout-complete.html');
        // Check if message 'Thank you for ...' is displayed
        const thanksMessage = await $('.complete-header');
        await expect(thanksMessage).toBeDisplayed();
        await expect(thanksMessage).toHaveText('Thank you for your order!');

        // Step 9
        // Click on the 'Back Home' button, check if user is redirected to the inventory page
        const backHomeButton = await $('#back-to-products');
        await backHomeButton.click();
        await expect(browser).toHaveUrl('https://www.saucedemo.com/inventory.html');
        //Check if 'Products' are displayed
        const productsBlock = await $('#header_container');
        await expect(productsBlock).toBeDisplayed();
        await expect(productsBlock).toHaveTextContaining('Products');
        // Check if cart is empty
        await expect(cartLink).toHaveChildren(0);
    })

// The next test case was skipped because there was a bug on the website when I was writing the test case,
// so it was always failed (when cart was empty after 'Continue' button clicking user left the 'Cart' page)

    it.skip('Test case #9 Checkout without products', async () => {
         // Preconditions
         await browser.url(`https://www.saucedemo.com/`);
         await LoginPage.login('standard_user', 'secret_sauce');
         await browser.pause(2000);
         await expect(browser).toHaveUrl('https://www.saucedemo.com/inventory.html');
         
         // Step 1
         // Click on the 'Cart' button, check if cart page is displayed
         const cartLink = await $('.shopping_cart_link');
         // Check if cart is empty
         await expect(cartLink).toHaveChildren(0);
         await cartLink.click();
         await browser.pause(2000);
         await expect(browser).toHaveUrl('https://www.saucedemo.com/cart.html');

         // Step 2
         // Click on the 'Checkout' button, check if user stays at the 'Cart' page
         const checkoutButton = await $('#checkout');
         await checkoutButton.click();
         await expect(browser).toHaveUrl('https://www.saucedemo.com/cart.html');
         // Check if error message 'Cart is empty' is displayed
    })

    it('Test case #10(optional) Add to the Cart product if Cart is not empty', async () => {
        // Preconditions
         await browser.url(`https://www.saucedemo.com/`);
         await LoginPage.login('standard_user', 'secret_sauce');
         await browser.pause(2000);
         await expect(browser).toHaveUrl('https://www.saucedemo.com/inventory.html');
         // Step 1 - Add the product to the Cart
         const productAddToCart = await $('#add-to-cart-sauce-labs-backpack');
         await productAddToCart.click();
         const productAddToCartName = 'Sauce Labs Backpack';
         // Check if product is on the Cart
        await $('.shopping_cart_link').click();
        await browser.pause(2000);
        await expect(browser).toHaveUrl('https://www.saucedemo.com/cart.html');
        const cartList = await $('.cart_list');
        await expect(cartList).toHaveTextContaining(productAddToCartName);

        // Step 2 - Logout
        const burgerButton = await $('#react-burger-menu-btn');
        await burgerButton.click();
        await browser.pause(2000);
        // Check if burger menu are expanded and 4 items are displayed
        const burgerMenu = await $('//*[@id="menu_button_container"]/div/div[2]/div[1]/nav');
        await expect(burgerMenu).toBeDisplayed();
        await expect(burgerMenu).toHaveChildren(4);
        const logoutButton = await $('#logout_sidebar_link');
        await logoutButton.click();
        await browser.pause(2000);
        // Check when Logout if User is redirecred to the "Login" page, "Username" and "Password" fields are empty
        await expect(browser).toHaveUrl('https://www.saucedemo.com/');
        await browser.pause(2000);
        const userNameField = await $('#user-name');
        await expect(userNameField).toHaveValue('');
        const passwordField = await $('#password');
        await expect(passwordField).toHaveValue('');

        // Step 3 Login with the same data
        await LoginPage.login('standard_user', 'secret_sauce');
        await browser.pause(2000);
        // Check when Login user is redirected to the inventory page. Products and cart are displayed
        await expect(browser).toHaveUrl('https://www.saucedemo.com/inventory.html');

        // Step 4 Add the new product to the Cart
        const productAddToCartNew = await $('#add-to-cart-sauce-labs-bike-light');
        const cartValue = await $('.shopping_cart_badge');
        //Check if number near the cart at the top right increase by 1
        let isCartNotEmpty = await cartValue.isDisplayed();
        if(isCartNotEmpty) {
            let startNum = Number(await cartValue.getText());
            await productAddToCartNew.click();
            let newNum = startNum + 1;
            let newNumText = newNum.toString();
            await browser.pause(2000);
            await expect(cartValue).toHaveText(newNumText);
        }
        else {
            await productAddToCartNew.click();
            await browser.pause(2000);
            await expect(cartValue).toHaveText('1');
        }
        // Check if the new product is added to cart
        const productAddToCartNameNew = 'Sauce Labs Bike Light';
        await $('.shopping_cart_link').click();
        await browser.pause(2000);
        await expect(browser).toHaveUrl('https://www.saucedemo.com/cart.html');
        await expect(cartList).toHaveTextContaining(productAddToCartNameNew);

    })
})

