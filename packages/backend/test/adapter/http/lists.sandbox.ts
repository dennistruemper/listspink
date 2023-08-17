import supertest from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../../../src/adapter/http/createExpressApp';
import { getDependencies } from '../../../src/stageDependencies';
import { createJwtDummy } from '../../util/jwt';

describe('list endpoint api/list', async () => {
	const dependencies = getDependencies('test');
	const app = await createApp(dependencies);

	it('should get a 401 without authorization', async () => {
		await supertest(app).post('/api/list').expect(401);
	});

	it('should work', async () => {
		const result = await supertest(app)
			.post('/api/list')
			.set('Authorization', 'Bearer ' + createJwtDummy('UserId123'))
			.send({ name: 'testName', description: 'testDescription' })
			.expect(200);
		expect(result.text).toContain('name":"testName');
		expect(result.text).toContain('description":"testDescription');
	});
});
