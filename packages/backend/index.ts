import { http } from '@ampt/sdk';
import cors from 'cors';
import express, { Router } from 'express';

const app = express();
app.use(express.json());
app.use(cors());

const publicApi = Router();

publicApi.get('/version', (req, res) => {
	return res.status(200).send({ version: 'v0.0.1' });
});

app.use('/api', publicApi);

http.useNodeHandler(app);
