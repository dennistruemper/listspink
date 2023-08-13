import ksuid from 'ksuid';
import { describe, expect, it } from 'vitest';
import { KsuidGenerator } from '../../../shared/src/adapter/idGenerator';
import { ItemRepositoryAmpt } from '../../src/adapter/ampt/data/ItemRepositoryAmpt';

describe('ItemRepository', () => {
	const repository = new ItemRepositoryAmpt(new KsuidGenerator());
	it('should return created item', async () => {
		const item = { id: '1', name: 'test' };
		const created = await repository.create(item);
		expect(created).toBeDefined();
		const result = await repository.getItem(created?.id ?? 'dummy');
		expect(result).toEqual(item);
	});
	it('should create id for item without id', async () => {
		const item = { id: undefined, name: 'test' };
		const created = await repository.create(item);
		expect(created).toBeDefined();
		const result = await repository.getItem(created?.id ?? 'dummy');
		expect(result?.name).toEqual(item.name);
		expect(result?.id).toBeDefined();
		expect(ksuid.parse(result?.id ?? '')).toBeTruthy();
	});
	it('should return undefined for non existing item', async () => {
		const result = await repository.getItem('dummy_aieunaeiei');
		expect(result).toBeUndefined();
	});
	it('should return one more item after item is inserted', async () => {
		const itemsContStart = (await repository.getAllItems())?.length ?? 0;
		await repository.create({ name: 'test' });
		const itemsContEnd = (await repository.getAllItems())?.length ?? 0;
		expect(itemsContEnd).toEqual(itemsContStart + 1);
		console.log(itemsContEnd);
	});
});
