"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var app_module_1 = require("./app.module");
var Inputmask = require("inputmask");
function onKeyDown(e, buffer, caretPos) {
    var ascii0 = "0".charCodeAt(0);
    var ascii9 = "9".charCodeAt(0);
    if (e.which < ascii0 || e.which > ascii9) {
        return buffer;
    }
    var buf = buffer.concat([]);
    buf[caretPos] = String.fromCharCode(e.which);
    return buf;
}
function time_onKeyDown(e, buffer, caretPos, opts) {
    var buf = onKeyDown(e, buffer, caretPos);
    if (!buf) {
        return null;
    }
    var P = opts.placeholder;
    if (caretPos == 0 || caretPos == 1) {
        var ch1 = buf[0];
        var ch2 = buf[1];
        if (ch1 != P && ch2 != P) {
            var hours = parseInt(ch1 + ch2);
            if (hours > 23) {
                return null;
            }
        }
    }
    if (caretPos == 3 || caretPos == 4) {
        var ch3 = buf[3];
        var ch4 = buf[4];
        if (ch3 != P && ch4 != P) {
            var minutes = parseInt(ch3 + ch3);
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
        onKeyDown: function (e, buffer, caretPos, opts) {
            if (!time_onKeyDown(e, buffer, caretPos, opts)) {
                e.preventDefault();
            }
        }
    }
});
Inputmask.extendAliases({
    "timeSpan": {
        mask: "9.99:99",
        placeholder: "#",
        onKeyDown: function (e, buffer, caretPos, opts) {
            var buf = buffer.slice(2);
            if (!time_onKeyDown(e, buf, caretPos - 2, opts)) {
                e.preventDefault();
            }
        }
    }
});
var InputMaskComponent = (function () {
    function InputMaskComponent($element) {
        this.$element = $element;
        this.input = this.$element.find("input");
        if (!this.input.length) {
            throw new Error("Failed to find input element inside component template");
        }
        this.mask = null;
    }
    InputMaskComponent.prototype.$onChanges = function () {
        console.log("$onChanges");
        console.log("    type", this.iType);
        console.log("    maxLength", this.iMaxLength);
        this.prepareInputs();
        this.mask = this.type.create(this);
        this.mask.mask(this.input);
    };
    InputMaskComponent.prototype.prepareInputs = function () {
        var type = InputMaskTypes.find(this.iType);
        if (type == null) {
            throw new Error("InputMask.type \"" + this.iType + "\" is not valid");
        }
        var maxLength = undefined;
        if (this.iMaxLength !== undefined) {
            maxLength = parseInt(this.iMaxLength);
            if (isNaN(maxLength)) {
                throw new Error("InputMask.maxLength \"" + this.iMaxLength + "\" is not valid");
            }
        }
        this.type = type;
        this.maxLength = maxLength;
    };
    return InputMaskComponent;
}());
exports.InputMaskComponent = InputMaskComponent;
var InputMaskType = (function () {
    function InputMaskType(name) {
        this.name = name;
    }
    return InputMaskType;
}());
exports.InputMaskType = InputMaskType;
var InputMaskTypeInteger = (function (_super) {
    __extends(InputMaskTypeInteger, _super);
    function InputMaskTypeInteger() {
        return _super.call(this, "integer") || this;
    }
    InputMaskTypeInteger.prototype.create = function (component) {
        var str = "(+|-)9{1,";
        str += (component.maxLength + "}");
        return new Inputmask(str, {
            greedy: false,
            clearMaskOnLostFocus: false,
        });
    };
    return InputMaskTypeInteger;
}(InputMaskType));
var InputMaskTypeDouble = (function (_super) {
    __extends(InputMaskTypeDouble, _super);
    function InputMaskTypeDouble() {
        return _super.call(this, "double") || this;
    }
    InputMaskTypeDouble.prototype.create = function (component) {
        var str = "[(+|-)]9{1,5}.9{1,5}";
        return new Inputmask(str, {
            greedy: false,
            clearMaskOnLostFocus: false,
        });
    };
    return InputMaskTypeDouble;
}(InputMaskType));
var InputMaskTypeDate = (function (_super) {
    __extends(InputMaskTypeDate, _super);
    function InputMaskTypeDate() {
        return _super.call(this, "date") || this;
    }
    InputMaskTypeDate.prototype.create = function (component) {
        var str = "dd/mm/yyyy";
        return new Inputmask(str, {
            greedy: false,
            clearMaskOnLostFocus: false,
        });
    };
    return InputMaskTypeDate;
}(InputMaskType));
var InputMaskTypeTime = (function (_super) {
    __extends(InputMaskTypeTime, _super);
    function InputMaskTypeTime() {
        var _this = _super.call(this, "time") || this;
        _this.placeholder = "#";
        _this.placeholder = "#";
        _this.ascii0 = "0".charCodeAt(0);
        _this.ascii9 = "9".charCodeAt(0);
        return _this;
    }
    InputMaskTypeTime.prototype.create = function (component) {
        var str = "time";
        return new Inputmask(str, {
            greedy: false,
            clearMaskOnLostFocus: false,
        });
    };
    InputMaskTypeTime.prototype.validate = function (buf, caretPos) {
        var P = this.placeholder;
        if (caretPos == 0 || caretPos == 1) {
            var ch1 = buf[0];
            var ch2 = buf[1];
            if (ch1 != P && ch2 != P) {
                var hours = parseInt(ch1 + ch2);
                if (hours > 23) {
                    return false;
                }
            }
        }
        if (caretPos == 3 || caretPos == 4) {
            var ch3 = buf[3];
            var ch4 = buf[4];
            if (ch3 != P && ch4 != P) {
                var minutes = parseInt(ch3 + ch3);
                if (minutes > 59) {
                    return false;
                }
            }
        }
        return true;
    };
    return InputMaskTypeTime;
}(InputMaskType));
var InputMaskTypeTimeSpan = (function (_super) {
    __extends(InputMaskTypeTimeSpan, _super);
    function InputMaskTypeTimeSpan() {
        return _super.call(this, "timeSpan") || this;
    }
    InputMaskTypeTimeSpan.prototype.create = function (component) {
        var str = "timeSpan";
        return new Inputmask(str, {
            greedy: false,
            clearMaskOnLostFocus: false,
        });
    };
    return InputMaskTypeTimeSpan;
}(InputMaskType));
var InputMaskTypes = (function () {
    function InputMaskTypes(name) {
        this.name = name;
    }
    InputMaskTypes.find = function (type) {
        return this.All.find(function (t) { return t.name == type; });
    };
    InputMaskTypes.isValid = function (type) {
        return this.All.findIndex(function (t) { return t.name == type; }) != -1;
    };
    return InputMaskTypes;
}());
InputMaskTypes.SignedInteger = new InputMaskTypeInteger();
InputMaskTypes.Double = new InputMaskTypeDouble();
InputMaskTypes.Date = new InputMaskTypeDate();
InputMaskTypes.Time = new InputMaskTypeTime();
InputMaskTypes.TimeSpan = new InputMaskTypeTimeSpan();
InputMaskTypes.All = [
    InputMaskTypes.SignedInteger,
    InputMaskTypes.Double,
    InputMaskTypes.Date,
    InputMaskTypes.Time,
    InputMaskTypes.TimeSpan,
];
exports.InputMaskTypes = InputMaskTypes;
app_module_1.appModule.component("inputMask", {
    controller: InputMaskComponent,
    template: require("./inputMask.component.html"),
    bindings: {
        iType: "<type",
        iMaxLength: "<maxLength"
    }
});
//# sourceMappingURL=inputMask.component.js.map