import cors from 'cors';
import express, { Express, Handler, Router } from 'express';
import {
	CreateListResponse,
	createListRequestSchema
} from '../../../../shared/src/definitions/communication/createListRequestResponse';
import {
	GetListDetailsResponse,
	getListDetailsRequestSchema
} from '../../../../shared/src/definitions/communication/getListDetailsRequestResponse';
import { VersionResponse } from '../../../../shared/src/definitions/versionRequestResponse';
import { forceExhaust } from '../../../../shared/src/languageExtension';
import { Dependencies } from '../../domain/definitions/dependencies';
import { DATA_MISSING_CODE, UNKNOWN_DATA_SHAPE_CODE } from '../../domain/errorCodes';
import { CreateListUsecase } from '../../domain/usecases/lists/createListUsecase';
import { GetListUsecase } from '../../domain/usecases/lists/getListUsecase';

export async function createApp(dependencies: Dependencies): Promise<Express> {
	const authHandler: Handler = await dependencies.tokenChecker.getHandler();

	const app = express();
	app.use(express.json());
	app.use(cors());

	const publicApi = Router();
	app.use('/api', publicApi);
	addPublicRoutes(publicApi, dependencies);
	const privateApi = Router();
	app.use('/api', authHandler, privateApi);
	addPrivateRoutes(privateApi, dependencies);

	return app;
}

function addPublicRoutes(router: Router, dependencies: Dependencies) {
	router.get('/version', (req, res) => {
		const result: VersionResponse = { version: 'v0.0.1' };
		return res.status(200).send(result);
	});
}

function addPrivateRoutes(router: Router, dependencies: Dependencies) {
	addListRoutes(router, dependencies);
}

function addListRoutes(router: Router, dependencies: Dependencies) {
	router.post('/list', async (req, res) => {
		if (req.auth?.payload.sub === undefined) {
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
			userId: req.auth.payload.sub
		});

		if (created.success === false) {
			switch (created.code) {
				case UNKNOWN_DATA_SHAPE_CODE:
					res.status(500).send(created.message + created.code);
					return
				case DATA_MISSING_CODE:
					res.status(500).send(created.message + created.code);
					return
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

	router.get('/list', async (req, res) => {
		const parsedBody = getListDetailsRequestSchema.safeParse(req.body);
		if (!parsedBody.success) {
			res.status(400).send(parsedBody.error.errors);
			return;
		}

		const data = parsedBody.data;
		const loaded = await new GetListUsecase(dependencies.listRepository).execute({ id: data.id });

		if (loaded.success === false) {
			switch (loaded.code) {
				case UNKNOWN_DATA_SHAPE_CODE:
					res.status(500).send('Failed to load list. ErrorCode: ' + loaded.code);
					return
				default:
					forceExhaust(loaded.code);
			}
		}

		if (loaded.value.list === undefined) {
			res.status(404).send('List not found');
			return;
		}

		const response: GetListDetailsResponse = {
			id: loaded.value.list.id,
			name: loaded.value.list.name,
			description: loaded.value.list.description
		};

		return res.status(200).send(response);
	});
}
