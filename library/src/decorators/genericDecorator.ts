import "reflect-metadata";

export enum DecoratorType {
    READ_TYPE = "_read_properties",
    STORE_TYPE = "_store_properties",
    UPDATE_TYPE = "_update_properties",
    READ_ARRAY_TYPE = "_read_array_properties",
    STORE_ARRAY_TYPE = "_store_array_properties",
    UPDATE_ARRAY_TYPE = "_update_array_properties"
}

export function genericDecorator(decoratorType: string) {
    return function(target: any, key: string) {
        let t = Reflect.getMetadata("design:type", target, key);
        if (!target.hasOwnProperty(decoratorType)) {
            target[decoratorType] = [];
        }
        target[decoratorType].push({
            key: key,
            type: t
        });
    }
}

export function genericArrayDecorator(decoratorType: string, arrayType) {
    return function(target: any, key: string) {
        if (!target.hasOwnProperty(decoratorType)) {
            target[decoratorType] = [];
        }
        target[decoratorType].push({
            key: key,
            type: arrayType
        });
    }
}
