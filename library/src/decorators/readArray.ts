export function ReadArray(type) {
    return function(target: any, key: string) {
        if (!target.hasOwnProperty("_store_properties")) {
            target["_read_array_properties"] = [];
        }
        target["_read_array_properties"].push({
            key: key,
            type: type
        });
    }
}
