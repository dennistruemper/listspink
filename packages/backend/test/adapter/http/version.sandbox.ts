import supertest from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../../../index';

describe('version', () => {
	it('should return version', async () => {
		const result = await supertest(app).get('/api/version').expect(200);
		expect(result.body).toEqual({ version: 'v0.0.1' });
	});
});
