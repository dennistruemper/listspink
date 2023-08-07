import { describe, expect, it } from 'vitest';
import { UuidGenerator } from '../../src/adapter/uuid';
import { initialAppState } from '../../src/domain/definitions/appState';
import { createListPink } from '../../src/domain/definitions/listPink';
import { createUpdateFunction } from '../../src/domain/updateAppState';
import { defaultTestDependencies } from '../testDependencies';

describe('listManagement', () => {
	const updateAppState = createUpdateFunction(defaultTestDependencies);

	const stateWith3Lists = () => {
		const initialState = initialAppState(defaultTestDependencies);
		return {
			...initialState,
			lists: [
				...initialState.lists,
				createListPink('list1', UuidGenerator.v4),
				createListPink('list2', UuidGenerator.v4)
			]
		};
	};

	it('new state has one default list', () => {
		const state = initialAppState(defaultTestDependencies);

		expect(state.lists.length).toBe(1);
		expect(state.lists[0].name).toBe('Pink List');
	});

	it('add list to new state', () => {
		const state = initialAppState(defaultTestDependencies);
		const newState = updateAppState(state, { type: 'create_list', name: 'listName' });

		expect(newState.lists.length).toBe(2);
		expect(newState.lists[1].name).toBe('listName');
	});

	it('add list to exiting lists', () => {
		const state = stateWith3Lists();
		const newState = updateAppState(state, { type: 'create_list', name: 'list4' });

		expect(newState.lists.length).toBe(4);
		expect(newState.lists[0].name).toBe('Pink List');
		expect(newState.lists[3].name).toBe('list4');
	});

	it('remove list with id matching first list', () => {
		const state = stateWith3Lists();

		const newState = updateAppState(state, { type: 'remove_list', listId: state.lists[0].id });

		expect(2).toBe(newState.lists.length);
	});

	it('remove list with id matching second list does not chang current list', () => {
		const state = stateWith3Lists();

		const newState = updateAppState(state, { type: 'remove_list', listId: state.lists[1].id });

		expect(state.currentList).toBe(newState.currentList);
	});

	it('remove current list will have no current list', () => {
		const state = stateWith3Lists();

		// it is ok, we know that there is a current list in this test
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
		const newState = updateAppState(state, { type: 'remove_list', listId: state.currentList?.id! });

		expect(newState.currentList).toBeUndefined();
	});

	it('default active List is first list', () => {
		const state = initialAppState(defaultTestDependencies);

		expect(state.lists.length).toBe(1);
		expect(state.lists[0].id).toBe(state.currentList?.id);
	});

	it('choose an other list', () => {
		const state = stateWith3Lists();
		const listToBeChoosen = state.lists[2];

		const newState = updateAppState(state, {
			type: 'choose_list_by_id',
			listId: listToBeChoosen.id
		});

		expect(listToBeChoosen.id).toBe(newState.currentList?.id);
	});

	it('edit a list', () => {
		const state = stateWith3Lists();
		const listToBeEdited = state.lists[2];

		const newState = updateAppState(state, {
			type: 'edit_list',
			listId: listToBeEdited.id,
			name: 'newName'
		});

		expect(newState.lists[2].name).toBe('newName');
	});

	it('edit the current list will change current lists name', () => {
		const state = stateWith3Lists();
		const listToBeEdited = state.currentList!;

		const newState = updateAppState(state, {
			type: 'edit_list',
			listId: listToBeEdited.id,
			name: 'newName'
		});

		expect(newState.currentList?.name).toBe('newName');
	});

	it('edit an item', () => {
		const state = stateWith3Lists();
		const itemToBeEdited = state.items[0];

		const newState = updateAppState(state, {
			type: 'edit_item',
			itemId: itemToBeEdited.id,
			name: 'newName'
		});

		expect(newState.items[0].name).toBe('newName');
	});
	it('edit an item will change current list', () => {
		const state = stateWith3Lists();
		const itemToBeEdited = state.items[0];

		const newState = updateAppState(state, {
			type: 'edit_item',
			itemId: itemToBeEdited.id,
			name: 'newName'
		});

		expect(newState.currentList?.activeItems[0].name).toBe('newName');
	});
});
