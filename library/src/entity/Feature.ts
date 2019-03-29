import Entity from "./Entity";
import {Read} from "../decorators/read";

export default class Feature extends Entity {
    @Read()
    private _name: string;

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }
}
