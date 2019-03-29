import Entity from "./Entity";
import {Read} from "../decorators/read";
import Feature from "./Feature";
import {ReadArray} from "../decorators/readArray";

export default class Sample extends Entity {
    @Read()
    private _name: string;
    @Read()
    private _description: string;
    @ReadArray(Feature)
    private _features: Feature[];

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

    get features(): Feature[] {
        return this._features;
    }

    set features(value: Feature[]) {
        this._features = value;
    }
}
