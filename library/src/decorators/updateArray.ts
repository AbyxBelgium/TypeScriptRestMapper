import {DecoratorType, genericArrayDecorator, genericDecorator} from "./genericDecorator";

export function UpdateArray(type) {
    return genericArrayDecorator(DecoratorType.UPDATE_ARRAY_TYPE, type);
}
