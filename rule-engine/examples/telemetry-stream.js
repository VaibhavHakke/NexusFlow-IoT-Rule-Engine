const { Subject } = require("rxjs");
const { filter } = require("rxjs/operators");

const telemetry$ = new Subject();

telemetry$
    .pipe(
        filter(data => data.temperature > 80)
    )
    .subscribe(data => {
        console.log(
            "🚨 HIGH TEMPERATURE:",
            data.deviceId,
            data.temperature
        );
    });

telemetry$.next({
    deviceId: "TURBINE-01",
    temperature: 72
});

telemetry$.next({
    deviceId: "TURBINE-01",
    temperature: 85
});

telemetry$.next({
    deviceId: "TURBINE-01",
    temperature: 91
});