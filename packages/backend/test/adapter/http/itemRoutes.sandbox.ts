import supertest from 'supertest';
import { describe, expect, it } from 'vitest';
import { getListDetailsArrayResponseSchema } from '../../../../shared/src/definitions/communication/getListDetailsRequestResponse';
import { CreateItemRequest } from '../../../../shared/src/definitions/communication/itemRequestResponses';
import { createApp } from '../../../src/adapter/http/createExpressApp';
import { Dependencies } from '../../../src/domain/definitions/dependencies';
import { CreateItemForListUsecase } from '../../../src/domain/usecases/items/createItemForListUsecase';
import { getDependencies } from '../../../src/stageDependencies';
import { createJwtDummy } from '../../util/jwt';

async function createListAndUser(
	dependencies: Dependencies
): Promise<{ userId: string; listId: string }> {
	const userId = 'USER' + dependencies.idGenerator.generate();
	const listResult = await dependencies.listRepository.create({
		itemIds: [],
		name: 'dummy item',
		description: 'dummy description'
	});
	if (listResult.success === false) throw new Error('List creation failed');
	return { userId, listId: listResult.value.id };
}

async function createListAndConnectToUser(
	dependencies: Dependencies
): Promise<{ userId: string; listId: string }> {
	const { userId, listId } = await createListAndUser(dependencies);

	const connectResult = await dependencies.listRepository.connectToUser({
		listId,
		userId
	});
	if (connectResult.success === false) throw new Error('List connection failed');
	return { userId, listId };
}

async function createListAndItemWithConnectionsToUser(input: {
	dependencies: Dependencies;
}): Promise<{ userId: string; listId: string; itemId: string }> {
	const { userId, listId, itemIds } = await createListAndItemsWithConnectionsToUser({
		dependencies: input.dependencies,
		itemCount: 1
	});

	return { userId, listId, itemId: itemIds[0] };
}

async function createListAndItemsWithConnectionsToUser(input: {
	dependencies: Dependencies;
	itemCount: number;
}): Promise<{ userId: string; listId: string; itemIds: string[] }> {
	const { dependencies } = input;

	const { userId, listId } = await createListAndConnectToUser(dependencies);

	const itemIds: string[] = [];
	for (let i = 0; i < input.itemCount; i++) {
		const createResult = await new CreateItemForListUsecase(
			dependencies.itemRepository,
			dependencies.listRepository
		).execute({
			itemName: 'item name ' + i,
			listId,
			userId,
			itemDescription: 'test description ' + i
		});

		if (createResult.success === false) throw new Error('Item creation failed');
		itemIds.push(createResult.value.item.id);
	}

	return { userId, listId, itemIds };
}

describe.concurrent('item enppoints', async () => {
	const dependencies = getDependencies('test');
	const app = await createApp(dependencies);

	describe('list endpoint api/item/:itemId GET', async () => {
		it('should get a 401 without authorization', async () => {
			await supertest(app).get('/api/item/some-id').expect(401);
		});

		it('should work for connected user', async () => {
			const { userId, itemId } = await createListAndItemWithConnectionsToUser({
				dependencies
			});
			const result = await supertest(app)
				.get(`/api/item/${itemId}`)
				.set('Authorization', 'Bearer ' + createJwtDummy(userId))
				.expect(200);
		});
	});

	describe('list endpoint api/list GET', async () => {
		it('should get a 401 without authorization', async () => {
			await supertest(app).get('/api/list/someId/items').expect(401);
		});

		it('should work for list with 2 items connected to user', async () => {
			const { userId, listId, itemIds } = await createListAndItemsWithConnectionsToUser({
				dependencies,
				itemCount: 2
			});

			const result = await supertest(app)
				.get(`/api/list/${listId}/items`)
				.set('Authorization', 'Bearer ' + createJwtDummy(userId))
				.expect(200);

			const parsed = getListDetailsArrayResponseSchema.safeParse(JSON.parse(result.text));

			if (parsed.success === false) throw new Error('List response parsing failed');

			expect(parsed.data.length).toEqual(2);
			expect(itemIds).toContain(parsed.data[0].id);
			expect(itemIds).toContain(parsed.data[1].id);
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
				.get(`/api/list/${created.value.id}/items`)
				.set('Authorization', 'Bearer ' + createJwtDummy(userId))
				.expect(403);
		});
	});

	describe('list endpoint api/item POST', async () => {
		it('should get a 401 without authorization', async () => {
			await supertest(app).post('/api/item').expect(401);
		});

		it('should get an error without userId in token', async () => {
			await supertest(app)
				.post('/api/item')
				.set('Authorization', 'Bearer ' + createJwtDummy(undefined))
				.expect(400);
		});

		it('should get an error without name', async () => {
			type CreateItemRequestWithout = Omit<CreateItemRequest, 'name'>;
			const body: CreateItemRequestWithout = { description: 'testDescription', listId: '123' };
			const result = await supertest(app)
				.post('/api/item')
				.set('Authorization', 'Bearer ' + createJwtDummy('UserId123'))
				.send(body)
				.expect(400);
			expect(result.text).toContain('name');
		});
		it('should get an error without listId', async () => {
			type CreateItemRequestWithout = Omit<CreateItemRequest, 'listId'>;
			const body: CreateItemRequestWithout = { description: 'testDescription', name: '123' };
			const result = await supertest(app)
				.post('/api/item')
				.set('Authorization', 'Bearer ' + createJwtDummy('UserId123'))
				.send(body)
				.expect(400);
			expect(result.text).toContain('listId');
		});

		it('should not work for unconnected listId', async () => {
			const { userId, listId } = await createListAndConnectToUser(dependencies);

			const body: CreateItemRequest = {
				description: 'testDescription',
				name: '123',
				listId: listId + 'jibberish'
			};
			const result = await supertest(app)
				.post('/api/item')
				.set('Authorization', 'Bearer ' + createJwtDummy(userId))
				.send(body)
				.expect(403);
		});
		it('should not work for wrong userId', async () => {
			const { userId, listId } = await createListAndConnectToUser(dependencies);

			const body: CreateItemRequest = {
				description: 'testDescription',
				name: '123',
				listId: listId
			};
			const result = await supertest(app)
				.post('/api/item')
				.set('Authorization', 'Bearer ' + createJwtDummy(userId + 'jibberish'))
				.send(body)
				.expect(403);
		});
		it('should work', async () => {
			const { userId, listId } = await createListAndConnectToUser(dependencies);

			const body: CreateItemRequest = {
				description: 'testDescription',
				name: '123',
				listId: listId
			};
			const result = await supertest(app)
				.post('/api/item')
				.set('Authorization', 'Bearer ' + createJwtDummy(userId))
				.send(body)
				.expect(200);
		});
	});
});