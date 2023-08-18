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
import { Dependencies } from '../../domain/definitions/dependencies';
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
			res.status(500).send('Failed to create list. ErrorCode: ' + created.code);
			return;
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
		const loded = await new GetListUsecase(dependencies.listRepository).execute({ id: data.id });

		if (loded.success === false) {
			res.status(500).send('Failed to load list. ErrorCode: ' + loded.code);
			return;
		}

		if (loded.value.list === undefined) {
			res.status(404).send('List not found');
			return;
		}

		const response: GetListDetailsResponse = {
			id: loded.value.list.id,
			name: loded.value.list.name,
			description: loded.value.list.description
		};

		return res.status(200).send(response);
	});
}
