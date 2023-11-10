'use strict';

const { readdirSync, statSync, unlinkSync } = require('fs');
const { join } = require('path');

(() => {
    const dir = join(__dirname, './node_modules');

    let total = 0;

    function step(dir) {
        total++;
        const names = readdirSync(dir);

        names.forEach((name) => {
            const file = join(dir, name);
            const stat = statSync(file);
            if (stat.isDirectory()) {
                step(file);
            } else {
                if (/.d.ts$/.test(file)) {
                    unlinkSync(file);
                } else {
                    total++;
                }
            }
        });
    }

    step(dir);
    console.log(total);
})();
