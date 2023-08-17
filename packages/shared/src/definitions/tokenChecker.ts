import { Handler } from 'express';

export interface TokenChecker {
	getHandler(): Promise<Handler>;
}
