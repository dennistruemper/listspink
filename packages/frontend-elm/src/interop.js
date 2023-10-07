import Clerk from '@clerk/clerk-js';
//import { handleMessageFromElm } from './fromElm';
let clerk;

// This returns the flags passed into your Elm application
export const flags = async ({ env }) => {
	console.log('Flags', JSON.stringify(env, null, 2));
	const clerkPublicKey =
		env.STAGE === 'prod'
			? 'pk_live_Y2xlcmsubGlzdHMucGluayQ'
			: 'pk_test_aGFyZHktZ2xpZGVyLTIwLmNsZXJrLmFjY291bnRzLmRldiQ';
	console.log('Clerk PK', clerkPublicKey);
	clerk = new Clerk(clerkPublicKey);
	await clerk.load({});
	console.log('Clerk is ready: ', clerk.session);
	const user = clerk.session?.user;
	const userData = {
		userName: user?.username,
		fistName: user?.firstName,
		lastName: user?.lastName,
		email: user?.primaryEmailAddress.emailAddress,
		id: user?.id
	};
	console.log('User', userData);
	const toElm = { user: userData };
	return toElm;
};

let websocket;
// This function is called after your Elm app starts
export const onReady = ({ app, env }) => {
	console.log('Elm is ready', app, env);
	try {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		websocket = new WebSocket(env.BASE_URL.replace('https', 'wss'));
	} catch (e) {
		console.log('Error connecting to Ampt WS', e);
	}
	console.log('Connecting to Ampt WS', env.BASE_URL.replace('https', 'wss'));

	console.log('Sending message to elm', app.ports);
	if (app.ports.toElm.send) {
		app.ports.toElm.send('Hello to Elm');
		console.log('Sent message to elm');
	}

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	//@ts-ignore
	websocket.onmessage = (event) => {
		console.log('Received message', event.data);

		if (app.ports.toElm.send) app.ports.toElm.send(event.data);
	};

	if (app.ports.fromElm.subscribe) {
		app.ports.fromElm.subscribe((data) => {
			handleMessageFromElm(data, clerk);
		});
	}
};

import { z } from 'zod';

const baseMessageSchema = z.object({
	tag: z.string(),
	data: z.string()
});

export async function handleMessageFromElm(data, clerk) {
	console.log('Received message', data);
	const parsed = baseMessageSchema.safeParse(data);
	if (!parsed.success) {
		console.log('parsing failed');
		alert('Invalid message. Please contact support. More information: ' + JSON.stringify(data));
		console.error(
			'Invalid message. Please contact support. More information: ' + JSON.stringify(data)
		);
		return;
	}

	switch (parsed.data.tag) {
		case 'logging':
			console.log(parsed.data.data);
			break;
		case 'signin-redirect':
			await clerk.redirectToSignIn({});
			break;
		case 'signout':
			clerk.signOut();
			break;
		default:
			alert('Invalid message. Please contact support. More information: ' + JSON.stringify(data));
			console.error(
				'Invalid message. Please contact support. More information: ' + JSON.stringify(data)
			);
			return;
	}
}
