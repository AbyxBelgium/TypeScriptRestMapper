import "reflect-metadata";

export function Store(path: string = "") {
    return function(target: any, key: string) {
        let t = Reflect.getMetadata("design:type", target, key);
        if (!target.hasOwnProperty("_store_properties")) {
            target["_store_properties"] = [];
        }
        target["_store_properties"].push({
            key: key,
            type: t
        });
    }
}
