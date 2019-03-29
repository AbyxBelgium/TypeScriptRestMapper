import "reflect-metadata";

export function Read(target: any, key: string) {
    let t = Reflect.getMetadata("design:type", target, key);
    console.log(`${key} type: ${t.name}`);
    if (!target.hasOwnProperty("_read_properties")) {
        target["_read_properties"] = [key];
    } else {
        target["_read_properties"].push(key);
    }
}
