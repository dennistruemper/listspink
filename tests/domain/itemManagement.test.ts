import { describe, expect, it } from 'vitest';
import { UuidGenerator } from '../../src/adapter/uuid';
import { initialAppState } from '../../src/domain/definitions/appState';
import { createListPink } from '../../src/domain/definitions/listPink';
import { createUpdateFunction } from '../../src/domain/updateAppState';
import { defaultTestDependencies } from '../testDependencies';

describe('itemManagement', () => {
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

	it('add item but to no lits', () => {
		const state = initialAppState(defaultTestDependencies);
		const newState = updateAppState(state, {
			type: 'create_item_and_add_to_lists',
			name: 'new item',
			listIds: []
		});

		expect(newState.items.length).toBe(2);
		expect(newState.items[1].name).toBe('new item');
	});

	it('add item to first and third lists', () => {
		const state = stateWith3Lists();
		const newState = updateAppState(state, {
			type: 'create_item_and_add_to_lists',
			name: 'new item',
			listIds: [state.lists[0].id, state.lists[2].id]
		});

		expect(newState.items.length).toBe(2);

		const newItemId = newState.items[1].id;
		expect(newState.lists[0].itemIds).to.include(newItemId);
		expect(newState.lists[1].itemIds).to.not.include(newItemId);
		expect(newState.lists[2].itemIds).to.include(newItemId);
	});

	it('create and add item to current list', () => {
		const state = stateWith3Lists();
		const newState = updateAppState(state, {
			type: 'create_item_and_add_to_lists',
			name: 'new item',
			listIds: [state.currentList?.id ?? '']
		});

		const newItemId = newState.items[1].id;
		expect(newState.currentList?.items.map((item) => item.id)).to.include(newItemId);
	});

	it('add item to current list', () => {
		const state = stateWith3Lists();
		const newState = updateAppState(state, {
			type: 'add_item_to_list_event',
			itemId: state.items[0].id,
			listId: state.lists[2].id
		});

		expect(newState.lists[2].itemIds).to.include(state.items[0].id);
	});

	it('toggle item completed state to done', () => {
		const now = new Date();
		const state = initialAppState(defaultTestDependencies);
		const newState = updateAppState(state, {
			type: 'toggle_item_done_event',
			itemId: state.items[0].id,
			time: now
		});

		expect(newState.items[0].completed).toBe(now.toISOString());
	});

	it('toggle item completed state to undone', () => {
		const now = new Date();
		const state = initialAppState(defaultTestDependencies);
		state.items[0].completed = now.toISOString();
		const newState = updateAppState(state, {
			type: 'toggle_item_done_event',
			itemId: state.items[0].id,
			time: now
		});

		expect(newState.items[0].completed).toBe(undefined);
	});
});
