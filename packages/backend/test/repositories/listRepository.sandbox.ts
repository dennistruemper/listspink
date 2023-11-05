import ksuid from 'ksuid';
import { describe, expect, it } from 'vitest';
import { DATA_MISSING_CODE } from '../../src/domain/definitions/errorCodes';
import { getTestDependencies } from '../adapter/testDependencies';

describe('ListRepository', () => {
	const deps = getTestDependencies('integration');
	const repository = deps.listRepository;
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
		expect(listsCountEnd).toBeGreaterThan(listsCountStart);
	});

	it('should have an error if list is missing', async () => {
		const result = await repository.connectToUser({
			userId: 'dummy' + deps.idGenerator.generate(),
			listId: 'dummy' + deps.idGenerator.generate()
		});
		if (result.success === true) throw new Error('List should not be connected');

		expect(false).toEqual(result.success);
		expect(result.code).toEqual(DATA_MISSING_CODE);
		expect(result.message).toContain('List for id ');
	});

	describe('connect list(s) to user', async () => {
		const list1 = await repository.create({
			name: 'list1' + deps.idGenerator.generate(),
			itemIds: [],
			description: 'description 1'
		});
		const list2 = await repository.create({
			name: 'list2' + deps.idGenerator.generate(),
			itemIds: [],
			description: 'description 2'
		});

		if (list1.success === false || list2.success === false) throw new Error('List creation failed');

		it('should connect list to user', async () => {
			const userId = 'dummy' + deps.idGenerator.generate();

			const result = await repository.connectToUser({
				userId: userId,
				listId: list1.value.id
			});

			if (result.success === false) throw new Error('List should be connected');

			const listDetails = await repository.getListsDetailsForUser(userId);

			if (listDetails.success === false)
				throw new Error('Coluld not get lists for user' + listDetails.message);

			expect(listDetails.value.length).toEqual(1);
			expect(listDetails.value[0].id).toEqual(list1.value.id);
			expect(listDetails.value[0].name).toEqual(list1.value.name);
			expect(listDetails.value[0].description).toEqual(list1.value.description);
		});

		it('should connect 2 list to user and get both', async () => {
			const userId = 'dummy' + deps.idGenerator.generate();

			const result1 = await repository.connectToUser({
				userId: userId,
				listId: list1.value.id
			});

			if (result1.success === false) throw new Error('List should be connected');

			const result2 = await repository.connectToUser({
				userId: userId,
				listId: list2.value.id
			});

			if (result2.success === false) throw new Error('List should be connected');

			const listDetails = await repository.getListsDetailsForUser(userId);

			if (listDetails.success === false)
				throw new Error('Coluld not get lists for user' + listDetails.message);

			expect(listDetails.value.length).toEqual(2);
			expect(listDetails.value[0].id).toEqual(list1.value.id);
			expect(listDetails.value[0].name).toEqual(list1.value.name);
			expect(listDetails.value[0].description).toEqual(list1.value.description);
			expect(listDetails.value[1].id).toEqual(list2.value.id);
			expect(listDetails.value[1].name).toEqual(list2.value.name);
			expect(listDetails.value[1].description).toEqual(list2.value.description);
		});
	});
});
