import { test } from '@playwright/test';

test("Expect to fail on CORS", async ({page}) => {
    await page.goto('http://localhost:3000/');
    await page.getByTestId('email').click();
    await page.getByTestId('email').fill('john.doe@example.com');
    await page.getByTestId('email').press('Tab');
    await page.getByTestId('password').fill('Secret1234');
    await page.getByTestId('login-button').click();
    //Expect to fail and show a toast message
    await page.getByText('An unknown error has occurred').click();
});

// test('Login with tabs', async ({ page }) => {
//     // Login
//     await page.goto('http://localhost:3000/');
//     await page.getByTestId('email').click();
//     await page.getByTestId('email').fill('john.doe@example.com');
//     await page.getByTestId('email').press('Tab');
//     await page.getByTestId('password').fill('Secret1234');
//     await page.getByTestId('password').press('Tab');
//     await page.getByTestId('login-button').click();
    
//     // Check if the user is logged in by checking if the logout button is present
//     // by pressing the logout button, the user will be logged out
//     await page.getByTestId('logout-button').click();
// });

// test('Login with clicks', async ({ page }) => {
//     // Login
//     await page.goto('http://localhost:3000/');
//     await page.getByTestId('email').click();
//     await page.getByTestId('email').fill('john.doe@example.com');
//     await page.getByTestId('password').click();
//     await page.getByTestId('password').fill('Secret1234');
//     await page.getByTestId('login-button').click();
    
//     // Check if the user is logged in by checking if the logout button is present
//     // by pressing the logout button, the user will be logged out
//     await page.getByTestId('logout-button').click();
// });

// test('Forget pw happy', async ({ page }) => {
//   await page.goto('http://localhost:3000/');
//   await page.getByTestId('forgot-password').click();
//   await page.getByTestId('email').click();
//   await page.getByTestId('email').fill('john.doe@example.com');
//   await page.getByTestId('reset-password-button').click();
// });

// test('Forget pw back to login', async ({ page }) => {
//     // navigate to forgot password page
//     await page.goto('http://localhost:3000/');
//     await page.getByTestId('forgot-password').click();
    
//     // fill in email but dont submit
//     await page.getByTestId('email').click();
//     await page.getByTestId('email').fill('john.doe@example.com');
    
//     // go back to login
//     await page.getByTestId('back-to-login').click();

//     // check if the user is back on the login page
//     await page.getByRole('heading', { name: 'Login to CareDash' }).click();
// });

// test('Stay logged in', async ({ page, browserName }) => {
//     test.skip(browserName === 'webkit', 'WebKit has issues persisting cookies after cross-origin navigation');
//     test.skip(browserName === 'firefox', 'WebKit has issues persisting cookies after cross-origin navigation');

//     // Login
//     await page.goto('http://localhost:3000/');
//     await page.getByTestId('email').click();
//     await page.getByTestId('email').fill('john.doe@example.com');
//     await page.getByTestId('password').click();
//     await page.getByTestId('password').fill('Secret1234');
//     await page.getByTestId('login-button').click();
    
//     // navigate to another page
//     await page.goto('http://google.com');
    
//     // navigate back to the app
//     await page.goto('http://localhost:3000/');
    
//     // check if the user is still logged in
//     await page.getByTestId('logout-button').click();
    
//     // check if the user is logged out
//     await page.getByRole('heading', { name: 'Login to CareDash' }).click();
// });

// test('login not filled', async ({ page }) => {
//     await page.goto('http://localhost:3000/');
//     await page.getByTestId('login-button').click();
//     await page.getByTestId('email-empty-icon');
//     await page.getByTestId('password-empty-icon');
// });

// test('Login no password', async ({ page }) => {
//     await page.goto('http://localhost:3000/');
//     await page.getByTestId('email').click();
//     await page.getByTestId('email').fill('john.doe@example.com');
//     await page.getByTestId('login-button').click();
//     await page.getByTestId('login-form').getByRole('img').click();
// });

// test('Login incorrect combination', async ({ page }) => {
//     await page.goto('http://localhost:3000/');
//     await page.getByTestId('email').click();
//     await page.getByTestId('email').fill('abc@gmail.com');
//     await page.getByTestId('email').press('Tab');
//     await page.getByTestId('password').fill('asb');
//     await page.getByTestId('login-button').click();
//     await page.getByText('Email or password is incorrect').click();
// });