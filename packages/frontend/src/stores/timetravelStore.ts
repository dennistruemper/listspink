import { writable } from 'svelte/store';

// time travel store definition

export interface TimeTravelStore<T> {
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

export interface TimeTravelStorage<T> {
	save: (data: T) => void;
	load: () => T | undefined;
}

export async function createTimetraveStore<Model, Event>(
	updateModel: (model: Model, event: Event) => Promise<Model>,
	init: () => Promise<Model>,
	storage?: TimeTravelStorage<TimeTravelStore<Model>>
) {
	async function initialData(): Promise<TimeTravelStore<Model>> {
		const initial = await init();
		return {
			version: 0,
			history: [initial],
			current: initial,
			debugMode: false
		};
	}

	const loadedData = storage?.load() ?? (await initialData());

	const { subscribe, set, update } = writable(loadedData ?? (await initialData()));

	subscribe(async (data) => {
		storage?.save(await data);
	});

	return {
		subscribe,
		dispatch: (event: Event) =>
			update((store) => {
				// create new future if event occures in history
				if (store.version === store.history.length - 1) {
					//append to history
					updateModel(store.current, event).then((newState) => {
						const newHistory = [...store.history, newState];
						const newIndex = store.version + 1;
						const newValue = {
							version: newIndex,
							current: newState,
							history: newHistory,
							debugMode: store.debugMode
						};
						logDev(newValue);
						set(newValue);
					});
					return store;
				} else {
					// delete newer states and start new future
					updateModel(store.current, event).then((newState) => {
						const remainingHistory = store.history.slice(0, store.version);
						const newHistory = [...remainingHistory, newState];
						const newIndex = store.version + 1;
						const newValue = {
							version: newIndex,
							current: newState,
							history: newHistory,
							debugMode: store.debugMode
						};
						logDev(newValue);
						set(newValue);
					});
					return store;
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
			update((storeInput) => {
				const store = storeInput;
				const newValue = { ...store, debugMode: !store.debugMode };
				logDev(newValue);
				return newValue;
			});
		},
		reset: async () => {
			set(await initialData());
		}
	};
}
