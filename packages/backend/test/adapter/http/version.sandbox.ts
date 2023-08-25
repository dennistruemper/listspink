import supertest from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../../../src/adapter/http/createExpressApp';
import { getTestDependencies } from '../testDependencies';

describe('version', () => {
	const dependencies = getTestDependencies('integration');
	it('should return version', async () => {
		const app = await createApp(dependencies);
		const result = await supertest(app).get('/api/version').expect(200);
		expect(result.body).toEqual({ version: 'v0.0.1' });
	});
});
