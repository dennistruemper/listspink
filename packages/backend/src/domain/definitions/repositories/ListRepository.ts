import { ListPink, ListPinkDetails } from '../../../../../shared/src/definitions/listPink';
import { UserToListConnection } from '../../../../../shared/src/definitions/userToListConnection';
import { OptionalID, Result } from '../../../../../shared/src/languageExtension';
import { DATA_MISSING, UNKNOWN_DATA_SHAPE } from '../../errorCodes';

export type CreateListInput = OptionalID<ListPink>;
export type ConnectToUserInput = { listId: string; userId: string };
export type UserHasAccessInput = { listId: string; userId: string };

export type CreateListErrors = UNKNOWN_DATA_SHAPE;
export type GetListErrors = UNKNOWN_DATA_SHAPE;
export type GetAllListsErrors = UNKNOWN_DATA_SHAPE;
export type ConnectToUserErrors = DATA_MISSING | UNKNOWN_DATA_SHAPE;
export type GetListsDetailsErrors = UNKNOWN_DATA_SHAPE;
export type UserHasAccessErrors = UNKNOWN_DATA_SHAPE;

export interface ListRepository {
	create(list: CreateListInput): Promise<Result<ListPink, CreateListErrors>>;
	getList(id: string): Promise<Result<ListPink | undefined, GetListErrors>>;
	getAllLists(): Promise<Result<ListPink[], GetAllListsErrors>>;
	connectToUser(
		input: ConnectToUserInput
	): Promise<Result<UserToListConnection, ConnectToUserErrors>>;
	getListsDetailsForUser(userId: string): Promise<Result<ListPinkDetails[], GetListsDetailsErrors>>;
	userHasAccess(input: UserHasAccessInput): Promise<Result<boolean, UserHasAccessErrors>>;
}
