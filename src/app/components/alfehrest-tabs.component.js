"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var AlfehrestTabsComponent = (function () {
    function AlfehrestTabsComponent() {
        this.data = null;
        this.activeTab = null;
        this.scrolling = false;
        this.scrollTimeout = null;
    }
    AlfehrestTabsComponent.prototype.ngOnChanges = function (changes) {
        //This is an initial load
        if (changes.data && !changes.data.previousValue.sections && this.data) {
            this.activeTab = this.data.sections[0].cls;
        }
    };
    AlfehrestTabsComponent.prototype.ngOnInit = function () {
    };
    AlfehrestTabsComponent.prototype.onTabClicked = function (ev) {
        debugger;
        this.activeTab = ev.target.classList[0];
    };
    __decorate([
        core_1.Input('data')
    ], AlfehrestTabsComponent.prototype, "data");
    AlfehrestTabsComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: "alfehrest-tabs",
            template: "\n        <ul class=\"tabs\" simplescroll>\n            <li\n                *ngFor=\"let sect of data.sections\" \n                [innerHTML]=\"sect.cls\" \n                class=\"{{sect.cls}}\"\n                [ngClass]=\"{'active': (sect.cls === activeTab)}\"\n                (click)=\"onTabClicked($event)\">\n            </li>\n        </ul>\n        <div\n            *ngFor=\"let item of data.sections\" \n            [ngSwitch]=\"item.type\" \n            class=\"tab-body {{item.cls}}\" [ngClass]=\"{'active': item.cls === activeTab}\">\n                <p *ngSwitchCase=\"'text'\" [innerHTML]=\"item.content\"></p>\n                <ol *ngSwitchCase=\"'list'\">\n                    <li *ngFor=\"let ref of item.content\" [innerHTML]=\"ref | references\"></li>\n                </ol>\n                <ol *ngSwitchCase=\"'bib'\">\n                    <li *ngFor=\"let ref of item.content\" [innerHTML]=\"ref | publication\"></li>\n                </ol>\n        </div>\n    ",
            styles: ["\n        :host {\n            display: flex;   \n            height: 100%;\n            width: 100%;\n        }\n        \n        ul {\n           position: relative;\n            list-style: none;\n            margin: 0;\n            padding: 0;\n            margin-right: 5px;\n            z-index: 5;\n        }\n        \n        li {\n            padding:5px;\n            display: block;\n            background-color:red;\n            color:green;\n            border:2px solid silver;\n            z-index: 55;\n            cursor: pointer;\n             \n        }\n\n        li.active {\n            border-right:0;\n            background-color: white;\n            z-index: 0;\n            width: 101%;\n        }\n        \n        .tab-body {\n            box-shadow: -4px 0 5px -2px #444;\n            background-color: white;\n            flex-grow: 1;\n            z-index: 0;\n            display:none;\n            overflow-y:scroll;\n        }\n        \n        .tab-body.active {\n            display: block;\n        }\n        \n        p {\n            color:black;\n        }\n    "]
        })
    ], AlfehrestTabsComponent);
    return AlfehrestTabsComponent;
}());
exports.AlfehrestTabsComponent = AlfehrestTabsComponent;
