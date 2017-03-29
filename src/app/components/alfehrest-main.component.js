"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var environment_1 = require("../environment");
var AlfehrestMainComponent = (function () {
    function AlfehrestMainComponent(route, dataService) {
        this.route = route;
        this.dataService = dataService;
        this.isPanning = false;
        this.contentPaneOpen = false;
        this.currentCenter = null;
        this.currentDate = null;
        this.sliderHidden = false;
        this.menuOpen = false;
        this.currentTitle = null;
    }
    AlfehrestMainComponent.prototype.ngOnInit = function () {
        this.route.params.subscribe(this.onParamsChange.bind(this));
        this.dataService.entity_data_loaded.subscribe(this.onDataArrived.bind(this));
        this.dataService.entity_data_loading.subscribe(this.onQueryStarted.bind(this));
    };
    AlfehrestMainComponent.prototype.onQueryStarted = function (requestedEntity) {
        this.contentPaneOpen = true;
        this.currentCenter = requestedEntity.center;
        this.currentTitle = requestedEntity.title;
        var contentPaneHeight = this.domContentPane.nativeElement['offsetHeight'];
        var contentPaneWidth = this.domContentPane.nativeElement['offsetWidth'];
        var mapPaneHeight = this.domMapPane.getDomContainer().nativeElement['offsetHeight'];
        var mapPaneWidth = this.domMapPane.getDomContainer().nativeElement['offsetWidth'];
        this.currentCenter.offsetX = (mapPaneWidth - contentPaneWidth) / 2;
        this.currentCenter.offsetY = mapPaneHeight / 2 - contentPaneHeight - 25;
        if (environment_1.environment.pinEntities.indexOf(requestedEntity.entityType) != -1) {
            this.currentCenter.offsetY -= 40;
        }
        this.sliderHidden = true;
        console.log('asdas');
    };
    AlfehrestMainComponent.prototype.onDataArrived = function (loadedEntity) {
    };
    AlfehrestMainComponent.prototype.onParamsChange = function (params) {
        if (params.time) {
            this.contentPaneOpen = false;
            var t = +params.time;
            var d = new Date(t);
            this.currentDate = d;
            this.dataService.updateActivePeriod(d);
        }
    };
    AlfehrestMainComponent.prototype.onMapPanStarted = function () {
        this.isPanning = true;
        console.log('started');
    };
    AlfehrestMainComponent.prototype.onMapPanFinished = function () {
        this.currentCenter = null;
        this.isPanning = false;
        console.log('finished');
    };
    AlfehrestMainComponent.prototype.onSliderCloseClicked = function () {
        this.sliderHidden = !this.sliderHidden;
    };
    AlfehrestMainComponent.prototype.onSliderSliding = function (date) {
        this.currentDate = new Date(date);
    };
    AlfehrestMainComponent.prototype.onMapReady = function (map) {
        this.dataService.loadInitialData().subscribe(function (data) { return console.log(data); }, function (err) { return console.error(err); }, function () { return console.log('Authentication Complete'); });
    };
    AlfehrestMainComponent.prototype.onMenuBtnClicked = function () {
        this.menuOpen = !this.menuOpen;
    };
    __decorate([
        core_1.ViewChild('contentPane')
    ], AlfehrestMainComponent.prototype, "domContentPane");
    __decorate([
        core_1.ViewChild('mapPane')
    ], AlfehrestMainComponent.prototype, "domMapPane");
    AlfehrestMainComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            encapsulation: core_1.ViewEncapsulation.None,
            selector: "alfehrest-main",
            host: {
                '[class.content-open]': 'contentPaneOpen',
                '[class.map-centered]': 'currentCenter',
                '[class.map-panning]': 'isPanning',
                '[class.slider-gone]': 'sliderHidden',
                '[class.menu-open]': 'menuOpen'
            },
            template: "\n        <div #mainPane class=\"main-pane\">\n            <h1 class=\"logo\"></h1>\n            <gm-map #mapPane \n                (map_ready)=\"onMapReady()\"  \n                (map_pan_started)=\"onMapPanStarted()\" \n                (map_pan_finished)=\"onMapPanFinished()\" \n                [center]=\"currentCenter\">\n            </gm-map>\n            <div #contentPane class=\"content-pane\">\n                    <h2 [innerHTML]=\"currentTitle\"></h2>\n                <router-outlet></router-outlet>\n            </div>\n            <alfehrest-slider #slider \n                (value_sliding)=\"onSliderSliding($event)\"\n                (close_button_clicked)=\"onSliderCloseClicked()\">\n            </alfehrest-slider>\n            <alfehrest-bottom-panel \n                    \n                [current-date]=\"currentDate\" \n                (menu_button_clicked)=\"menuOpen = !menuOpen\" #bottomPanel>\n            </alfehrest-bottom-panel>\n        </div>\n        <alfehrest-side-panel #sidePanel></alfehrest-side-panel>\n        ",
            styles: ["\n        alfehrest-bottom-panel {\n            position:absolute;\n            height:35px;\n            width:100%;\n            left:0;\n            bottom:0;\n            transform: translateY(0px);\n            transition: transform 0.3s;\n        }\n        \n        alfehrest-slider {\n            position: absolute;\n            left:0;\n            width:120px;\n            height: 80%;\n            z-index: 15;\n            transition: all 1.5s;\n        }\n        \n        alfehrest-side-panel {\n            width:200px;\n            height:100%;\n            position: fixed;\n            right:0;\n            top:0;\n        }\n        \n        gm-map {\n            width: 100%;\n            height: calc(100% - 35px);\n            position: absolute;\n            left: 0;\n            top:0;\n            z-index:0;\n            background-color:white;\n        }\n        \n        .main-pane {\n            transition: transform 0.5s;\n            position: fixed;\n            width: 100%;\n            height: 100%;\n            left: 0;\n            top: 0;\n            z-index:1;\n        }\n        \n        .logo {\n            transition: all 0.5s;\n            background-image: url('assets/logo.png');\n            width:120px;\n            height:120px;\n            background-repeat: no-repeat;\n            background-position: center center;\n            background-size: 100px 100px;\n            margin:0;\n        }\n        \n        .main-pane > .logo {\n            background-image: url('assets/logo-inverted.png');\n            position: fixed;\n            bottom: 55px;\n            left: 0;\n            z-index: 5;\n            opacity: 0;\n        }\n\n        .slider-gone .main-pane > .logo {\n            opacity: 1;\n        }\n        \n\n\n        .menu-open .main-pane{\n            transform: translateX(-200px);\n        }\n        \n        .content-pane h2 {\n            height: 50px;\n            margin: 0;\n            color: wheat;\n            box-sizing: border-box;\n            padding: 10px;\n        }\n        \n        .content-pane {\n            transition: all 1.5s;\n            width: calc(100% - 120px);\n            height: 50%;\n            position: absolute;\n            right: 0;\n            bottom: 100%;\n            z-index: 15;\n            background-color: black;\n        }\n        \n        .map-panning .content-pane {\n            opacity: 0.1;\n        }\n        .content-open.map-centered .content-pane:before {\n            content: ' ';\n            border-style: solid;\n            border-width: 25px 15px 15px 15px;\n            border-color: black transparent transparent transparent;\n            position: absolute;\n            bottom: -40px;\n            right: calc(50% - 14px);\n        }\n        \n        .content-open .content-pane {\n            transform: translateY(100%);\n        }\n\n  \n\n        \n\n        \n        .slider-gone  alfehrest-slider {\n            transform: translateY(-90%);\n        }\n        \n        .slider-gone  .content-pane {\n            width:100%;\n        }\n        \n    \n        .scrolling .slimscroll-grid, \n        .scrolling .slimscroll-bar {\n            transition: all 0.2s !important;\n            opacity: 1 !important;\n        }\n        \n        \n        .slimscroll-grid, \n        .slimscroll-bar {\n            transition: all 0.2s !important;\n            opacity: 0 !important;\n        }\n        \n        .slimscroll-bar {\n            width: 8px !important;\n            left: 2px !important;\n        }\n\n\n\n    "]
        })
    ], AlfehrestMainComponent);
    return AlfehrestMainComponent;
}());
exports.AlfehrestMainComponent = AlfehrestMainComponent;
