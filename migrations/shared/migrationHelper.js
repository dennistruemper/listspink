import { sql } from 'kysely';

/**
 *
 * @param {*} db
 * @param {*} tableName
 * @param {*} options - has optional idType
 * @returns
 */
export function createTableWithDefaults(db, tableName, options) {
	return db.schema
		.createTable(tableName)
		.addColumn('id', options?.idType ?? 'uuid', (col) =>
			col.primaryKey().defaultTo(sql`uuid_generate_v4 ()`)
		)
		.addColumn('createdAt', 'timestamptz', (col) => col.notNull().defaultTo(sql`now ()`))
		.addColumn('updatedAt', 'timestamptz', (col) => col.notNull().defaultTo(sql`now ()`));
}
