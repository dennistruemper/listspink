import { params } from '@ampt/sdk';
import Bun from 'bun';

Bun.write('kysely.env', `DATABASE_URL=${params().list()['_AMPT_INTERNAL_NEON_URL']}`);
