import { PUBLIC_DEV } from '$env/static/public';
import { writable } from 'svelte/store';

// time travel store definition

interface TimeTravelStore<T> {
	version: number;
	history: T[];
	current: T;
	debugMode: boolean;
}

function logDev<T>(store: TimeTravelStore<T>) {
	if (store.debugMode === true) {
		console.log(store);
	}
}

export function createTimetraveStore<Model, Event>(
	updateModel: (model: Model, event: Event) => Model,
	init: Model
) {
	const initialData: TimeTravelStore<Model> = {
		version: 0,
		history: [init],
		current: init,
		debugMode: PUBLIC_DEV === 'true'
	};

	console.log(PUBLIC_DEV + 'droch');

	const { subscribe, set, update } = writable(initialData);

	return {
		subscribe,
		dispatch: (event: Event) =>
			update((store) => {
				console.log('dispatch');
				// create new future if event occures in history
				if (store.version === store.history.length - 1) {
					//append to history
					const newState = updateModel(store.current, event);
					const newHistory = [...store.history, newState];
					const newIndex = store.version + 1;
					const newValue = {
						version: newIndex,
						current: newState,
						history: newHistory,
						debugMode: store.debugMode
					};
					console.log(JSON.stringify(newValue));
					return newValue;
				} else {
					// delete newer states and start new future
					const newState = updateModel(store.current, event);
					const remainingHistory = store.history.slice(0, store.version);
					const newHistory = [...remainingHistory, newState];
					const newIndex = store.version + 1;
					const newValue = {
						version: newIndex,
						current: newState,
						history: newHistory,
						debugMode: store.debugMode
					};
					console.log(JSON.stringify(newValue));
					return newValue;
				}
			}),

		setVersion: (version: number) => {
			update((store) => {
				console.log('set version');
				// ignore wrong input
				if (version < 0 || version >= store.history.length) {
					console.log(`verison out of range ${version}`);
					return store;
				}

				const newState = {
					history: store.history,
					current: store.history[version],
					version: version,
					debugMode: store.debugMode
				};
				console.log(JSON.stringify(newState));
				return newState;
			});
		},
		toggleDebugMode: () => {
			update((store) => {
				const newValue = { ...store, debugMode: !store.debugMode };
				logDev(newValue);
				return newValue;
			});
		}
	};
}
