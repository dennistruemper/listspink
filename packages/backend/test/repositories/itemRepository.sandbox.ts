import { describe, expect, it } from 'vitest';
import { ItemRepositoryAmptSql } from '../../src/adapter/ampt/sql/itemRepositoryAmptSql';
import { ListRepositoryAmptSql } from '../../src/adapter/ampt/sql/listRepositoryAmptSql';
import { UuidGenerator } from '../../src/adapter/ampt/util/uuidGenerator';

describe('ItemRepository', () => {
	const repository = new ItemRepositoryAmptSql();
	const listRepository = new ListRepositoryAmptSql();
	const uuidGenerator = new UuidGenerator();

	it('should return created item', async () => {
		const list = await listRepository.create({ name: 'test', description: null, itemIds: [] });
		if (list.success === false) throw new Error('List creation failed');

		const item = { name: 'test', description: 'test', listId: list.value.id, completed: null };
		const created = await repository.create(item);
		if (created.success === false) throw new Error('Item creation failed');

		const result = await repository.getItem(created.value.id);
		if (result.success === false) throw new Error('Item not found');

		expect(result.value?.listId).toEqual(item.listId);
		expect(result.value?.description).toEqual(item.description);
		expect(result.value?.id).toBeDefined();
		expect(result.value?.name).toEqual(item.name);
		expect(result.value?.priority).toEqual(0);
		expect(result.value?.completed).toBeNull();
	});
	it('should create id for item without id', async () => {
		const list = await listRepository.create({ name: 'test', description: null, itemIds: [] });
		if (list.success === false) throw new Error('List creation failed');

		const item = { name: 'test', description: null, listId: list.value.id, completed: null };
		const created = await repository.create(item);
		if (created.success === false) throw new Error('Item creation failed');

		const result = await repository.getItem(created.value.id);
		if (result.success === false) throw new Error('Item not found');

		expect(result.value?.name).toEqual(item.name);
		expect(result.value?.id).toBeDefined();
	});
	it('should return undefined for non existing item', async () => {
		const result = await repository.getItem(uuidGenerator.generate());
		if (result.success === false) throw new Error('Item not found');

		expect(result.value).toBeUndefined();
	});
	it('should return one more item after item is inserted', async () => {
		const allBefore = await repository.getAllItems();
		const list = await listRepository.create({ name: 'test', description: null, itemIds: [] });
		if (list.success === false) throw new Error('List creation failed');

		const item = { name: 'test', description: null, listId: list.value.id, completed: null };
		if (allBefore.success === false) throw new Error('Items not found');

		const itemsContStart = allBefore.value.length;

		await repository.create(item);

		const allAfter = await repository.getAllItems();
		if (allAfter.success === false) throw new Error('Items not found');

		const itemsContEnd = allAfter.value.length;
		expect(itemsContEnd).toBeGreaterThan(itemsContStart);
	});

	describe('update item', () => {
		it('update name and nothing else', async () => {
			const list = await listRepository.create({ name: 'test', description: null, itemIds: [] });
			if (list.success === false) throw new Error('List creation failed');

			const item = { name: 'test', description: null, listId: list.value.id, completed: null };
			const itemResult = await repository.create(item);

			if (itemResult.success === false)
				throw new Error('Could not create item: ' + itemResult.message);

			const updatedResult = await repository.update({
				itemId: itemResult.value.id,
				updatedFields: { name: 'newName' }
			});

			if (updatedResult.success === false)
				throw new Error('Could not update item: ' + updatedResult.message);

			const loadedItemResult = await repository.getItem(itemResult.value.id);
			if (loadedItemResult.success === false)
				throw new Error('Could not load item: ' + loadedItemResult.message);

			expect(loadedItemResult.value?.name).toEqual('newName');
			expect(loadedItemResult.value?.description).toEqual(null);
		});
		it('update completed and nothing else', async () => {
			const list = await listRepository.create({ name: 'test', description: null, itemIds: [] });
			if (list.success === false) throw new Error('List creation failed');

			const item = { name: 'test', description: null, listId: list.value.id, completed: null };
			const itemResult = await repository.create(item);

			if (itemResult.success === false)
				throw new Error('Could not create item: ' + itemResult.message);

			const completedValue = new Date().toISOString();

			const updatedResult = await repository.update({
				itemId: itemResult.value.id,
				updatedFields: { completed: completedValue }
			});

			if (updatedResult.success === false)
				throw new Error('Could not update item: ' + updatedResult.message);

			const loadedItemResult = await repository.getItem(itemResult.value.id);
			if (loadedItemResult.success === false)
				throw new Error('Could not load item: ' + loadedItemResult.message);

			expect(loadedItemResult.value?.name).toEqual('test');
			expect(loadedItemResult.value?.completed).toEqual(completedValue);
		});
	});
});
