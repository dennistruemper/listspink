import ksuid from 'ksuid';
import { describe, expect, it } from 'vitest';
import { KsuidGenerator } from '../../../shared/src/adapter/idGenerator';
import { ListRepositoryAmpt } from '../../src/adapter/ampt/data/ListRepositoryAmpt';

describe('ListRepository', () => {
	const repository = new ListRepositoryAmpt(new KsuidGenerator());
	it('should return created list', async () => {
		const list = { id: 'dummy', name: 'test', itemIds: [] };
		const created = await repository.create(list);
		expect(created).toBeDefined();
		const result = await repository.getList(created?.id ?? 'dummy');
		expect(result).toEqual(list);
	});
	it('should create id for list without id', async () => {
		const list = { name: 'test', itemIds: [] };
		const created = await repository.create(list);
		expect(created).toBeDefined();
		const result = await repository.getList(created?.id ?? 'dummy');
		expect(result?.name).toEqual(list.name);
		expect(result?.id).toBeDefined();
		expect(ksuid.parse(result?.id ?? '')).toBeTruthy();
	});
	it('should return undefined for non existing list', async () => {
		const result = await repository.getList('dummy_aieunaeiei');
		expect(result).toBeUndefined();
	});
	it('should return one more list after list is inserted', async () => {
		const listsContStart = (await repository.getAllLists())?.length ?? 0;
		await repository.create({ name: 'test', itemIds: [] });
		const listsContEnd = (await repository.getAllLists())?.length ?? 0;
		expect(listsContEnd).toEqual(listsContStart + 1);
		console.log(listsContEnd);
	});
});
