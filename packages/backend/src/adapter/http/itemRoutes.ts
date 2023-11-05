import { Router } from 'express';
import { GetListDetailsResponse } from '../../domain/definitions/communication/getListDetailsRequestResponse';
import {
	CreateItemResponse,
	GetItemsResponse,
	UpdateItemResponses,
	createItemRequestSchema,
	updateItemRequestSchema
} from '../../domain/definitions/communication/itemRequestResponses';
import { Dependencies } from '../../domain/definitions/dependencies';
import {
	NO_ACCESS_CODE,
	UNKNOWN_DATA_SHAPE_CODE
} from '../../domain/definitions/errorCodes';
import { CreateItemForListUsecase } from '../../domain/usecases/items/createItemForListUsecase';
import { GetItemUsecase } from '../../domain/usecases/items/getItemUsecase';
import { GetItemsForListUsecase } from '../../domain/usecases/items/getItemsForListUsecase';
import { ToggleItemUsecase } from '../../domain/usecases/items/toggleItemUsecase';
import { UpdateItemUsecase } from '../../domain/usecases/items/updateItemsUsecase';
import { forceExhaust } from '../../languageExtension';
import { getUserIdFromRequest } from './expressHelper';

export function addItemRoutes(router: Router, dependencies: Dependencies) {
	addCreateItemForListRoute(router, dependencies);
	addGetItemDetailsRoute(router, dependencies);
	addGetItemDetailsForListRoute(router, dependencies);
	addUpdateItemDetailsRoute(router, dependencies);
	toggleItemCompleted(router, dependencies);
}

function addGetItemDetailsRoute(router: Router, dependencies: Dependencies) {
	router.get('/item/:itemId', async (req, res) => {
		const itemId = req.params.itemId;
		if (!itemId) {
			res.status(400).send('No item id provided');
			return;
		}

		const userId = getUserIdFromRequest(req);
		if (userId === undefined) {
			res.status(400).send('No user id in token');
			return;
		}

		const loaded = await new GetItemUsecase(
			dependencies.itemRepository,
			dependencies.listRepository
		).execute({
			itemId,
			userId
		});

		if (loaded.success === false) {
			switch (loaded.code) {
				case UNKNOWN_DATA_SHAPE_CODE:
					res.status(500).send('Failed to load list. ErrorCode: ' + loaded.code);
					return;
				case NO_ACCESS_CODE:
					res.status(403).send('User does not have access to this list');
					return;
				default:
					forceExhaust(loaded.code);
			}
		}

		if (loaded.value.item === undefined) {
			res.status(404).send('List not found');
			return;
		}

		const response: GetItemsResponse = {
			name: loaded.value.item.name,
			id: loaded.value.item.id,
			description: loaded.value.item.description,
			completed: loaded.value.item.completed
		};

		return res.status(200).send(response);
	});
}

function addCreateItemForListRoute(router: Router, dependencies: Dependencies) {
	router.post('/item', async (req, res) => {
		const userId = getUserIdFromRequest(req);
		if (userId === undefined) {
			res.status(400).send('No user id provided');
			return;
		}

		const parsedBody = createItemRequestSchema.safeParse(req.body);
		if (!parsedBody.success) {
			res.status(400).send(parsedBody.error.errors);
			return;
		}

		const data = parsedBody.data;

		const created = await new CreateItemForListUsecase(
			dependencies.itemRepository,
			dependencies.listRepository
		).execute({
			userId,
			itemName: data.name,
			itemDescription: data.description,
			listId: data.listId,
			extraListIds: data.extraListIds
		});

		if (created.success === false) {
			switch (created.code) {
				case UNKNOWN_DATA_SHAPE_CODE:
					res.status(500).send(created.message + created.code);
					return;
				case NO_ACCESS_CODE:
					res.status(403).send(created.message + created.code);
					return;
				default:
					forceExhaust(created.code);
			}
		}

		const item = created.value.item;

		const result: CreateItemResponse = {
			id: item.id,
			name: item.name,
			description: item.description,
			listId: data.listId
		};

		return res.status(200).send(result);
	});
}

function addGetItemDetailsForListRoute(router: Router, dependencies: Dependencies) {
	router.get('/list/:listId/items', async (req, res) => {
		const userId = getUserIdFromRequest(req);
		if (userId === undefined) {
			res.status(400).send('No user id in token');
			return;
		}
		const listId = req.params.listId;
		if (listId === undefined) {
			res.status(400).send('No list id provided');
		}

		const loaded = await new GetItemsForListUsecase(
			dependencies.itemRepository,
			dependencies.listRepository
		).execute({
			listId,
			userId
		});

		if (loaded.success === false) {
			switch (loaded.code) {
				case UNKNOWN_DATA_SHAPE_CODE:
					console.error('Error code: ' + loaded.code + ' ' + loaded.message);
					res.status(500).send('Failed to load list. ErrorCode: ' + loaded.code);
					return;
				case NO_ACCESS_CODE:
					res.status(403).send('User does not have access to this list');
					return;
				default:
					forceExhaust(loaded.code);
			}
		}

		const response: GetListDetailsResponse[] = loaded.value.items.map((list) => ({
			id: list.id,
			name: list.name,
			description: list.description,
			completed: list.completed
		}));

		return res.status(200).send(response);
	});
}

function addUpdateItemDetailsRoute(router: Router, dependencies: Dependencies) {
	router.put('/list/:listId/item/:itemId', async (req, res) => {
		const userId = getUserIdFromRequest(req);
		if (userId === undefined) {
			res.status(400).send('No user id in token');
			return;
		}
		const listId = req.params.listId;
		if (listId === undefined) {
			res.status(400).send('No list id provided');
		}
		const itemId = req.params.itemId;
		if (listId === undefined) {
			res.status(400).send('No item id provided');
		}

		const paredBody = updateItemRequestSchema.safeParse(req.body);
		if (!paredBody.success) {
			res.status(400).send(paredBody.error.errors);
			return;
		}

		const loaded = await new UpdateItemUsecase(
			dependencies.itemRepository,
			dependencies.listRepository
		).execute({
			itemId,
			listId,
			userId,
			changes: paredBody.data
		});

		if (loaded.success === false) {
			switch (loaded.code) {
				case UNKNOWN_DATA_SHAPE_CODE:
					console.error('Error code: ' + loaded.code + ' ' + loaded.message);
					res.status(500).send('Failed to update item. ErrorCode: ' + loaded.code);
					return;
				case NO_ACCESS_CODE:
					res.status(403).send('User does not have access to this list');
					return;
				default:
					forceExhaust(loaded.code);
			}
		}

		const response: UpdateItemResponses = {};

		return res.status(200).send(response);
	});
}

function toggleItemCompleted(router: Router, dependencies: Dependencies) {
	router.post('/list/:listId/item/:itemId/toggle', async (req, res) => {
		const userId = getUserIdFromRequest(req);
		if (userId === undefined) {
			res.status(400).send('No user id in token');
			return;
		}
		const listId = req.params.listId;
		if (listId === undefined) {
			res.status(400).send('No list id provided');
		}
		const itemId = req.params.itemId;
		if (listId === undefined) {
			res.status(400).send('No item id provided');
		}

		const paredBody = updateItemRequestSchema.safeParse(req.body);
		if (!paredBody.success) {
			res.status(400).send(paredBody.error.errors);
			return;
		}

		const loaded = await new ToggleItemUsecase(
			dependencies.itemRepository,
			dependencies.listRepository
		).execute({
			itemId,
			listId,
			userId,
			now: new Date()
		});

		if (loaded.success === false) {
			switch (loaded.code) {
				case UNKNOWN_DATA_SHAPE_CODE:
					console.error('Error code: ' + loaded.code + ' ' + loaded.message);
					res.status(500).send('Failed to update item. ErrorCode: ' + loaded.code);
					return;
				case NO_ACCESS_CODE:
					res.status(403).send('User does not have access to this list');
					return;
				default:
					forceExhaust(loaded.code);
			}
		}

		const response: UpdateItemResponses = {};

		return res.status(200).send(response);
	});
}
