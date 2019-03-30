import "reflect-metadata";
import {DecoratorType, genericDecorator} from "./genericDecorator";

export function Read(path: string = "") {
    return genericDecorator(DecoratorType.READ_TYPE);
}

