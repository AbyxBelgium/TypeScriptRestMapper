import Sample from "./entity/Sample";
import Service from "./service/Service";

function test() {
    let sampleService: Service<Sample> = new Service<Sample>(Sample);
    sampleService.retrieve("46").then(result => {
        console.log(result);
    });
}

test();
