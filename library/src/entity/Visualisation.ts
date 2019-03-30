import Entity from "./Entity";
import Sample from "./Sample";
import {Read} from "../decorators/read";
import {Store} from "../decorators/store";

export default class Visualisation extends Entity {
    @Read()
    @Store()
    private _title: string;
    @Read()
    @Store()
    private _sample: Sample;

    get title(): string {
        return this._title;
    }

    set title(value: string) {
        this._title = value;
    }

    get sample(): Sample {
        return this._sample;
    }

    set sample(value: Sample) {
        this._sample = value;
    }
}
