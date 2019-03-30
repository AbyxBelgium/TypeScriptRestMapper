export function UpdateArray(type) {
    return function(target: any, key: string) {
        if (!target.hasOwnProperty("_update_array_properties")) {
            target["_update_array_properties"] = [];
        }
        target["_update_array_properties"].push({
            key: key,
            type: type
        });
    }
}
