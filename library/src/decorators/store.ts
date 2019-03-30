import "reflect-metadata";
import {DecoratorType, genericDecorator} from "./genericDecorator";

export function Store(path: string = "") {
    return genericDecorator(DecoratorType.STORE_TYPE);
}
