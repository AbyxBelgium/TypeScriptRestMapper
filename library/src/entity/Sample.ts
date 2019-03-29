import Entity from "./Entity";
import {Read} from "../decorators/read";

export default class Sample extends Entity {
    @Read
    private _name: string;
    @Read
    private _description: string;

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get description(): string {
        return this._description;
    }

    set description(value: string) {
        this._description = value;
    }
}
