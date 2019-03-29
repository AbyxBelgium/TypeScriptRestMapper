import "reflect-metadata";

export function Read(path: string = "") {
    return function(target: any, key: string) {
        let t = Reflect.getMetadata("design:type", target, key);
        if (!target.hasOwnProperty("_read_properties")) {
            target["_read_properties"] = [];
        }
        target["_read_properties"].push({
            key: key,
            type: t
        });
    }
}

