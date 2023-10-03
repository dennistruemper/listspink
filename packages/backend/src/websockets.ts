import { data } from '@ampt/data';
import { SocketConnection, task, ws } from '@ampt/sdk';

ws.on('connected', async (connection: SocketConnection) => {
	console.log('connected', JSON.stringify(connection.connectionId));
	const { connectionId, meta } = connection;
	if (meta) {
		const { connectedAt, queryStringParams } = meta;
		await data.set(`connection:${connectionId}`, {
			connectionId,
			connectedAt,
			username: queryStringParams?.name
		});
	}
});

ws.on('disconnected', async (connection: SocketConnection, reason?: string) => {
	await data.remove(`connection:${connection.connectionId}`);
});

// remove unused connections
export const removeOldConnectionsTask = task('removeOldConnections', async (_event) => {
	const connections = (await data.get('connection:*')) as unknown as {
		items: { value: { connectionId: string } }[]; // types are not good in ampt data right now, so I have to cheat a little
	};
	connections.items.forEach(async (connection) => {
		const isConnected = await ws.isConnected(connection.value.connectionId);
		if (!isConnected) {
			console.log('removing connection', connection.value.connectionId);
			await data.remove(`connection:${connection.value.connectionId}`);
		}
	});
});
