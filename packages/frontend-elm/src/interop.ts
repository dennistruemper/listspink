import Clerk from '@clerk/clerk-js';
import { handleMessageFromElm } from '../fromElm';
//import { handleMessageFromElm } from './fromElm';
let clerk: Clerk;

// This returns the flags passed into your Elm application
export const flags = async ({ env }: { env: Env }): Promise<Flags> => {
	console.log('Flags', JSON.stringify(env, null, 2));
	const clerkPublicKey =
		env.STAGE === 'prod'
			? 'pk_live_Y2xlcmsubGlzdHMucGluayQ'
			: 'pk_test_aGFyZHktZ2xpZGVyLTIwLmNsZXJrLmFjY291bnRzLmRldiQ';
	const baseUrl = normalizeBaseUrl(env.BASE_URL);
	console.log('Clerk PK', clerkPublicKey);
	clerk = new Clerk(clerkPublicKey);

	await clerk.load({});
	console.log('Clerk is ready: ', clerk.session);
	const user = clerk.session?.user;
	const userData = {
		userName: user?.username,
		fistName: user?.firstName,
		lastName: user?.lastName,
		email: user?.primaryEmailAddress?.emailAddress,
		id: user?.id,
		image: user?.imageUrl,
		authToken: await clerk.session?.getToken()
	};
	console.log('User', userData);
	const toElm = { user: userData, baseUrl: baseUrl, stage: env.STAGE ?? 'unknown' };
	return toElm;
};

interface Env {
	BASE_URL?: string;
	STAGE?: string;
}

interface App {
	ports: {
		toElm: {
			send: (data: unknown) => void;
		};
		fromElm: {
			subscribe: (send: (data: unknown) => unknown) => void;
		};
	};
}

interface UserData {
	userName?: string | null;
	fistName?: string | null;
	lastName?: string | null;
	email?: string;
	id?: string;
	image?: string;
	authToken?: string | null;
}

interface Flags {
	user: UserData;
	baseUrl: string;
	stage: string;
}

function normalizeBaseUrl(baseUrl?: string): string {
	if (!baseUrl) {
		return '/api/';
	}

	if (baseUrl.endsWith('/')) {
		return baseUrl + 'api/';
	}
	return baseUrl + '/api/';
}

let websocket: WebSocket;
// This function is called after your Elm app starts
export const onReady = ({ app, env }: { app: App; env: Env }): void => {
	console.log('Elm is now ready', app, env);
	const baseUrl = env.BASE_URL?.replace('https', 'wss') ?? 'wss://' + window.location.host;
	try {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		websocket = new WebSocket(baseUrl);
	} catch (e) {
		console.log('Error connecting to Ampt WS', e);
	}
	console.log('Connected to Ampt WS', baseUrl);

	console.log('Sending message to elm', app.ports);
	//if (app.ports.toElm.send) {
	app.ports.toElm.send('Hello to Elm');
	console.log('Sent message to elm');
	//}

	let currentToken = '';
	setInterval(async () => {
		const token = await clerk.session?.getToken();
		if (!token) {
			return;
		}

		if (currentToken !== token) {
			currentToken = token;
			if (window.location.href.includes('localhost')) {
				console.log('Refreshing token');
			}

			//if (app.ports.toElm.send) {
			app.ports.toElm.send(JSON.stringify({ type: 'TOKEN_UPDATE', newToken: token }));
			//}
		} else {
			if (window.location.href.includes('localhost')) {
				console.log('Token is still valid');
			}
		}
	}, 1000 * 2);

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	//@ts-ignore
	websocket.onmessage = (event) => {
		console.log('Received message', event.data);

		//if (app.ports.toElm.send)
		app.ports.toElm.send(event.data);
	};

	if (app.ports.fromElm.subscribe) {
		app.ports.fromElm.subscribe((data: unknown) => {
			handleMessageFromElm(data, clerk);
		});
	}
};
