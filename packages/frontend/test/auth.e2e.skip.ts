import { expect, test } from '@playwright/test';
import { TestGlobalConstants } from './testGlobalConstants';

// clerk has bot protection, this test does not work any more. Waiting for support answer hot to handle this
function createClerkTestMailAdress(): string {
	const today = new Date().toISOString().slice(0, 10);
	const prefix = today + '-' + Date.now();
	const suffix = '+clerk_test@listspink.com';
	return prefix + suffix;
}
const dummyPassword = 'listspink';

test('create new user', async ({ page }) => {
	await page.goto(TestGlobalConstants.getLatestURL());
	const mail = createClerkTestMailAdress();

	await page.getByRole('link', { name: 'Account' }).click();
	await page.getByRole('button', { name: 'Login' }).click();
	await page.getByRole('link', { name: 'Sign up' }).click();
	await page.getByLabel('Email address').click({ delay: 50 });

	await page.getByLabel('Email address', {}).fill(mail);
	await page.getByLabel('Password', { exact: true }).fill(dummyPassword);
	await page.getByRole('button', { name: 'Continue' }).click();

	// enter registration code
	await enterRegistrationCode(page);

	await page.getByRole('link', { name: 'Pink List' }).hover();
	expect(page.url()).toContain(TestGlobalConstants.getLatestURL());
});

test('login with new user', async ({ page }) => {
	const mail = createClerkTestMailAdress();

	// create new user
	await page.goto(TestGlobalConstants.getLatestURL());
	await page.getByRole('link', { name: 'Account' }).click();
	await page.getByRole('button', { name: 'Login' }).click();
	await page.getByRole('link', { name: 'Sign up' }).click();
	//await page.getByLabel('Email address').click();
	await page.getByLabel('Email address').click({ delay: 50 });

	await page.getByLabel('Email address').fill(mail);
	await page.getByLabel('Password', { exact: true }).fill(dummyPassword);
	await page.getByRole('button', { name: 'Continue' }).click();
	await enterRegistrationCode(page);
	page.waitForSelector('label:has-text("Digit 1")');
	await page.getByRole('link', { name: 'Pink List' }).hover();
	expect(page.url()).toContain(TestGlobalConstants.getLatestURL());

	// logout
	await page.getByRole('link', { name: 'Account' }).click();
	await page.getByRole('button', { name: 'Logout' }).click();

	// sign in with existing email user
	await page.getByRole('link', { name: 'Account' }).click();
	await page.getByRole('button', { name: 'Login' }).click();
	await page.getByLabel('Email address').click({ delay: 50 });

	await page.getByLabel('Email address').fill(mail);
	await page.getByRole('button', { name: 'Continue' }).click();
	await page.getByLabel('Password', { exact: true }).fill(dummyPassword);
	await page.getByRole('button', { name: 'Continue' }).click();
	await page.getByRole('link', { name: 'Pink List' }).hover();
	expect(page.url()).toContain(TestGlobalConstants.getLatestURL());
});

async function enterRegistrationCode(page) {
	page;
	//await page.getByLabel('Digit 1').click();
	await page.getByLabel('Digit 1').fill('4');
	await page.getByLabel('Digit 2').fill('2');
	await page.getByLabel('Digit 3').fill('4');
	await page.getByLabel('Digit 4').fill('2');
	await page.getByLabel('Digit 5').fill('4');
	await page.getByLabel('Digit 6').fill('2');
}
