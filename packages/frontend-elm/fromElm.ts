import Clerk from '@clerk/clerk-js';

import { z } from 'zod';

const baseMessageSchema = z.object({
	tag: z.string(),
	data: z.string()
});

export async function handleMessageFromElm(data: unknown, clerk: Clerk) {
	console.log('Received message tatatata', data);
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
			await clerk.redirectToSignIn({ afterSignInUrl: '/' });
			break;
		case 'signout':
			clerk.signOut();
			break;
		case 'profile-redirect':
			await clerk.redirectToUserProfile();
			break;
		default:
			alert('Invalid message. Please contact support. More information: ' + JSON.stringify(data));
			console.error(
				'Invalid message. Please contact support. More information: ' + JSON.stringify(data)
			);
			return;
	}
}
