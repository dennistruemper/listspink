import { OptionalID, Result } from '../../../languageExtension';
import {
	DATA_MISSING,
	NO_ACCESS,
	UNKNOWN_DATA_SHAPE
} from '../errorCodes';
import { ListPink, ListPinkDetails } from '../listPink';
import { ListToItemConnection } from '../listToItemConnection';
import { UserToListConnection } from '../userToListConnection';

export type CreateListInput = OptionalID<ListPink>;
export type GetListsByItemIdForUserInput = { itemId: string; userId: string };
export type ConnectToUserInput = { listId: string; userId: string };
export type UserHasAccessInput = { listId: string; userId: string };
export type ConnectItemToListInput = {
	listId: string;
	itemId: string;
	itemName: string;
	itemDescription?: string;
	itemCompleted?: string;
	priority: number
};

export type CreateListErrors = UNKNOWN_DATA_SHAPE;
export type GetListErrors = UNKNOWN_DATA_SHAPE;
export type GetListsByItemIdForUserErrors = UNKNOWN_DATA_SHAPE;
export type GetAllListsErrors = UNKNOWN_DATA_SHAPE;
export type ConnectToUserErrors = DATA_MISSING | UNKNOWN_DATA_SHAPE;
export type GetListsDetailsErrors = UNKNOWN_DATA_SHAPE;
export type UserHasAccessErrors = UNKNOWN_DATA_SHAPE;
export type ConnectItemToListErrors = UNKNOWN_DATA_SHAPE | NO_ACCESS;

export interface ListRepository {
	create(list: CreateListInput): Promise<Result<ListPink, CreateListErrors>>;
	getList(id: string): Promise<Result<ListPink | undefined, GetListErrors>>;
	getListsByItemIdForUser(
		input: GetListsByItemIdForUserInput
	): Promise<Result<ListPinkDetails[], GetListsByItemIdForUserErrors>>;
	getAllLists(): Promise<Result<ListPink[], GetAllListsErrors>>;
	connectToUser(
		input: ConnectToUserInput
	): Promise<Result<UserToListConnection, ConnectToUserErrors>>;
	getListsDetailsForUser(userId: string): Promise<Result<ListPinkDetails[], GetListsDetailsErrors>>;
	userHasAccess(input: UserHasAccessInput): Promise<Result<boolean, UserHasAccessErrors>>;
	connectItemToList(
		input: ConnectItemToListInput
	): Promise<Result<ListToItemConnection, ConnectItemToListErrors>>;
}
