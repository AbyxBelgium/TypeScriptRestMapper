export default abstract class Entity {
    private _id: string;

    get id(): string {
        return this._id;
    }

    set id(value: string) {
        this._id = value;
    }

    getReadProperties(): string[] {
        if (!this["_read_properties"]) {
            return [];
        }

        return this["_read_properties"];
    }

    getArrayReadProperties(): string[] {
        if (!this["_read_array_properties"]) {
            return [];
        }

        return this["_read_array_properties"];
    }

    getStoreJson(): object {
        if (!this["_store_properties"]) {
            return [];
        }

        return this.getJson("_store_properties");
    }

    getUpdateJson(): object {
        if (!this["_update_properties"]) {
            return [];
        }

        return this.getJson("_update_properties");
    }

    private getJson(propertyType: string): object {
        let output = {};

        if (!this[propertyType]) {
            throw "No valid properties are set to be stored or updated on this object! Please use the @Store or @Update decorators on the desired fields.";
        }

        for (let field of this[propertyType]) {
            output[field.substr(1)] = this[field];
        }

        return output;
    }
}
