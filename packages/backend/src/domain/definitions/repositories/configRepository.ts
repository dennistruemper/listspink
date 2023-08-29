export interface ConfigRepository {
	getAuth0ClientSecret(): Promise<string>;
	getAuth0ClientId(): Promise<string>;
	getAuth0Domain(): Promise<string>;
	getAuth0Audience(): Promise<string>;
	getAuth0TokenUrl(): Promise<string>;
	getClerkSecretKey(): Promise<string>;
	getClerkApi(): Promise<string>;
	exportClerkSecretKey(): Promise<void>;
}
