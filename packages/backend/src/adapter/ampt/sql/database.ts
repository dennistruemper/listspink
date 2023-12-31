import { Kysely } from '@ampt/sql';
import { ColumnType, Generated, GeneratedAlways } from 'kysely';

interface Database {
	lists: ListsTable;
	todos: TodosTable;
	users: UsersTable;
	userLists: UserListsTable;
}

interface ListsTable {
	id: GeneratedAlways<string>;
	name: string;
	description: string | null;
}

interface TodosTable {
	id: GeneratedAlways<string>;
	name: string;
	description: string | null;
	priority: number;
	createdAt: GeneratedAlways<Date>;
	updatedAt: GeneratedAlways<Date>;
	completed: ColumnType<string | null, string | null, string | null>;
	listId: string;
}

interface UsersTable {
	id: Generated<string>;
	displayName: string;
}

interface UserListsTable {
	id: GeneratedAlways<string>;
	userId: string;
	listId: string;
}

export const db = new Kysely<Database>();
