import { http, params } from '@ampt/sdk';
import { createApp } from './src/adapter/http/createExpressApp';
import { getDependencies } from './src/stageDependencies';

const stage = params('ENV_NAME');
if (!stage) {
	throw new Error('Ampt Parameter ENV_NAME is not set, are you running this locally?');
}
const dependencies = getDependencies(stage);

const app = await createApp(dependencies);

http.useNodeHandler(app);
