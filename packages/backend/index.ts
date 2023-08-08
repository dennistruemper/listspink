import { http } from '@ampt/sdk';
import cors from 'cors';
import express, { Router } from 'express';
import { VersionResponse } from '../shared/src/definitions/versionRequestResponse';

const app = express();
app.use(express.json());
app.use(cors());

const publicApi = Router();

publicApi.get('/version', (req, res) => {
	const result: VersionResponse = { version: 'v0.0.1' };
	return res.status(200).send(result);
});

app.use('/api', publicApi);

http.useNodeHandler(app);
