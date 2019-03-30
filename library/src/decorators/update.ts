import "reflect-metadata";
import {DecoratorType, genericDecorator} from "./genericDecorator";

export function Update(path: string = "") {
    return genericDecorator(DecoratorType.UPDATE_TYPE);
}
