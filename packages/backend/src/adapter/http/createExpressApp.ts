import { http } from '@ampt/sdk';
import cors from 'cors';
import express, { Express, Handler, Router } from 'express';
import { VersionResponse } from '../../domain/definitions/communication/versionRequestResponse';
import { Dependencies } from '../../domain/definitions/dependencies';
import { addItemRoutes } from './itemRoutes';
import { addListRoutes } from './listRoutes';

export async function createApp(dependencies: Dependencies): Promise<Express> {
	const authHandler: Handler = await dependencies.tokenChecker.getHandler();

	const corsOptions = {
		origin: '*',
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		allowedHeaders: 'Content-Type,Authorization'
	};

	const app = express();
	app.options('*', cors(corsOptions));
	app.use(express.json());
	app.use(cors(corsOptions));

	dependencies.configRepository.exportClerkSecretKey();

	const publicApi = Router();
	app.use('/api', publicApi);
	addPublicRoutes(publicApi, dependencies);
	const privateApi = Router();
	app.use('/api', authHandler, privateApi);
	addPrivateRoutes(privateApi, dependencies);

	app.use(async (req, res) => {
		const notFoundHtmlFile = await http.node.readStaticFile('index.html');
		res.header('Content-Type', 'text/html');
		res.status(404);
		return notFoundHtmlFile?.pipe(res);
	});
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
