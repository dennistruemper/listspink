import { Kysely } from '@ampt/sql';
import { DB } from './dbTypes';

export const db = new Kysely<DB>();
