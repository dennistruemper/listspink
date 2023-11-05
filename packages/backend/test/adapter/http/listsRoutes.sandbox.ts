import supertest from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../../../src/adapter/http/createExpressApp';

import { CreateListRequest } from '../../../src/domain/definitions/communication/createListRequestResponse';
import { getListDetailsArrayResponseSchema } from '../../../src/domain/definitions/communication/getListDetailsRequestResponse';
import { createJwtDummy } from '../../util/jwt';
import { getTestDependencies } from '../testDependencies';
describe.concurrent('list enppoints', async () => {
	const dependencies = getTestDependencies('integration');
	const app = await createApp(dependencies);

	describe('list endpoint api/list/:listId GET', async () => {
		it('should get a 401 without authorization', async () => {
			await supertest(app).get('/api/list/some-id').expect(401);
		});

		it('should work for connected user', async () => {
			const created = await dependencies.listRepository.create({
				name: 'testName',
				description: 'testDescription',
				itemIds: []
			});
			if (created.success === false) throw new Error('List creation failed');

			const connected = await dependencies.listRepository.connectToUser({
				listId: created.value.id,
				userId: 'UserId123'
			});

			if (connected.success === false) throw new Error('List connection failed');

			const result = await supertest(app)
				.get(`/api/list/${created.value.id}`)
				.set('Authorization', 'Bearer ' + createJwtDummy('UserId123'))
				.expect(200);
			expect(result.text).toContain('name":"testName');
			expect(result.text).toContain('description":"testDescription');
		});

		it('should not work for unconnected user', async () => {
			const created = await dependencies.listRepository.create({
				name: 'testName',
				description: 'testDescription',
				itemIds: []
			});
			if (created.success === false) throw new Error('List creation failed');

			await supertest(app)
				.get(`/api/list/${created.value.id}`)
				.set('Authorization', 'Bearer ' + createJwtDummy('UserId123'))
				.expect(403);
		});
	});

	describe('list endpoint api/list GET', async () => {
		it('should get a 401 without authorization', async () => {
			await supertest(app).get('/api/list').expect(401);
		});

		it('should work for connected user', async () => {
			const userId = 'USER' + dependencies.idGenerator.generate();
			const created = await dependencies.listRepository.create({
				name: 'testName',
				description: 'testDescription',
				itemIds: []
			});
			if (created.success === false) throw new Error('List creation failed');

			const connected = await dependencies.listRepository.connectToUser({
				listId: created.value.id,
				userId
			});

			if (connected.success === false) throw new Error('List connection failed');

			const result = await supertest(app)
				.get(`/api/list/`)
				.set('Authorization', 'Bearer ' + createJwtDummy(userId))
				.expect(200);

			const parsed = getListDetailsArrayResponseSchema.safeParse(JSON.parse(result.text));

			if (parsed.success === false) throw new Error('List response parsing failed');

			expect(parsed.data.length).toEqual(1);
			expect(parsed.data[0].id).toEqual(created.value.id);
			expect(parsed.data[0].name).toEqual(created.value.name);
			expect(parsed.data[0].description).toEqual(created.value.description);
		});

		it('should not work for unconnected user', async () => {
			const userId = 'USER' + dependencies.idGenerator.generate();
			const created = await dependencies.listRepository.create({
				name: 'testName',
				description: 'testDescription',
				itemIds: []
			});
			if (created.success === false) throw new Error('List creation failed');

			const result = await supertest(app)
				.get(`/api/list/${created.value.id}`)
				.set('Authorization', 'Bearer ' + createJwtDummy(userId))
				.expect(403);
		});
	});

	describe('list endpoint api/list POST', async () => {
		it('should get a 401 without authorization', async () => {
			await supertest(app).post('/api/list').expect(401);
		});

		it('should get an error without userId in token', async () => {
			await supertest(app)
				.post('/api/list')
				.set('Authorization', 'Bearer ' + createJwtDummy(undefined))
				.expect(400);
		});

		it('should get an error without name', async () => {
			type CreateListRequestWithutName = Omit<CreateListRequest, 'name'>;
			const body: CreateListRequestWithutName = { description: 'testDescription', itemIds: [] };
			const result = await supertest(app)
				.post('/api/list')
				.set('Authorization', 'Bearer ' + createJwtDummy('UserId123'))
				.send(body)
				.expect(400);
			expect(result.text).toContain('name');
		});

		it('should work', async () => {
			const result = await supertest(app)
				.post('/api/list')
				.set('Authorization', 'Bearer ' + createJwtDummy('UserId123'))
				.send({ name: 'testName', description: 'testDescription', itemIds: [] })
				.expect(200);
			expect(result.text).toContain('name":"testName');
			expect(result.text).toContain('description":"testDescription');
		});
	});
});
