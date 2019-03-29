import Entity from "../entity/Entity";
import Status from "./Status";
import axios from "axios";
import pluralize from "pluralize";

export default class Service<T extends Entity> {
    private type: string;
    private typeClass: any;

    constructor(x: (new () => T)) {
        this.type = x.name;
        this.typeClass = x;
    }

    async retrieve(id: string): Promise<Status<T>> {
        try {
            let result: any = await axios.get("http://localhost:8090/" + pluralize.plural(this.type.toLowerCase()) + "/" + id);
            return new Status(true, "", this.parseObject(result.data, this.typeClass));
        } catch(error) {
            console.log(error);
            return new Status(false, error);
        }
    }

    private parseObject(data: any, typeClass): any {
        let payload = new typeClass();
        for (let property of payload.getReadProperties()) {
            let key = property["key"].substr(1);

            if (property["type"].name !== 'String' && property["type"].name !== 'Number') {
                payload[key] = this.parseObject(data[key], property["type"]);
            } else {
                if (!data.hasOwnProperty(key)) {
                    console.info("WARNING: property " + key + " was not found in response results!");
                }
                payload[key] = data[key];
            }
        }

        for (let property of payload.getArrayReadProperties()) {
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

    // async store(item: T): Promise<Status<void>> {
    //     try {
    //         let result: any = await client.post(this.name + "s", item.getStoreJson());
    //         return new Status(true);
    //     } catch (error) {
    //         console.log(error);
    //         return new Status(false, error);
    //     }
    // }
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
