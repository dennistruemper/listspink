import { PUBLIC_BACKEND_URL } from '$env/static/public';
import {
	createItemResponseSchema,
	getItemsResponseSchema,
	type CreateItemRequest
} from '../../../../shared/src/definitions/communication/itemRequestResponses';
import {
	UNKNOWN_DATA_SHAPE_CODE,
	type UNKNOWN_DATA_SHAPE
} from '../../../../shared/src/definitions/errorCodes';
import type { ItemPink } from '../../../../shared/src/definitions/itemPink';
import { failure, success, type Result } from '../../../../shared/src/languageExtension';
import type {
	CreateItemInput,
	GetItemsForListInput,
	GetItemsForListResponse,
	ItemRepository
} from '../../domain/definitions/repositories/itemRepository';
import { parseResponse } from '../httpClient';

export class ItemRepositoryBackend implements ItemRepository {
	async create(data: CreateItemInput): Promise<Result<ItemPink, UNKNOWN_DATA_SHAPE>> {
		const body: CreateItemRequest = {
			name: data.name,
			listId: data.listId
		};

		const response = await fetch(PUBLIC_BACKEND_URL + '/api/item', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${data.token}`
			},
			body: JSON.stringify(body)
		});

		if (response.status === 200) {
			const parsed = parseResponse(await response.json(), createItemResponseSchema);
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
	async getAll(
		data: GetItemsForListInput
	): Promise<Result<GetItemsForListResponse, UNKNOWN_DATA_SHAPE>> {
		const response = await fetch(PUBLIC_BACKEND_URL + `/api/list/${data.listId}/items`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${data.token}`
			}
		});

		if (response.status === 200) {
			const parsed = parseResponse(await response.json(), getItemsResponseSchema);
			if (parsed.success) {
				const items = parsed.data.map((item) => {
					return { ...item, listId: data.listId };
				});
				return success({
					items
				});
			} else {
				console.log(parsed.error);
				return failure(parsed.error, UNKNOWN_DATA_SHAPE_CODE);
			}
		}

		const errorText = await response.text();

		return failure(errorText, UNKNOWN_DATA_SHAPE_CODE);
	}
}
