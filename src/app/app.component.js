"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var AppComponent = (function () {
    function AppComponent(dataService, translateService) {
        this.dataService = dataService;
        this.translateService = translateService;
        this.title = 'app works!';
        translateService.use('ar');
    }
    AppComponent.prototype.ngOnInit = function () {
    };
    AppComponent.prototype.onMapReady = function (map) {
        this.dataService.loadInitialData().subscribe(function (data) { return console.log(data); }, function (err) { return console.error(err); }, function () { return console.log('Authentication Complete'); });
    };
    AppComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'app-root',
            template: "<router-outlet></router-outlet>",
            styleUrls: ['app.component.css']
        })
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
