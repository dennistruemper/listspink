export class Routes {
	static home = '/';
	static createItem = '/createItem';
	static createList = '/lists/create';
	static editList(input: { listId: string }) {
		return `/lists/edit/${input.listId}`;
	}
	static listChooser = '/lists/choose';
	static settings = '/settings';
	static items = '/items';
}
