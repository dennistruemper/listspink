import { http, params } from '@ampt/sdk';
import { createApp } from './src/adapter/http/createExpressApp';
import { getProdDependencies } from './src/stageDependencies';
import { removeOldConnectionsTask } from './src/websockets';

const stage = params('STAGE');
if (!stage) {
	throw new Error('Ampt Parameter ENV_NAME is not set, are you running this locally?');
}
const dependencies = getProdDependencies(stage);

const app = await createApp(dependencies);

removeOldConnectionsTask.every('15 minutes');

http.useNodeHandler(app);
