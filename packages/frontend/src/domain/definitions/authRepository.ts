import type { User } from './user';

export interface AuthRepository {
	handleRedirectCallback(url: string): Promise<void>;
	login(): Promise<void>;
	logout(): Promise<void>;
	isAuthenticated(): Promise<boolean>;
	getUser(): Promise<User | undefined>;
	getAccessToken(): Promise<string | undefined>;
}
