import { Router } from 'express';
import {
	CreateListResponse,
	createListRequestSchema
} from '../../../../shared/src/definitions/communication/createListRequestResponse';
import { GetListDetailsResponse } from '../../../../shared/src/definitions/communication/getListDetailsRequestResponse';
import { forceExhaust } from '../../../../shared/src/languageExtension';
import { Dependencies } from '../../domain/definitions/dependencies';
import {
	DATA_MISSING_CODE,
	NO_ACCESS_CODE,
	UNKNOWN_DATA_SHAPE_CODE
} from '../../domain/errorCodes';
import { CreateListUsecase } from '../../domain/usecases/lists/createListUsecase';
import { GetListUsecase } from '../../domain/usecases/lists/getListUsecase';
import { getUserIdFromRequest } from './expressHelper';

export function addListRoutes(router: Router, dependencies: Dependencies) {
	addCreateListForUserRoute(router, dependencies);
	addGetListDetailsRoute(router, dependencies);
	addGetListsDetailsForUserRoute(router, dependencies);
}

function addGetListDetailsRoute(router: Router, dependencies: Dependencies) {
	router.get('/list/:listId', async (req, res) => {
		const listId = req.params.listId;
		if (!listId) {
			res.status(400).send('No list id provided');
			return;
		}

		const userId = getUserIdFromRequest(req);
		if (userId === undefined) {
			res.status(400).send('No user id in token');
			return;
		}

		const loaded = await new GetListUsecase(dependencies.listRepository).execute({
			listId,
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

		if (loaded.value.list === undefined) {
			res.status(404).send('List not found');
			return;
		}

		const response: GetListDetailsResponse = {
			name: loaded.value.list.name,
			id: loaded.value.list.id,
			description: loaded.value.list.description
		};

		return res.status(200).send(response);
	});
}

function addCreateListForUserRoute(router: Router, dependencies: Dependencies) {
	router.post('/list', async (req, res) => {
		const userId = getUserIdFromRequest(req);
		if (userId === undefined) {
			res.status(400).send('No user id provided');
			return;
		}
		const parsedBody = createListRequestSchema.safeParse(req.body);
		if (!parsedBody.success) {
			res.status(400).send(parsedBody.error.errors);
			return;
		}

		const data = parsedBody.data;

		const created = await new CreateListUsecase(dependencies.listRepository).execute({
			...data,
			userId
		});

		if (created.success === false) {
			switch (created.code) {
				case UNKNOWN_DATA_SHAPE_CODE:
					res.status(500).send(created.message + created.code);
					return;
				case DATA_MISSING_CODE:
					res.status(500).send(created.message + created.code);
					return;
				default:
					forceExhaust(created.code);
			}
		}

		const list = created.value.list;

		const result: CreateListResponse = {
			id: list.id,
			name: list.name,
			description: list.description
		};

		return res.status(200).send(result);
	});
}

function addGetListsDetailsForUserRoute(router: Router, dependencies: Dependencies) {
	router.get('/list', async (req, res) => {
		const userId = getUserIdFromRequest(req);
		if (userId === undefined) {
			res.status(400).send('No user id in token');
			return;
		}

		const loaded = await dependencies.listRepository.getListsDetailsForUser(userId);

		if (loaded.success === false) {
			switch (loaded.code) {
				case UNKNOWN_DATA_SHAPE_CODE:
					res.status(500).send('Failed to load list. ErrorCode: ' + loaded.code);
					return;
				default:
					forceExhaust(loaded.code);
			}
		}

		const response: GetListDetailsResponse[] = loaded.value.map((list) => ({
			id: list.id,
			name: list.name,
			description: list.description
		}));

		return res.status(200).send(response);
	});
}
