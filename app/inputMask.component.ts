import {appModule} from "./app.module";
import * as Inputmask from "inputmask";
import {isNullOrUndefined} from "util";

function onKeyDown(e, buffer, caretPos) {
    const ascii0 = "0".charCodeAt(0);
    const ascii9 = "9".charCodeAt(0);
    if(e.which<ascii0 || e.which>ascii9) {
        return buffer;
    }

    const buf = buffer.concat([]);
    buf[caretPos] = String.fromCharCode(e.which);
    return buf;
}

function time_onKeyDown(e, buffer, caretPos, opts) {
    const buf = onKeyDown(e, buffer, caretPos);
    if (!buf) {
        return null;
    }

    const P = opts.placeholder;

    if (caretPos == 0 || caretPos == 1) {
        const ch1 = buf[0];
        const ch2 = buf[1];
        if (ch1 != P && ch2 != P) {
            const hours = parseInt(ch1 + ch2);
            if (hours > 23) {
                return null;
            }
        }
    }

    if (caretPos == 3 || caretPos == 4) {
        const ch3 = buf[3];
        const ch4 = buf[4];
        if (ch3 != P && ch4 != P) {
            const minutes = parseInt(ch3 + ch3);
            if (minutes > 59) {
                return null;
            }
        }
    }

    return buf;
}

Inputmask.extendAliases({
    "time": {
        mask: "99:99",
        placeholder: "#",
        onKeyDown: function(e, buffer, caretPos, opts) {
            if(!time_onKeyDown(e, buffer, caretPos, opts)) {
                e.preventDefault();
            }
        }
    }
});

Inputmask.extendAliases({
    "timeSpan": {
        mask: "9.99:99",
        placeholder: "#",
        onKeyDown: function(e, buffer, caretPos, opts) {
            const buf = buffer.slice(2);
            if(!time_onKeyDown(e, buf, caretPos-2, opts)){
                e.preventDefault();
            }
        }
    }
});

export class InputMaskComponent {
    input: JQuery;
    mask: any;

    //  internal state
    type: InputMaskType;
    maxLength: number;
    maxLengthAfterPoint: number;

    // inputs
    iType: string;
    iMaxLength: string;
    iMaxLengthAfterPoint: string;

    constructor(private $element) {
        this.input = this.$element.find("input");
        if(!this.input.length) {
            throw new Error("Failed to find input element inside component template");
        }

        this.mask = null;
    }

    $onChanges() {
        console.log("$onChanges");
        console.log("    type", this.iType);
        console.log("    maxLength", this.iMaxLength);

        this.prepareInputs();
        this.mask = this.type.create(this);
        this.mask.mask(this.input);
    }

    private prepareInputs() {
        const type = InputMaskTypes.find(this.iType);
        if(type == null) {
            throw new Error("InputMask.type \"" + this.iType + "\" is not valid");
        }

        let maxLength = undefined;
        if(this.iMaxLength!==undefined) {
            maxLength = parseInt(this.iMaxLength);
            if (isNaN(maxLength)) {
                throw new Error("InputMask.maxLength \"" + this.iMaxLength + "\" is not valid");
            }
        }

        this.type = type;
        this.maxLength = maxLength;
    }

    // private initSignedInteger() {
    //     const maskStr = "";
    //     for(let i=0; i<this.maxLength*1; i++) {
    //     }
    //     this.mask = new Inputmask("99");
    //     mask.mask(input[0]);
    //
    // }
}

export abstract class InputMaskType {
    constructor(public name: string) {
    }

    abstract create(component: InputMaskComponent);
}

class InputMaskTypeInteger extends InputMaskType {
    name: string;

    constructor() {
        super("integer");
    }

    create(component: InputMaskComponent) {
        let str = "(+|-)9{1,";
        str += (component.maxLength + "}");

        return new Inputmask(str, {
            greedy: false,
            clearMaskOnLostFocus: false,
        });
    }
}

class InputMaskTypeDouble extends InputMaskType {
    name: string;

    constructor() {
        super("double");
    }

    create(component: InputMaskComponent) {
        let str = "[(+|-)]9{1,5}.9{1,5}";

        return new Inputmask(str, {
            greedy: false,
            clearMaskOnLostFocus: false,
        });
    }
}

class InputMaskTypeDate extends InputMaskType {
    name: string;

    constructor() {
        super("date");
    }

    create(component: InputMaskComponent) {
        let str = "dd/mm/yyyy";

        return new Inputmask(str, {
            greedy: false,
            clearMaskOnLostFocus: false,
        });
    }
}

class InputMaskTypeTime extends InputMaskType {
    name: string;
    placeholder: string = "#";
    ascii0: number;
    ascii9: number;

    constructor() {
        super("time");

        this.placeholder = "#";
        this.ascii0 = "0".charCodeAt(0);
        this.ascii9 = "9".charCodeAt(0);
    }

    create(component: InputMaskComponent) {
        let str = "time";

        return new Inputmask(str, {
            greedy: false,
            clearMaskOnLostFocus: false,
        });
    }

    validate(buf: string, caretPos: number) {
        const P = this.placeholder;

        if(caretPos==0 || caretPos==1) {
            const ch1 = buf[0];
            const ch2 = buf[1];
            if (ch1 != P && ch2 != P) {
                const hours = parseInt(ch1 + ch2);
                if (hours > 23) {
                    return false;
                }
            }
        }

        if(caretPos==3 || caretPos==4) {
            const ch3 = buf[3];
            const ch4 = buf[4];
            if (ch3 != P && ch4 != P) {
                const minutes = parseInt(ch3 + ch3);
                if (minutes > 59) {
                    return false;
                }
            }
        }

        return true;
    }
}

class InputMaskTypeTimeSpan extends InputMaskType {
    name: string;

    constructor() {
        super("timeSpan");
    }

    create(component: InputMaskComponent) {
        let str = "timeSpan";

        return new Inputmask(str, {
            greedy: false,
            clearMaskOnLostFocus: false,
        });
    }
}

export class InputMaskTypes {
    static SignedInteger: InputMaskType = new InputMaskTypeInteger();
    static Double: InputMaskType = new InputMaskTypeDouble();
    static Date: InputMaskType = new InputMaskTypeDate();
    static Time: InputMaskType = new InputMaskTypeTime();
    static TimeSpan: InputMaskType = new InputMaskTypeTimeSpan();

    static All: InputMaskType[] = [
        InputMaskTypes.SignedInteger,
        InputMaskTypes.Double,
        InputMaskTypes.Date,
        InputMaskTypes.Time,
        InputMaskTypes.TimeSpan,
    ];

    constructor(public name: string) {
    }

    static find(type: string): InputMaskType {
        return this.All.find(t => t.name == type);
    }

    static isValid(type: string): boolean {
        return this.All.findIndex(t => t.name == type) != -1;
    }
}

appModule.component("inputMask", {
    controller: InputMaskComponent,
    template: require("./inputMask.component.html"),
    bindings: {
        iType: "<type",
        iMaxLength: "<maxLength"
    }
});
