import cors from 'cors';
import express, { Express, Handler, Router } from 'express';
import { VersionResponse } from '../../../../shared/src/definitions/versionRequestResponse';
import { Dependencies } from '../../domain/definitions/dependencies';
import { addItemRoutes } from './itemRoutes';
import { addListRoutes } from './listRoutes';

export async function createApp(dependencies: Dependencies): Promise<Express> {
	const authHandler: Handler = await dependencies.tokenChecker.getHandler();

	const app = express();
	app.options('*', cors());
	app.use(express.json());
	app.use(cors());

	dependencies.configRepository.exportClerkSecretKey();

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
	addItemRoutes(router, dependencies);
}
