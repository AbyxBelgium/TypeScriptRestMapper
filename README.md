# TypeScriptRestMapper
The TypeScript REST Mapper package provides an easy-to-use and efficient way to automatically construct a service, which is capabel of performing REST CRUD-operations. No need to manually perform HTTP-requests, receive results, perform error handling and parse JSON into true TypeScript-objects. You only need to instanciate a new Service, with the correct type of object and you can start consuming REST API's immediatly.

Features:
 * Automatically perform HTTP REST requests
 * Resulting JSON is magically transformed into true TypeScript-objects by using neat annotations
 * Nested TypeScript-objects / arrays are fully supported to an arbitrary level of depth
 * Endpoint's name is automatically derived from classname provided to service (even plurafying the classname automatically where necessary)
 * Completely configurable. This package is built on top of Axios, one of the most popular JavaScript HTTP-libraries out there. All of Axios options can be set through this package, yielding full flexibility.
 * Built-in support for Date-objects.
 
See our (quickstart)[https://github.com/AbyxBelgium/TypeScriptRestMapper/wiki/Quickstart] and start developing with TypeScript REST Mapper right now.
 
**NOTE: This package is still under development, and as a consequence documentation is still under development. I don't think the API will change in the future, but changes are not ruled out.**

Latest changes (v1.0.17):
* Fixed update-method always performed HTTP POST-request instead of HTTP PUT-request.

## Installation
TypeScriptRestMapper is available on NPM, and can be installed using `npm install typescript-rest-mapper`. Note that you must enable support for decoraters in your `tsconfig.json` by adding `"experimentalDecorators": true` and `"emitDecoratorMetadata": true` to the `compilerOptions`.

## Quick example
This package exposes a class called `Entity`. Every TypeScript-class for which JSON-objects are retrieved from an API, should extend the `Entity`-class. TypeScriptRestMapper exposes 4 different types of decorators, that can be used inside of a class to indicate which properties should be serialised and read for which type of REST-operation.

In the following example, a server returns samples from a url of this format: "http://example.com/samples/id". The result of calling "http://example.com/samples/46" is for example:

```json
{
    "id": 46,
    "name": "Blub",
    "description": "Lorem ipsum dolor sit amet.",
    "createdAt": "2019-04-02T11:39:52.927277Z",
    "features": [
        {
            "id": 9,
            "name": "CD45RA"
        },
        {
            "id": 11,
            "name": "CD4"
        }
    ]
}
```

A sample contains an array of nested `Feature`-objects. To be able to query a similar URL, we need to create 2 classes: one for samples and one for features.

Sample:
```typescript
export default class Sample extends Entity {
    @Read() @Store() @Update()
    private _name: string = "";
    @Read() @Store() @Update()
    private _description: string = "";
    @Read()
    private _createdAt: Date = new Date();
    @ReadArray(Feature)
    private _features: Feature[] = [];

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get description(): string {
        return this._description;
    }

    set description(value: string) {
        this._description = value;
    }

    get features(): Feature[] {
        return this._features;
    }

    set features(data: Feature[]) {
        this._features = data;
    }

    get createdAt() {
        return this._createdAt;
    }

    set createdAt(value: Date) {
        this._createdAt = value;
    }
}
```

Feature:
```typescript
export default class Feature extends Entity {
    @Read()
    private _name: string;

    get name(): string {
        return this._name;
    }

    set name(name: string) {
        this._name = name;
    }
}
```

Querying the given API is now as simple as creating a new instance of `Service<Sample>` and calling the associated `retrieve(id)` method:

```typescript
let sampleService = new Service<Sample>(Sample);
let result = await sampleService.retrieve(46);

if (result.successfull) {
    let sample: Sample = result.payload;
} else {
    console.error("Something went wrong: " + result.errorMessage);
}
```

The result of this operation is a TypeScript-object of the `Sample`-class that contains an array of nested `Feature`-objects.

## Documentation
Full documentation for this package is still under construction. Checkout our wiki in the future for the full documentation.
