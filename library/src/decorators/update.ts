import "reflect-metadata";

export function Update(path: string = "") {
    return function(target: any, key: string) {
        let t = Reflect.getMetadata("design:type", target, key);
        if (!target.hasOwnProperty("_update_properties")) {
            target["_update_properties"] = [];
        }
        target["_update_properties"].push({
            key: key,
            type: t
        });
    }
}
