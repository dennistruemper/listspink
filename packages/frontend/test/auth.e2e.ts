import { expect, test } from '@playwright/test';
import { TestGlobalConstants } from './testGlobalConstants';

test('create new user', async ({ page }) => {
	await page.goto(TestGlobalConstants.getLatestURL());
	await page.getByRole('link', { name: 'Account' }).click();
	await page.getByRole('button', { name: 'Login' }).click();
	await page.getByRole('link', { name: 'Sign up' }).click();
	await page.getByLabel('Email address').click();

	const now = new Date().toISOString().slice(0, 10) + '-' + Date.now();
	await page.getByLabel('Email address').fill(`${now}-lists-pink@roch.digital`);
	await page.getByLabel('Password').fill('Test20230817');
	await page.getByRole('button', { name: 'Continue' }).click();
	await page.getByRole('link', { name: 'Pink List' }).hover();
	expect(page.url().split('?')[0]).toBe(TestGlobalConstants.getLatestURL());
});

test('login with new user', async ({ page }) => {
	const today = new Date().toISOString().slice(0, 10);
	const now = today + '-' + Date.now();
	const mail = `${now}@lists.pink`;
	const password = 'Test' + today;

	// create new user
	await page.goto(TestGlobalConstants.getLatestURL());
	await page.getByRole('link', { name: 'Account' }).click();
	await page.getByRole('button', { name: 'Login' }).click();
	await page.getByRole('link', { name: 'Sign up' }).click();
	await page.getByLabel('Email address').click();

	await page.getByLabel('Email address').fill(mail);
	await page.getByLabel('Password').fill(password);
	await page.getByRole('button', { name: 'Continue' }).click();
	await page.getByRole('link', { name: 'Pink List' }).hover();
	expect(page.url().split('?')[0]).toBe(TestGlobalConstants.getLatestURL());

	// logout
	await page.getByRole('link', { name: 'Account' }).click();
	await page.getByRole('button', { name: 'Logout' }).click();

	// sign in with existing email user
	await page.getByRole('link', { name: 'Account' }).click();
	await page.getByRole('button', { name: 'Login' }).click();
	await page.getByLabel('Email address').click();

	await page.getByLabel('Email address').fill(mail);
	await page.getByLabel('Password').fill(password);
	await page.getByRole('button', { name: 'Continue' }).click();
	await page.getByRole('link', { name: 'Pink List' }).hover();
	expect(page.url().split('?')[0]).toBe(TestGlobalConstants.getLatestURL());
});
