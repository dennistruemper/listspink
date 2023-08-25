import Clerk from '@clerk/clerk-js';
import type { AuthRepository } from '../domain/definitions/authRepository';
import type { User } from '../domain/definitions/user';

export class AuthRepositoryClerk implements AuthRepository {
	private clerk: Clerk;

	static async create(input: { frontendApi: string }): Promise<AuthRepositoryClerk> {
		const clerk = new Clerk(input.frontendApi);
		await clerk.load({});

		return new AuthRepositoryClerk({ clerk: clerk });
	}

	constructor(input: { clerk: Clerk }) {
		this.clerk = input.clerk;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async handleRedirectCallback(_url: string): Promise<void> {
		this.clerk.handleRedirectCallback({ redirectUrl: '/' });
	}
	async login(): Promise<void> {
		this.clerk.redirectToSignIn({ redirectUrl: '/' });
	}
	async logout(): Promise<void> {
		this.clerk.signOut();
	}
	async isAuthenticated(): Promise<boolean> {
		return this.clerk.session?.status === 'active';
	}
	async getUser(): Promise<User | undefined> {
		const user = this.clerk.user;
		if (!user) return undefined;
		return {
			name: user.fullName ?? 'Anonymous',
			email: user.emailAddresses[0].emailAddress,
			displayName: user.firstName ?? user.username ?? 'Anonymous'
		};
	}
	async getAccessToken(): Promise<string | undefined> {
		const token = await this.clerk.session?.getToken();
		console.log(token);
		return token ?? undefined;
	}
}
