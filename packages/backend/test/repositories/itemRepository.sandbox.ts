import ksuid from 'ksuid';
import { describe, expect, it } from 'vitest';
import { KsuidGenerator } from '../../../shared/src/adapter/idGenerator';
import { ItemRepositoryAmpt } from '../../src/adapter/ampt/data/ItemRepositoryAmpt';

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
});
