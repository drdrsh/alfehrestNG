"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var AlfehrestSliderComponent = (function () {
    function AlfehrestSliderComponent(router, route) {
        this.router = router;
        this.route = route;
        this.config = {
            'orientation': 'vertical'
        };
        this.yearStart = 700;
        this.yearEnd = 1500;
        this.ticks = [];
        this.currentValue = 14800298400000;
        this.map = null;
        this.close_button_clicked = new core_1.EventEmitter();
        this.value_sliding = new core_1.EventEmitter();
        var diff = this.yearEnd - this.yearStart;
        var tickSize = Math.round(diff / 8);
        for (var i = 0; i < 8; i++) {
            this.ticks.push(this.yearStart + (i * tickSize));
        }
        this.ticks.push(this.yearEnd);
        if (this.route.snapshot.params['time']) {
            this.currentValue = parseFloat(this.route.snapshot.params['time']) * -1;
        }
    }
    AlfehrestSliderComponent.prototype.onSlide = function (value) {
        var time = parseFloat(value) * -1;
        this.value_sliding.emit(time);
    };
    AlfehrestSliderComponent.prototype.onChange = function (value) {
        var time = parseFloat(value) * -1;
        this.router.navigate(['time', time]);
    };
    AlfehrestSliderComponent.prototype.onCloseBtnClicked = function () {
        this.close_button_clicked.emit();
    };
    __decorate([
        core_1.Output('close_button_clicked')
    ], AlfehrestSliderComponent.prototype, "close_button_clicked");
    __decorate([
        core_1.Output('value_sliding')
    ], AlfehrestSliderComponent.prototype, "value_sliding");
    AlfehrestSliderComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: "alfehrest-slider",
            template: "\n    <div class=\"container\">\n        <h1 class=\"logo\"></h1>\n        <div class=\"slider-container\">\n            <div class=\"ticks\">\n                <div *ngFor=\"let y of ticks\" [innerHTML]=\"y\"></div>\n            </div>\n            <nouislider \n                [config]=\"config\" \n                [min]=\"14800298400000\" \n                [max]=\"40077309600000\" \n                [step]=\"2592000000\" \n                (slide)=\"onSlide($event)\"\n                [(ngModel)]=\"currentValue\" \n                (change)=\"onChange($event)\"></nouislider>\n        </div>\n        <div class=\"btn-container\">\n            <button class=\"btn-close\" (click)=\"onCloseBtnClicked()\">C</button>\n            <button class=\"btn-year\" (click)=\"onYearBtnClicked()\">Y</button>\n        </div>\n    </div>\n    ",
            styles: ["\n        .container {\n            display: flex;\n            flex-direction: column;\n            justify-content: space-between; \n        }\n        .btn-container {\n            height:50px;\n            display: flex;\n            flex-direction: row-reverse;\n        }\n        .btn-container button {\n            flex-grow:2;\n        }\n        .btn-container .btn-year {\n            border-radius: 0 0 25px 0;\n            border:1px solid black;\n        }\n        .container .logo {\n            background-image: url('assets/logo.png');\n        }\n        \n        .slider-container {\n            display: flex;\n            flex-direction: row;\n            height:calc(100% - 200px);\n            justify-content: space-around;\n        }\n        .ticks {\n            display: flex;\n            flex-direction: column-reverse;\n            justify-content: space-between;\n        }\n        .ticks div {\n            height: auto;\n        }\n        nouislider {\n            height:95%;\n        }\n        :host /deep/ div {\n            height:100%;\n        }\n"]
        })
    ], AlfehrestSliderComponent);
    return AlfehrestSliderComponent;
}());
exports.AlfehrestSliderComponent = AlfehrestSliderComponent;
