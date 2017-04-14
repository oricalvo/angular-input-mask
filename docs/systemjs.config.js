SystemJS.config({
    map: {
        "angular": "node_modules/angular/angular.js",
        "inputmask": "node_modules/inputmask/dist/jquery.inputmask.bundle.js",
        "jquery": "node_modules/jquery/dist/jquery.js",
        "text": "node_modules/systemjs-plugin-text/text.js",
        "css": "node_modules/systemjs-plugin-css/css.js",
    },
    meta: {
        "angular": {
            format: "global"
        },
        "*.html": {
            loader: "text"
        },
        "*.css": {
            loader: "css"
        },
    },
    packages: {
        "app": {
            defaultExtension: "js"
        }
    }
});
