import { test } from '@playwright/test';
import { TestGlobalConstants } from './testGlobalConstants';

test('create new item as fresh user', async ({ page }) => {
	await page.goto(TestGlobalConstants.getLatestURL());
	await page.getByRole('button', { name: 'Create Item' }).click();
	await page.getByRole('textbox', { name: 'Name' }).click();
	await page.keyboard.type('hello');
	await page.getByRole('button', { name: 'Save' }).click();
	await page.waitForSelector('text="Create Item"');
});
