import Sample from "./entity/Sample";
import Service from "./service/Service";
import Visualisation from "./entity/Visualisation";

function test() {
    let visualisationService: Service<Visualisation> = new Service<Visualisation>(Visualisation, "http://localhost:8090/");
    visualisationService.retrieve("80").then(result => {
        console.log(result);
        visualisationService.store(result.payload);
    });

    let sampleService: Service<Sample> = new Service<Sample>(Sample, "http://localhost:8090/");
    sampleService.retrieve("46").then(result => {
        console.log(result);
    });
}

test();
