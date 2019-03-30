import {DecoratorType, genericArrayDecorator, genericDecorator} from "./genericDecorator";

export function StoreArray(type) {
    return genericArrayDecorator(DecoratorType.STORE_ARRAY_TYPE, type);
}
