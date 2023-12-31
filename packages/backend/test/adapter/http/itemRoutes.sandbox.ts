import supertest from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../../../src/adapter/http/createExpressApp';
import { Dependencies } from '../../../src/domain/definitions/dependencies';
import { CreateItemForListUsecase } from '../../../src/domain/usecases/items/createItemForListUsecase';

import { getListDetailsArrayResponseSchema } from '../../../src/domain/definitions/communication/getListDetailsRequestResponse';
import {
	CreateItemRequest,
	UpdateItemRequest
} from '../../../src/domain/definitions/communication/itemRequestResponses';
import { ItemPink } from '../../../src/domain/definitions/itemPink';
import { createListPink } from '../../../src/domain/definitions/listPink';
import { createJwtDummy } from '../../util/jwt';
import { getTestDependencies } from '../testDependencies';

async function createListAndUser(
	dependencies: Dependencies
): Promise<{ userId: string; listId: string }> {
	const user = await dependencies.userRepository.createUser({
		displayName: `dummy-${dependencies.idGenerator.generate()}`
	});

	if (user.success === false) throw new Error('User creation failed');

	const userId = user.value.id;
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
}): Promise<{ userId: string; listId: string; itemId: string; item: ItemPink }> {
	const { userId, listId, itemIds, items } = await createListAndItemsWithConnectionsToUser({
		dependencies: input.dependencies,
		itemCount: 1
	});

	return { userId, listId, itemId: itemIds[0], item: items[0] };
}

async function createListAndItemsWithConnectionsToUser(input: {
	dependencies: Dependencies;
	itemCount: number;
}): Promise<{ userId: string; listId: string; itemIds: string[]; items: ItemPink[] }> {
	const { dependencies } = input;

	const { userId, listId } = await createListAndConnectToUser(dependencies);

	const itemIds: string[] = [];
	const items: ItemPink[] = [];
	for (let i = 0; i < input.itemCount; i++) {
		const createResult = await new CreateItemForListUsecase(
			dependencies.itemRepository,
			dependencies.listRepository
		).execute({
			itemName: 'item name ' + i,
			listId,
			userId,
			itemDescription: 'test description ' + i,
			priority: 0
		});

		if (createResult.success === false) throw new Error('Item creation failed');
		itemIds.push(createResult.value.item.id);
		items.push(createResult.value.item);
	}

	return { userId, listId, itemIds, items };
}

describe.concurrent('item enppoints', async () => {
	const dependencies = getTestDependencies('integration');
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
			const userId = dependencies.idGenerator.generate();
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
			const body: CreateItemRequestWithout = {
				description: 'testDescription',
				listId: '123',
				priority: 0
			};
			const result = await supertest(app)
				.post('/api/item')
				.set('Authorization', 'Bearer ' + createJwtDummy('UserId123'))
				.send(body)
				.expect(400);
			expect(result.text).toContain('name');
		});
		it('should get an error without listId', async () => {
			type CreateItemRequestWithout = Omit<CreateItemRequest, 'listId'>;
			const body: CreateItemRequestWithout = {
				description: 'testDescription',
				name: '123',
				priority: 0
			};
			const result = await supertest(app)
				.post('/api/item')
				.set('Authorization', 'Bearer ' + createJwtDummy('UserId123'))
				.send(body)
				.expect(400);
			expect(result.text).toContain('listId');
		});

		it('should not work for unconnected listId', async () => {
			const { userId, listId } = await createListAndConnectToUser(dependencies);
			const unconnectedList = await createListPink('dummy', () =>
				dependencies.idGenerator.generate()
			);
			const body: CreateItemRequest = {
				description: 'testDescription',
				name: '123',
				listId: unconnectedList.id,
				priority: 0
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
				listId: listId,
				priority: 0
			};
			const result = await supertest(app)
				.post('/api/item')
				.set('Authorization', 'Bearer ' + createJwtDummy(dependencies.idGenerator.generate()))
				.send(body)
				.expect(403);
		});
		it('should work', async () => {
			const { userId, listId } = await createListAndConnectToUser(dependencies);

			const body: CreateItemRequest = {
				description: 'testDescription',
				name: '123',
				priority: 0,
				listId: listId
			};
			const result = await supertest(app)
				.post('/api/item')
				.set('Authorization', 'Bearer ' + createJwtDummy(userId))
				.send(body)
				.expect(200);
		});
	});
	describe('update item', () => {
		it('should get a 401 without authorization', async () => {
			const { itemId, listId } = await createListAndItemWithConnectionsToUser({
				dependencies
			});
			await supertest(app).put(`/api/list/${listId}/item/${itemId}`).expect(401);
		});

		it('update completed only', async () => {
			const { userId, itemId, listId, item } = await createListAndItemWithConnectionsToUser({
				dependencies
			});

			const completedTime = new Date().toISOString();
			const body: UpdateItemRequest = { completed: completedTime, priority: 0 };

			const result = await supertest(app)
				.put(`/api/list/${listId}/item/${itemId}`)
				.set('Authorization', 'Bearer ' + createJwtDummy(userId))
				.send(body)
				.expect(200);
			console.log(result.text);

			// wait 1 sec
			await new Promise((resolve) => setTimeout(resolve, 1000));
			const loadedItem = await dependencies.itemRepository.getItem(itemId);
			console.log(JSON.stringify(loadedItem, null, 2));
			if (loadedItem.success === false) throw new Error('Item loading failed');

			expect(loadedItem.value?.completed).toEqual(completedTime);
			expect(loadedItem.value?.name).toEqual(item.name);
		});
	});
});
