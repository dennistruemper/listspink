import { expect, test } from '@playwright/test';
import { TestGlobalConstants } from './testGlobalConstants';

test('snapshot test of signIn page', async ({ page: Page }) => {
	await page.goto(TestGlobalConstants.getLatestURL());
	await page.waitForSelector('text=Unknown User');
	await expect(page).toHaveScreenshot();
});
