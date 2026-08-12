const { of } = require("rxjs");
const { filter } = require("rxjs/operators");

const sensorData$ = of(70, 75, 82, 90, 65);

sensorData$
    .pipe(
        filter(value => value > 80)
    )
    .subscribe(value => {
        console.log("🚨 ALERT! High temperature:", value);
    });