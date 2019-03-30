import {DecoratorType, genericDecorator} from "./genericDecorator";

export function UpdateArray(type) {
    return genericDecorator(DecoratorType.UPDATE_ARRAY_TYPE);
}
