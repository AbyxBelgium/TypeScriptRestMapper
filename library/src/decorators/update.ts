export function Update(target: any, key: string) {
    if (!target.hasOwnProperty("_update_properties")) {
        target["_update_properties"] = [key];
    } else {
        target["_update_properties"].push(key);
    }
}
