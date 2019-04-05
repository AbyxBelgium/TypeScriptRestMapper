import {Pagination} from "./Pagination";

export class Paginated<T> {
    private _pagination: Pagination;
    private _items: T[];

    set pagination(value: Pagination) {
        this._pagination = value;
    }

    set items(value: T[]) {
        this._items = value;
    }

    get pagination(): Pagination {
        return this._pagination;
    }

    get items(): T[] {
        return this._items;
    }
}
