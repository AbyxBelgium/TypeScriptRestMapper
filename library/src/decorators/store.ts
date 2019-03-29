import "reflect-metadata";

export function Store(path: string = "") {
    return function(target: any, key: string) {
        if (!target.hasOwnProperty("_store_properties")) {
            target["_store_properties"] = [key];
        } else {
            target["_store_properties"].push(key);
        }
    }
}
