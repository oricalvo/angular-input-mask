"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var angular = require("angular");
var app_module_1 = require("./app.module");
var app_component_1 = require("./app.component");
var inputMask_component_1 = require("./inputMask.component");
var components = [
    app_component_1.AppComponent,
    inputMask_component_1.InputMaskComponent,
];
angular.bootstrap(document.querySelector("html"), [app_module_1.appModule.name]);
//# sourceMappingURL=main.js.map