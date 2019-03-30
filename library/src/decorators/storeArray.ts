import {DecoratorType, genericDecorator} from "./genericDecorator";

export function StoreArray(type) {
    return genericDecorator(DecoratorType.STORE_ARRAY_TYPE);
}
