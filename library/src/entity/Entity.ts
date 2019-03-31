import {DecoratorType} from "../decorators/genericDecorator";
import {Read} from "../decorators/read";
import {Update} from "../decorators/update";

export default abstract class Entity {
    @Read()
    @Update()
    private _id: string;

    get id(): string {
        return this._id;
    }

    set id(value: string) {
        this._id = value;
    }

    getServiceProperties(type: DecoratorType) {
        if (!this[type]) {
            return [];
        }

        return this[type];
    }
}
