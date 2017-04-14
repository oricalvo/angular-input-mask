"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_module_1 = require("./app.module");
require("jquery");
var Inputmask = require("inputmask");
var AppComponent = (function () {
    function AppComponent($element) {
        this.$element = $element;
        var input = this.$element.find("input");
        var mask = new Inputmask("99");
        mask.mask(input[0]);
    }
    return AppComponent;
}());
exports.AppComponent = AppComponent;
app_module_1.appModule.component("myApp", {
    controller: AppComponent,
    template: require("./app.component.html"),
    styles: require("./app.component.css")
});
//# sourceMappingURL=app.component.js.map