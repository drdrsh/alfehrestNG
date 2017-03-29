"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var AlfehrestSidePanelComponent = (function () {
    function AlfehrestSidePanelComponent() {
    }
    AlfehrestSidePanelComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: "alfehrest-side-panel",
            template: "\n        <ul>\n            <li class='about'>\u0639\u0646 \u0627\u0644\u0641\u0647\u0631\u0633\u062A</li>\n            <li class='search'>\u0628\u062D\u062B</li>\n            <li class='settings'>\u0627\u0644\u0625\u0639\u062F\u0627\u062F\u062A</li>\n            <li class='help'>\u0645\u0633\u0627\u0639\u062F\u0629</li>\n            <li class='facebook'>\u0635\u0641\u062D\u062A\u0646\u0627 \u0639\u0644\u0649 \u0627\u0644\u0641\u064A\u0633\u0628\u0648\u0643</li>\n            <li class='twitter'>\u062D\u0633\u0627\u0628\u0646\u0627 \u0639\u0644\u0649 \u062A\u0648\u064A\u062A\u0631</li>\n            <li class='report'>\u0627\u0644\u0625\u0628\u0644\u0627\u063A \u0639\u0646 \u062E\u0637\u0623</li>\n            <li class='exit'>\u062E\u0631\u0648\u062C</li>\n        </ul>    \n    ",
            styles: ["\n        :host {\n            overflow-x: hidden;\n            overflow-y: auto;\n            color: #fff;\n            box-shadow: inset 0 0 5px 5px #222;\n            background-color: #333;\n            background-image:url('assets/logo.png');\n            background-size:65px 65px;\n            background-position:50% 95%;\n            background-repeat:no-repeat;\n            padding: 0;\n            margin: 0;\n        }\n        \n         ul{\n            margin:0;\n            padding:0;\n        }\n        \n        li {\n            cursor:pointer;\n            background-repeat:no-repeat;\n            background-position:5% 50%;\n            background-size:30px 30px;\n            text-indent:5px;\n            display: block;\n            margin: 0;\n            line-height: 48px;\n            border-top: 1px solid #4d4d4d;\n            border-bottom: 1px solid #1a1a1a;\n        }\n\n        li.facebook{\n            background-image:url('assets/facebook.png');\n        }\n        li.twitter{\n            background-image:url('assets/twitter.png');\n        }\n        li.about{\n            background-image:url('assets/about.png');\n        }\n        li.settings{\n            background-image:url('assets/settings.png');\n        }\n        li.report{\n            background-image:url('assets/report.png');\n        }\n        li.help{\n            background-image:url('assets/help.png');\n        }\n        li.search{\n            background-image:url('assets/search.png');\n        }\n\n        \n    "]
        })
    ], AlfehrestSidePanelComponent);
    return AlfehrestSidePanelComponent;
}());
exports.AlfehrestSidePanelComponent = AlfehrestSidePanelComponent;
