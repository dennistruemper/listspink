import { sql } from 'kysely';
import { createTableWithDefaults } from './shared/migrationHelper.js';

export async function up(db) {
	await sql`CREATE EXTENSION if not exists "uuid-ossp"`.execute(db);

	await createTableWithDefaults(db, 'lists')
		.addColumn('name', 'text')
		.addColumn('description', 'text')
		.execute();

	await createTableWithDefaults(db, 'todos')
		.addColumn('name', 'text', (col) => col.notNull())
		.addColumn('description', 'text')
		.addColumn('priority', 'integer', (col) => col.notNull().defaultTo(0))
		.addColumn('completed', 'timestamptz')
		.addColumn('listId', 'uuid', (col) => col.notNull().references('lists.id'))
		.execute();

	await createTableWithDefaults(db, 'users', { idType: 'text' })
		.addColumn('displayName', 'text', (col) => col.notNull())
		.execute();

	await createTableWithDefaults(db, 'userLists')
		.addColumn('userId', 'text', (col) => col.notNull().references('users.id'))
		.addColumn('listId', 'uuid', (col) => col.notNull().references('lists.id'))
		.execute();
}

export async function down(db) {
	await db.schema.dropTable('userLists').execute();
	await db.schema.dropTable('users').execute();
	await db.schema.dropTable('todos').execute();
	await db.schema.dropTable('lists').execute();
}
