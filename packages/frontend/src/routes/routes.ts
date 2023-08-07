export class Routes {
	static home = '/';
	static createItem = '/createItem';
	static createList = '/lists/create';
	static editItem(input: { itemId: string }) {
		return `/items/edit/${input.itemId}`;
	}
	static editList(input: { listId: string }) {
		return `/lists/edit/${input.listId}`;
	}
	static listChooser = '/lists/choose';
	static settings = '/settings';
	static items = '/items';
}
