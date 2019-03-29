import Sample from "./entity/Sample";
import Service from "./service/Service";
import Visualisation from "./entity/Visualisation";

function test() {
    let visualisationService: Service<Visualisation> = new Service<Visualisation>(Visualisation);
    visualisationService.retrieve("80").then(result => {
        console.log(result);
    });

    let sampleService: Service<Sample> = new Service<Sample>(Sample);
    sampleService.retrieve("46").then(result => {
        console.log(result);
    });
}

test();
