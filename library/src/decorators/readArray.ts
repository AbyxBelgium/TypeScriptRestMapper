import {DecoratorType, genericDecorator} from "./genericDecorator";

export function ReadArray(type) {
    return genericDecorator(DecoratorType.READ_ARRAY_TYPE);
}
