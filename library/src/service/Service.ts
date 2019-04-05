import {Entity} from "../entity/Entity";
import {Status} from "./Status";
import axios from "axios";
import pluralize from "pluralize";
import {DecoratorType} from "../decorators/genericDecorator";
import {Paginated} from "./Paginated";
import {Pagination} from "./Pagination";

export class Service<T extends Entity> {
    private type: string;
    private typeClass: any;
    private endPoint: string;
    private baseURL: string;

    constructor(x: (new () => T), baseURL: string, endPoint: string = null) {
        this.type = x.name;
        this.typeClass = x;
        this.endPoint = endPoint;
        this.baseURL = baseURL;

        if (!this.baseURL.endsWith('/')) {
            this.baseURL += '/';
        }
    }

    async retrieve(id: string): Promise<Status<T>> {
        try {
            let result: any = await axios.get(this.getUrl() + "/" + id);
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

            if (!data.hasOwnProperty(key)) {
                console.info("WARNING: property " + key + " was not found in response results!");
            }

            if (this.isPrimitive(property["type"].name)) {
                payload[key] = data[key];
            } else if (property["type"].name.toLowerCase() === "date") {
                payload[property] = new Date(data[property]);
            } else {
                payload[key] = this.parseObject(data[key], property["type"]);
            }
        }

        for (let property of payload.getServiceProperties(DecoratorType.READ_ARRAY_TYPE)) {
            // Remove leading '_' from input
            let key = property["key"].substr(1);

            if (!data.hasOwnProperty(key)) {
                console.info("WARNING: property " + key + " was not found in response results!");
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
            let result: any = await axios.post(this.getUrl(), this.produceJSONObject(item, DecoratorType.STORE_TYPE, DecoratorType.STORE_ARRAY_TYPE));
            return new Status(true, null, null);
        } catch (error) {
            console.error(error);
            return new Status(false, error, null);
        }
    }

    async update(item: T): Promise<Status<void>> {
        try {
            let response: any = await axios.post(this.getUrl() + "/" + item.id, this.produceJSONObject(item, DecoratorType.UPDATE_TYPE, DecoratorType.UPDATE_ARRAY_TYPE));
            return new Status(true, null, null);
        } catch (error) {
            console.error(error);
            return new Status(false, error, null);
        }
    }

    async delete(item: T): Promise<Status<T>> {
        try {
            await axios.delete(this.getUrl() + "/" + item.id);
            return new Status<T>(true, null, null);
        } catch (error) {
            console.error(error);
            return new Status<T>(false, error);
        }
    }

    async list(page: number, size: number, params: object = {}): Promise<Status<Paginated<T>>> {
        try {
            let options = {
                ...params, ...{
                    page: page,
                    size: size
                }
            };

            let response: any = await axios.get(this.getUrl(), {
                    params: options
                }
            );

            let paginated = new Paginated<T>();
            paginated.pagination = response.data.pagination as Pagination;

            let payload: T[] = [];
            for (let item of response.data.items) {
                payload.push(this.parseObject(item, this.typeClass));
            }

            paginated.items = payload;

            return new Status(true, "", paginated);
        } catch (error) {
            console.error(error);
            return new Status(false, error);
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
                output[serializedKey] = object[prop["key"]];
            } else {
                output[serializedKey] = this.produceJSONObject(object[prop["key"]], singularType, arrayType);
            }
        }

        for (let prop of object.getServiceProperties(arrayType)) {
            let serializedKey = prop["key"].substr(1);
            if (this.isPrimitive(prop["type"].name)) {
                output[serializedKey] = object[prop["key"]];
            } else {
                output[serializedKey] = [];
                for (let val of object[prop["key"]]) {
                    output[serializedKey].push(this.produceJSONObject(val, singularType, arrayType));
                }
            }
        }

        return output;
    }

    private isPrimitive(typeName: string): boolean {
        return typeName.toLowerCase() === "string" || typeName.toLowerCase() === "number" || typeName.toLowerCase() === "boolean";
    }

    private getUrl(): string {
        if (this.endPoint) {
            return this.baseURL + this.endPoint;
        } else {
            return this.baseURL + pluralize.plural(this.type.toLowerCase());
        }
    }
}
