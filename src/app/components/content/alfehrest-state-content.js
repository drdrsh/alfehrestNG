"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var AlfehrestStateContentComponent = (function () {
    function AlfehrestStateContentComponent() {
    }
    AlfehrestStateContentComponent.prototype.ngOnChanges = function (changes) {
    };
    __decorate([
        core_1.Input('id')
    ], AlfehrestStateContentComponent.prototype, "stateId");
    __decorate([
        core_1.Input('data')
    ], AlfehrestStateContentComponent.prototype, "state");
    AlfehrestStateContentComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: "alfehrest-state",
            template: "\n        <alfehrest-tabs *ngIf=\"state\" [data]=\"state.data\"></alfehrest-tabs>\n    ",
            styles: ["\n        :host {\n            height:100%;\n        }\n        p {\n        color:black;\n        }\n       \n    "]
        })
    ], AlfehrestStateContentComponent);
    return AlfehrestStateContentComponent;
}());
exports.AlfehrestStateContentComponent = AlfehrestStateContentComponent;
