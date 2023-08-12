import { data } from '@ampt/data';
import { describe, expect, it } from 'vitest';
describe('a sandbox', () => {
	it('a sondbox', async () => {
		data.set('a', 1);

		expect(await data.get('a')).toBe(1);
	});
	it('a2 sandbox', async () => {
		data.set('a2', 2);

		expect(await data.get('a2')).toBe(2);
	});
});
