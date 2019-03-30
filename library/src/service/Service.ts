import Entity from "../entity/Entity";
import Status from "./Status";
import axios from "axios";
import pluralize from "pluralize";
import {DecoratorType} from "../decorators/genericDecorator";

export default class Service<T extends Entity> {
    private type: string;
    private typeClass: any;
    private baseURL: string;

    constructor(x: (new () => T), baseURL: string) {
        this.type = x.name;
        this.typeClass = x;
        this.baseURL = baseURL;
    }

    async retrieve(id: string): Promise<Status<T>> {
        try {
            let result: any = await axios.get(this.baseURL + pluralize.plural(this.type.toLowerCase()) + "/" + id);
            return new Status(true, "", this.parseObject(result.data, this.typeClass));
        } catch(error) {
            console.error(error);
            return new Status(false, error);
        }
    }

    private parseObject(data: any, typeClass): any {
        let payload = new typeClass();
        for (let property of payload.getServiceProperties(DecoratorType.READ_TYPE)) {
            let key = property["key"].substr(1);

            if (!this.isPrimitive(property["type"].name)) {
                payload[key] = this.parseObject(data[key], property["type"]);
            } else {
                if (!data.hasOwnProperty(key)) {
                    console.info("WARNING: property " + key + " was not found in response results!");
                }
                payload[key] = data[key];
            }
        }

        for (let property of payload.getServiceProperties(DecoratorType.READ_ARRAY_TYPE)) {
            // Remove leading '_' from input
            let key = property["key"].substr(1);

            if (!data.hasOwnProperty(key)) {
                console.log("WARNING: property " + key + " was not found in response results!");
            }

            payload[key] = [];

            for (let arrayEl of data[key]) {
                payload[key].push(this.parseObject(arrayEl, property['type']))
            }
        }

        payload.id = data.id;
        return payload;
    }

    async store(item: T): Promise<Status<void>> {
        try {
            let result: any = await axios.post(this.baseURL + pluralize.plural(this.type), this.produceJSONObject(item, DecoratorType.STORE_TYPE, DecoratorType.STORE_ARRAY_TYPE));
            return new Status(true, null, null);
        } catch (error) {
            console.error(error);
            return new Status(false, error, null);
        }
    }

    private produceJSONObject(object: Entity, singularType: DecoratorType, arrayType: DecoratorType) {
        let output = {};
        for (let prop of object.getServiceProperties(singularType)) {
            let serializedKey = prop["key"].substr(1);
            if (!object.hasOwnProperty(prop["key"])) {
                console.info("Tried to serialize not-existing property: " + serializedKey);
            }

            if (this.isPrimitive(prop["type"].name)) {
                output[serializedKey] = this.produceJSONObject(object[prop["key"]], singularType, arrayType);
            } else {
                output[serializedKey] = object[prop["key"]];
            }
        }

        for (let prop of object.getServiceProperties(arrayType)) {
            let serializedKey = prop["key"].substr(1);
            if (this.isPrimitive(prop["type"].name)) {
                output[serializedKey] = object[prop["key"]];
            } else {
                output[serializedKey] = [];
                for (let val of object[prop["key"]]) {
                    output[serializedKey].push(this.produceJSONObject(val), singularType, arrayType);
                }
            }
        }

        return output;
    }

    private isPrimitive(typeName: string): boolean {
        return typeName === "String" || typeName === "number";
    }

    //
    // async update(item: T): Promise<Status<void>> {
    //     try {
    //         let response: any = await client.post(this.name + "/" + item.id, item.getUpdateJson());
    //         return new Status(true);
    //     } catch (error) {
    //         console.log(error);
    //         return new Status(false, error);
    //     }
    // }
    //
    // async list(page: number, size: number): Promise<Status<T[]>> {
    //     try {
    //
    //         let response: any = await client.get(this.name + "s", {
    //                 params: {
    //                     page: page,
    //                     size: size
    //                 }
    //             }
    //         );
    //
    //         let payload: T[] = [];
    //         for (let item of response.data.items) {
    //             let created: T = new this.typeClass();
    //             for (let property of created.getReadProperties()) {
    //                 // Remove leading '_' from input
    //                 property = property.substr(1);
    //                 if (!item.hasOwnProperty(property)) {
    //                     throw "Property " + property + " was not found in response results!";
    //                 }
    //
    //                 created[property] = item[property];
    //             }
    //             created.id = item.id;
    //             payload.push(created);
    //         }
    //
    //         return new Status(true, "", payload);
    //     } catch (error) {
    //         console.log(error);
    //         return new Status(false, error);
    //     }
    // }
    //
    // async delete(item: T): Promise<Status<T>> {
    //     try {
    //         await client.delete(this.name + "s/" + item.id);
    //         return new Status<T>(true);
    //     } catch (error) {
    //         console.log(error);
    //         return new Status<T>(false, error);
    //     }
    // }
}
