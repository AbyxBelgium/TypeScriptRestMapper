import {DecoratorType, genericArrayDecorator, genericDecorator} from "./genericDecorator";

export function ReadArray(type) {
    return genericArrayDecorator(DecoratorType.READ_ARRAY_TYPE, type);
}
