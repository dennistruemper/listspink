import { PUBLIC_BACKEND_URL } from '$env/static/public';
import {
	createListResponseSchema,
	getListsResponseSchema,
	type CreateListRequest
} from '../../../../shared/src/definitions/communication/createListRequestResponse';
import {
	UNKNOWN_DATA_SHAPE_CODE,
	type UNKNOWN_DATA_SHAPE
} from '../../../../shared/src/definitions/errorCodes';
import type { ListPink } from '../../../../shared/src/definitions/listPink';
import { failure, success, type Result } from '../../../../shared/src/languageExtension';
import type {
	CreateListInput,
	GetListsForUser,
	ListRepository
} from '../../domain/definitions/repositories/listRepository';
import { parseResponse } from '../httpClient';

export class ListRepositoryBackend implements ListRepository {
	async create(data: CreateListInput): Promise<Result<ListPink, UNKNOWN_DATA_SHAPE>> {
		const body: CreateListRequest = {
			name: data.name,
			description: data.description,
			itemIds: []
		};

		const response = await fetch(PUBLIC_BACKEND_URL + '/api/list', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${data.token}`
			},
			body: JSON.stringify(body)
		});

		if (response.status === 200) {
			const parsed = parseResponse(await response.json(), createListResponseSchema);
			if (parsed.success) {
				return success(parsed.data);
			} else {
				console.log(parsed.error);
				return failure(parsed.error, UNKNOWN_DATA_SHAPE_CODE);
			}
		}

		const errorText = await response.text();

		return failure(errorText, UNKNOWN_DATA_SHAPE_CODE);
	}

	async getAll(data: GetListsForUser): Promise<Result<ListPink[], UNKNOWN_DATA_SHAPE>> {
		const response = await fetch(PUBLIC_BACKEND_URL + '/api/list', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${data.token}`
			}
		});

		if (response.status === 200) {
			const parsed = parseResponse(await response.json(), getListsResponseSchema);
			if (parsed.success) {
				return success(
					parsed.data.map((item) => {
						return { ...item, itemIds: item.itemIds ?? [] };
					})
				);
			} else {
				console.log(parsed.error);
				return failure(parsed.error, UNKNOWN_DATA_SHAPE_CODE);
			}
		}

		const errorText = await response.text();

		return failure(errorText, UNKNOWN_DATA_SHAPE_CODE);
	}
}
