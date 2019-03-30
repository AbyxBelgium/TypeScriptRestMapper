export function StoreArray(type) {
    return function(target: any, key: string) {
        if (!target.hasOwnProperty("_store_array_properties")) {
            target["_store_array_properties"] = [];
        }
        target["_store_array_properties"].push({
            key: key,
            type: type
        });
    }
}
