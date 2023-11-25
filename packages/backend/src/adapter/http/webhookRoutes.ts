import { Router } from 'express';
import { Dependencies } from '../../domain/definitions/dependencies';

import { z } from 'zod';
import { forceExhaust } from '../../languageExtension';

export function addWebhookRoutes(router: Router, dependencies: Dependencies) {
	const webhookApi = Router();
	router.use('/webhook', webhookApi);
	addClerkWebhook(webhookApi, dependencies);
}

function addClerkWebhook(router: Router, dependencies: Dependencies) {
	router.post('/clerk', async (req, res) => {
		console.log('Received webhook from clerk', req.body);
		const result = clerkWebhookSchema.safeParse(req.body);
		if (!result.success) {
			console.log('Webhook failed validation', result.error.errors);
			console.log('union errors:', result.error.errors['unionErrors'][0].errors);
			res.status(400).send(JSON.stringify(result.error.errors));
			return;
		}

		switch (result.data.type) {
			case 'user.created':
				console.log('user created', result.data.data);

				dependencies.userRepository.createUser({
					displayName:
						result.data.data.username ??
						`${result.data.data.first_name} ${result.data.data.last_name}`,
					id: result.data.data.id
				});
				break;
			case 'user.updated':
				console.log('user updated', result.data.data);
				dependencies.userRepository.updateUser({
					displayName:
						result.data.data.username ??
						`${result.data.data.first_name} ${result.data.data.last_name}`,
					id: result.data.data.id
				});
				break;
			default:
				forceExhaust(result.data);
		}

		res.status(200).send('OK');
	});
}

const userCreatedSchema = z.object({
	type: z.literal('user.created'),
	data: z.object({
		id: z.string(),
		last_name: z.string().optional(),
		first_name: z.string().optional(),
		username: z.string().optional()
	})
});

const userUpdatedSchema = z.object({
	type: z.literal('user.updated'),
	data: z.object({
		id: z.string(),
		last_name: z.string().optional(),
		first_name: z.string().optional(),
		username: z.string().optional()
	})
});
// use userCreatedSchema or userUpdatedSchema
const clerkWebhookSchema = z.discriminatedUnion('type', [userCreatedSchema, userUpdatedSchema]);
