"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var ReferencesPipe = (function () {
    function ReferencesPipe() {
    }
    ReferencesPipe.prototype.transform = function (value) {
        var result = "";
        var ref = value.trim();
        if (ref.length == 0) {
            return result;
        }
        var isLink = ref.toLowerCase().indexOf("http") == 0;
        if (!isLink) {
            if (ref.length > 200) {
                result += ref.substr(0, 200) + "&hellip;";
            }
            else {
                result += ref;
            }
        }
        else {
            result += "<a target=\"_blank\" href=\"" + ref + "\">";
            if (ref.length > 60) {
                result += (ref.substr(0, 60) + "&hellip;");
            }
            else {
                result += ref;
            }
            result += "</a>";
        }
        return result;
    };
    ReferencesPipe = __decorate([
        core_1.Pipe({ name: 'references' })
    ], ReferencesPipe);
    return ReferencesPipe;
}());
exports.ReferencesPipe = ReferencesPipe;
