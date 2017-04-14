import * as cli from "build-utils/cli";
import * as fs from "build-utils/fs";
import * as Builder from "systemjs-builder";

cli.command("docs", docs);
cli.run();

async function docs() {
    await bundle();
    await fs.copyFile("dist/app.bundle.js", "docs/app.bundle.js");
    await fs.copyFile("node_modules/systemjs/dist/system.js", "docs/system.js");
    await fs.copyFile("systemjs.config.js", "docs/systemjs.config.js");
}

function bundle() {
    var builder = new Builder('/', 'systemjs.config.js');
    return builder
        .bundle('app/main.js', 'dist/app.bundle.js')
        .then(function() {
            console.log('Build complete');
        })
        .catch(function(err) {
            console.log('Build error');
            console.log(err);
        });
}
