import jwt from 'jsonwebtoken';
export function createJwtDummy(user: string | undefined): string {
	return jwt.sign({ sub: user }, 'subersecret', { algorithm: 'HS256' });
}

export function decodeJwt(token: string): { sub?: string } {
	return jwt.decode(token);
}
