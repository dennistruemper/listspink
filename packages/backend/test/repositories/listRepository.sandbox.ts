import ksuid from 'ksuid';
import { describe, expect, it } from 'vitest';
import { KsuidGenerator } from '../../../shared/src/adapter/idGenerator';
import { ListRepositoryAmpt } from '../../src/adapter/ampt/data/ListRepositoryAmpt';

describe('ListRepository', () => {
	const repository = new ListRepositoryAmpt(new KsuidGenerator());
	it('should return created list', async () => {
		const list = { id: 'dummy', name: 'test', itemIds: [] };
		const created = await repository.create(list);

		if (created.success === false) throw new Error('List creation failed');

		const result = await repository.getList(created.value.id ?? 'dummy');

		if (result.success === false) throw new Error('List not found');

		expect(result.value).toEqual(list);
	});

	it('should create id for list without id', async () => {
		const list = { name: 'test', itemIds: [] };
		const created = await repository.create(list);

		if (created.success === false) throw new Error('List creation failed');

		const result = await repository.getList(created.value.id ?? 'dummy');

		if (result.success === false) throw new Error('List not found');

		expect(result.value?.name).toEqual(list.name);
		expect(result.value?.id).toBeDefined();
		expect(ksuid.parse(result.value?.id ?? '')).toBeTruthy();
	});

	it('should return undefined for non existing list', async () => {
		const result = await repository.getList('dummy_aieunaeiei');

		if (result.success === false) throw new Error('List not found');

		expect(result.value).toBeUndefined();
	});

	it('should return one more list after list is inserted', async () => {
		const listsBeforeResult = await repository.getAllLists();

		if (listsBeforeResult.success === false) throw new Error('List not got');

		const listsCountStart = listsBeforeResult.value.length ?? 0;

		await repository.create({ name: 'test', itemIds: [] });

		const listsAfterResult = await repository.getAllLists();
		if (listsAfterResult.success === false) throw new Error('List not got');

		const listsCountEnd = listsAfterResult.value.length ?? 0;
		expect(listsCountEnd).toEqual(listsCountStart + 1);
	});
});
