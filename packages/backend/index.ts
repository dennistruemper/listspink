import { http, params } from '@ampt/sdk';
import cors from 'cors';
import express, { Router } from 'express';
import { auth } from 'express-oauth2-jwt-bearer';
import {
	CreateListResponse,
	createListRequestSchema
} from '../shared/src/definitions/communication/createListRequestResponse';
import { VersionResponse } from '../shared/src/definitions/versionRequestResponse';
import { ListRepositoryAmpt } from './src/adapter/ampt/data/ListRepositoryAmpt';
import { getDependencies } from './src/stageDependencies';

const stage = params('ENV_NAME');
if (!stage) {
	throw new Error('Ampt Parameter ENV_NAME is not set, are you running this locally?');
}
const dependencies = getDependencies(stage);
const config = dependencies.configRepository;
const audience = await config.getAuth0Audience();
const baseUrl = (await config.getAuth0TokenUrl()).slice(0, 'oauth/token'.length * -1);

export const app = express();
app.use(express.json());
app.use(cors());

const publicApi = Router();

publicApi.get('/version', (req, res) => {
	const result: VersionResponse = { version: 'v0.0.1' };
	return res.status(200).send(result);
});
app.use('/api', publicApi);

const checkJwt = auth({
	audience: audience,
	issuerBaseURL: baseUrl,
	tokenSigningAlg: 'RS256'
});

const privateApi = Router();

app.use('/api', checkJwt, privateApi);
privateApi.post('/list', async (req, res) => {
	console.log(req.auth?.payload.sub);
	const parsedBody = createListRequestSchema.safeParse(req.body);
	if (!parsedBody.success) {
		res.status(400).send(parsedBody.error.errors);
		return;
	}

	const data = parsedBody.data;

	const listRepository = new ListRepositoryAmpt(dependencies.idGenerator);
	const created = await listRepository.create({
		name: data.name,
		itemIds: [],
		description: data.description
	});
	if (created === undefined) {
		res.status(500).send('Failed to create list');
		return;
	}
	const result: CreateListResponse = {
		id: created.id,
		name: created.name,
		description: created.description
	};

	return res.status(200).send(result);
});

http.useNodeHandler(app);
