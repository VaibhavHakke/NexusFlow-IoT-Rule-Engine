const { of } = require("rxjs");
const { map, filter } = require("rxjs/operators");

const temperature$ = of(20, 30, 40, 50);

temperature$
    .pipe(
        map(celsius => celsius * 9 / 5 + 32),
        filter(fahrenheit => fahrenheit > 100)
    )
    .subscribe(value => {
        console.log("🚨 Alert:", value);
    });