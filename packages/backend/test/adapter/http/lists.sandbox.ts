import supertest from 'supertest';
import { describe, it } from 'vitest';
import { app } from '../../..';

describe('list endpoint api/list', () => {
	it('should get a 401 without authorization', async () => {
		await supertest(app).post('/api/list').expect(401);
	});

	// TODO test with fresh token or use e2e test
	/*it('should work', async () => {
		const result = await supertest(app)
			.post('/api/list')
			.set(
				'Authorization',
				'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ijdsa2lyYXBtMl9LYV9ucXRSZGRxXyJ9.eyJodHRwczovL3d3dy5saXN0cy5waW5rL3VzZXItaWQiOiJhdXRoMHw2NGRjOWJjOGJiYjAwNzdlYzM5NDkwOTgiLCJwaW5rIjoibGlzdCIsImlzcyI6Imh0dHBzOi8vbGlzdHNwaW5rLWRldi5ldS5hdXRoMC5jb20vIiwic3ViIjoiYXV0aDB8NjRkYzliYzhiYmIwMDc3ZWMzOTQ5MDk4IiwiYXVkIjpbImRldi5saXN0cy5waW5rIiwiaHR0cHM6Ly9saXN0c3BpbmstZGV2LmV1LmF1dGgwLmNvbS91c2VyaW5mbyJdLCJpYXQiOjE2OTIyMTk5NDMsImV4cCI6MTY5MjMwNjM0MywiYXpwIjoiV1Z2TnBjVjlGem9qM0VXaVlYdHNka2lLREdmYTVzQ3UiLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIn0.F68cyZrPZw8yN4RO_ImnD7288VzliET4_saOYdt7Am5CFbvx8nCoz2KFudapOxWTqrpJOwmAdR71Ic4KTC_63NyZ1OsXu8njNhUo-XBxyEbqGXTV9Ib0hkRzaTS8kxoGmp3wv2CpUXlyBewohhdw61AxkqpHcpo4l2x4oKWPPZ8p4XYHhtisHjtJaVvmTNIbIOTmAnKsCi7vbV6vYB4sUx3EQiso8BwZkkr_hW_LZY0iWpImOsxKiPo7qEMVLVgW3kVmg9NWkyQMZYNFeQaQzkrHI4DiaAWvCrvZbTM4H2q2dDaDo13mEy7HjGrpm1-vUc8qVLxJf6k1YvAD50HxVg'
			)
			.send({ name: 'test', description: 'test' })
			.expect(200);
		console.log(result.body);
	});*/
});
