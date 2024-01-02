import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface Lists {
  createdAt: Generated<Timestamp>;
  description: string | null;
  id: Generated<string>;
  name: string | null;
  updatedAt: Generated<Timestamp>;
}

export interface Todos {
  completed: Timestamp | null;
  createdAt: Generated<Timestamp>;
  description: string | null;
  id: Generated<string>;
  listId: string;
  name: string;
  priority: Generated<number>;
  updatedAt: Generated<Timestamp>;
}

export interface UserLists {
  createdAt: Generated<Timestamp>;
  id: Generated<string>;
  listId: string;
  updatedAt: Generated<Timestamp>;
  userId: string;
}

export interface Users {
  createdAt: Generated<Timestamp>;
  displayName: string;
  id: Generated<string>;
  updatedAt: Generated<Timestamp>;
}

export interface DB {
  lists: Lists;
  todos: Todos;
  userLists: UserLists;
  users: Users;
}
