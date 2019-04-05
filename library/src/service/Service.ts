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
    private baseURL: string;

    constructor(x: (new () => T), baseURL: string) {
        this.type = x.name;
        this.typeClass = x;
        this.baseURL = baseURL;

        if (!this.baseURL.endsWith('/')) {
            this.baseURL += '/';
        }
    }

    async retrieve(id: string = null, params: object = {}, endPoint: string = null, urlParams: any = {}, axiosConfig: object = {}): Promise<Status<T>> {
        try {
            if (params) {
                axiosConfig["params"] = params;
            }

            let result: any = await axios.get(this.resolveUrl(endPoint, urlParams, id), axiosConfig);
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

            if (this.isPrimitive(property["type"].name)) {
                for (let arrayEl of data[key]) {
                    payload[key].push(arrayEl)
                }
            } else {
                for (let arrayEl of data[key]) {
                    payload[key].push(this.parseObject(arrayEl, property['type']))
                }
            }
        }

        payload.id = data.id;
        return payload;
    }

    async store(item: T, params: object = {}, endPoint: string = null, urlParams: any = {}, axiosConfig: object = {}): Promise<Status<void>> {
        try {
            if (params) {
                axiosConfig["params"] = params;
            }

            let result: any = await axios.post(this.resolveUrl(endPoint, urlParams), this.produceJSONObject(item, DecoratorType.STORE_TYPE, DecoratorType.STORE_ARRAY_TYPE), axiosConfig);
            return new Status(true, null, null);
        } catch (error) {
            console.error(error);
            return new Status(false, error, null);
        }
    }

    async update(item: T, params: object = {}, endPoint: string = null, urlParams: any = {}, axiosConfig: object = {}): Promise<Status<void>> {
        try {
            if (params) {
                axiosConfig["params"] = params;
            }

            let response: any = await axios.post(this.resolveUrl(endPoint, urlParams, item.id), this.produceJSONObject(item, DecoratorType.UPDATE_TYPE, DecoratorType.UPDATE_ARRAY_TYPE), axiosConfig);
            return new Status(true, null, null);
        } catch (error) {
            console.error(error);
            return new Status(false, error, null);
        }
    }

    async delete(item: T, params: object = {}, endPoint: string = null, urlParams: any = {}, axiosConfig: object = {}): Promise<Status<T>> {
        try {
            if (params) {
                axiosConfig["params"] = params;
            }

            await axios.delete(this.resolveUrl(endPoint, urlParams, item.id), axiosConfig);
            return new Status<T>(true, null, null);
        } catch (error) {
            console.error(error);
            return new Status<T>(false, error);
        }
    }

    async list(page: number, size: number, params: object = {}, endPoint: string = null, urlParams: object = {}, axiosConfig: object = {}): Promise<Status<Paginated<T>>> {
        try {
            axiosConfig["params"] = {
                ...params, ...{
                    page: page,
                    size: size
                }
            };

            let response: any = await axios.get(this.resolveUrl(endPoint, urlParams), axiosConfig);

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

    private getUrl(endPoint: String): string {
        if (endPoint !== null) {
            return this.baseURL + endPoint;
        } else {
            return this.baseURL + pluralize.plural(this.type.toLowerCase());
        }
    }

    /**
     * Fills in all the required params indicated in URL by :<name> with their corresponding value in urlParams.
     *
     * @param url
     * @param urlParams
     */
    private fillUrl(url: string, urlParams: any): string {
        let regex = /<<[^<>]*>>/;
        let match = regex.exec(url);

        while (match !== null) {
            let paramName = match[0].substring(2, match[0].length - 2);
            url = url.replace(match[0], urlParams[paramName]);
            match = regex.exec(url);
        }

        return url;
    }

    private resolveUrl(endPoint: string, urlParams: any, id: string = null): string {
        let computedUrl: string = this.getUrl(endPoint);
        // When no endPoint was specifically given, the id is automatically filled in and appended. Otherwise, the
        // provider of the URL must also account for the id-parameter in the URL.
        if (endPoint !== null || id === null) {
            return this.fillUrl(computedUrl, urlParams);
        } else {
            return this.fillUrl(computedUrl + "/<<id>>", {
                id: id
            });
        }
    }
}
