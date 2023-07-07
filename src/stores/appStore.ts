// detail implementation

import { updateAppState } from '../domain/updateAppState';
import { createTimetraveStore } from './timetravelStore';

// creation of detail instance
export const appStore = createTimetraveStore(updateAppState, {});
