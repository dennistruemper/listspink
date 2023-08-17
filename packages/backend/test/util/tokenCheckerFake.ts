import { Handler } from 'express';
import { TokenChecker } from '../../../shared/src/definitions/tokenChecker';
import { decodeJwt } from './jwt';

export class TokenCheckerFake implements TokenChecker {
	getHandler(): Promise<Handler> {
		return Promise.resolve((req, res, next) => {
			if (req.headers.authorization === undefined) {
				res.status(401).send('Unauthorized');
				return;
			}
			const encodedTokenPayload = req.headers.authorization.split(' ')[1];

			const token = decodeJwt(encodedTokenPayload);

			if (token.sub === undefined) {
				res.status(401).send('No User Id in token');
				return;
			}

			if (req.auth?.payload !== undefined) {
				console.log('TokenCheckerFake Set auth: ' + req.auth);

				req.auth.payload = { sub: token.sub };
			} else {
				const sub = { sub: token.sub };
				const payload = { payload: sub, header: {}, token: JSON.stringify(token) };
				req.auth = payload;
			}

			next();
		});
	}
}
