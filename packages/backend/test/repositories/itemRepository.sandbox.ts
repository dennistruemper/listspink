import ksuid from 'ksuid';
import { describe, expect, it } from 'vitest';
import { ItemRepositoryAmpt } from '../../src/adapter/ampt/data/itemRepositoryAmpt';
import { KsuidGenerator } from '../../src/adapter/idGenerator';

describe('ItemRepository', () => {
	const repository = new ItemRepositoryAmpt(new KsuidGenerator());
	it('should return created item', async () => {
		const item = { id: '1', name: 'test' };
		const created = await repository.create(item);
		if (created.success === false) throw new Error('Item creation failed');

		const result = await repository.getItem(created.value.id);
		if (result.success === false) throw new Error('Item not found');

		expect(result.value).toEqual(item);
	});
	it('should create id for item without id', async () => {
		const item = { id: undefined, name: 'test' };
		const created = await repository.create(item);
		if (created.success === false) throw new Error('Item creation failed');

		const result = await repository.getItem(created.value.id);
		if (result.success === false) throw new Error('Item not found');

		expect(result.value?.name).toEqual(item.name);
		expect(result.value?.id).toBeDefined();
		expect(ksuid.parse(result.value?.id ?? '')).toBeTruthy();
	});
	it('should return undefined for non existing item', async () => {
		const result = await repository.getItem('dummy_aieunaeiei');
		if (result.success === false) throw new Error('Item not found');

		expect(result.value).toBeUndefined();
	});
	it('should return one more item after item is inserted', async () => {
		const allBefore = await repository.getAllItems();
		if (allBefore.success === false) throw new Error('Items not found');

		const itemsContStart = allBefore.value.length;

		await repository.create({ name: 'test' });

		const allAfter = await repository.getAllItems();
		if (allAfter.success === false) throw new Error('Items not found');

		const itemsContEnd = allAfter.value.length;
		expect(itemsContEnd).toBeGreaterThan(itemsContStart);
		console.log(itemsContEnd);
	});

	describe('update item', () => {
		it('update name and nothing else', async () => {
			const itemResult = await repository.create({ name: 'test' });

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
			expect(loadedItemResult.value?.description).toEqual(undefined);
		});
		it('update completed and nothing else', async () => {
			const itemResult = await repository.create({ name: 'test' });

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
			console.log(JSON.stringify(loadedItemResult, null, 2));
			if (loadedItemResult.success === false)
				throw new Error('Could not load item: ' + loadedItemResult.message);

			expect(loadedItemResult.value?.name).toEqual('test');
			expect(loadedItemResult.value?.completed).toEqual(completedValue);
		});
	});
});
