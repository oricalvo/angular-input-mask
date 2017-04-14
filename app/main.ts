import * as angular from "angular";
import {appModule} from "./app.module";
import {AppComponent} from "./app.component";
import {InputMaskComponent} from "./inputMask.component";

const components = [
    AppComponent,
    InputMaskComponent,
];

angular.bootstrap(document.querySelector("html"), [appModule.name]);
