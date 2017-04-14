import {appModule} from "./app.module";
import "jquery";
import * as Inputmask from "inputmask";

export class AppComponent {
    constructor(private $element) {
        const input = this.$element.find("input");
        const mask = new Inputmask("99");
        mask.mask(input[0]);
    }
}

appModule.component("myApp", {
    controller: AppComponent,
    template: require("./app.component.html"),
});
