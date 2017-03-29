"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var AlfehrestBottomPanelComponent = (function () {
    function AlfehrestBottomPanelComponent(router, route, dataService) {
        this.router = router;
        this.route = route;
        this.dataService = dataService;
        this.currentDate = new Date();
        this.openPanel = "";
        this.scrolling = false;
        this.scrollTimeout = null;
        this.states = [];
        this.scholars = [];
        this.events = [];
        this.menu_button_clicked = new core_1.EventEmitter();
        this.dataService.active_period_changed.subscribe(this.onActivePeriodChanged.bind(this));
    }
    AlfehrestBottomPanelComponent.prototype.ngOnInit = function () {
        this.opts = {
            position: 'left',
            barBackground: '#000000'
        };
    };
    AlfehrestBottomPanelComponent.prototype.onActivePeriodChanged = function (activeEntities) {
        this.states = activeEntities.state;
        this.scholars = activeEntities.scholar;
        this.events = activeEntities.event;
    };
    AlfehrestBottomPanelComponent.prototype.onMenuBtnClicked = function () {
        this.menu_button_clicked.emit();
    };
    AlfehrestBottomPanelComponent.prototype.onEntityClicked = function (e) {
        var route = ['time', this.route.snapshot.params['time']];
        route.push(e.entityType);
        route.push(e.id);
        if (e.activeState.ruler) {
            route.push(e.activeState.ruler.id);
        }
        else {
            route.push(0);
        }
        this.router.navigate(route);
    };
    AlfehrestBottomPanelComponent.prototype.onScroll = function () {
        //this.scrolling = true;
        //clearTimeout(this.scrollTimeout);
        //this.scrollTimeout = setTimeout(() => this.scrolling = false, 1500);
    };
    __decorate([
        core_1.Input('current-date')
    ], AlfehrestBottomPanelComponent.prototype, "currentDate");
    __decorate([
        core_1.Output('menu_button_clicked')
    ], AlfehrestBottomPanelComponent.prototype, "menu_button_clicked");
    AlfehrestBottomPanelComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: "alfehrest-bottom-panel",
            template: "\n        <span class=\"year\">{{currentDate | hijri:'gmmmm gyyyy ce (hmmmm hyyyy ah)'}}</span>\n        <div class=\"menu-toggle\" (click)=\"onMenuBtnClicked()\">\n            <svg width=\"30\" height=\"30\" id=\"icoOpen\">\n                <path d=\"M0,5 30,5\" stroke=\"#006600\" stroke-width=\"5\"/>\n                <path d=\"M0,14 30,14\" stroke=\"#006600\" stroke-width=\"5\"/>\n                <path d=\"M0,23 30,23\" stroke=\"#006600\" stroke-width=\"5\"/>\n            </svg>\n        </div>\n        \n        <div class=\"sliding-panel state\" [ngClass]=\"{open: openPanel=='state', scrolling: scrolling}\">\n            <div class=\"button\" (click)=\"openPanel = (openPanel=='state'?'':'state')\"></div>\n            <div class=\"badge\">{{states.length}}</div>\n            <ul slimScroll [options]=\"opts\" (scroll)=\"onScroll()\">\n                <li *ngFor=\"let state of states\" (click)=\"onEntityClicked(state)\">\n                <div class=\"state-legend\" [ngStyle]=\"{'background-color': '#' + state.internalData.color}\"></div>\n                    {{state.title}}\n                </li>\n            </ul>\n        </div>\n            \n        <div class=\"sliding-panel scholar\" [ngClass]=\"{open: openPanel=='scholar', scrolling: scrolling}\">\n            <div class=\"button\" (click)=\"openPanel = (openPanel=='scholar'?'':'scholar')\"></div>\n            <div class=\"badge\">{{scholars.length}}</div>\n            <ul slimScroll [options]=\"opts\" (scroll)=\"onScroll()\">\n                <li *ngFor=\"let scholar of scholars\" (click)=\"onEntityClicked(scholar)\">\n                    {{scholar.title}}\n                </li>\n            </ul>\n        </div>\n        \n        <div class=\"sliding-panel event\" [ngClass]=\"{open: openPanel=='event', scrolling: scrolling}\">\n            <div class=\"button\" (click)=\"openPanel = (openPanel=='event'?'':'event')\"></div>\n            <div class=\"badge\">{{events.length}}</div>\n            <ul slimScroll [options]=\"opts\" (scroll)=\"onScroll()\">\n                <li *ngFor=\"let event of events\" (click)=\"onEntityClicked(event)\">\n                    {{event.title}}\n                </li>\n            </ul>\n        </div>\n        ",
            styles: ["\n        :host {\n            text-align:center;\n            background-color:#006600;\n            border:1px solid black;\n            border-bottom:0;\n            white-space:nowrap;\n            font-weight:bold;\n            color:white;\n            font-size:80%;\n        }\n        \n        .menu-toggle {\n            width: 70px;\n            height:35px;\n            padding-top:4px;\n            background-color:white;\n            cursor:pointer;\n        }\n        \n        span{\n            display:block;\n            float:left;\n            width:50%;\n            text-align:left;\n            margin-left:15px;\n            margin-top:5px;\n        }\n        \n        .sliding-panel {\n            position: absolute;\n            top:0px;\n            transition: all 0.5s;\n            height:230px;\n            width: 200px;\n            z-index: 0;\n        }\n\n        .sliding-panel.state { right:100px; }\n        .sliding-panel.scholar { right:160px; }\n        .sliding-panel.event { right:220px; }\n\n        .sliding-panel.state .button { background-image: url('assets/state.png'); }\n        .sliding-panel.scholar .button { background-image: url('assets/scholar.png'); }\n        .sliding-panel.event .button { background-image: url('assets/event.png'); }\n\n        .sliding-panel.open {\n            transform: translateY(-230px);\n            z-index: 50;\n         }\n        \n        .sliding-panel .badge {\n            background-color:green;\n            border-radius:36px;\n            border: 2px solid white;\n            position: absolute;\n            display: inline-block;\n            right: -10px;\n            top: -10px;\n            width:14px;\n            height: 14px;\n            font-weight:bold;\n            white-space: nowrap;\n            color:#ffffff;\n            padding: 2px;\n            text-shadow: 0 1px 1px #707070;\n            text-align: center;\n            font-size: 12px;\n            box-shadow:0 0 1px #333;\n            z-index: 50;\n        }\n        \n        .sliding-panel .button {\n            cursor: pointer;\n            height: 33px;\n            width: 36px;\n            background-repeat: no-repeat;\n            background-position: center center;\n            background-size: 30px 30px;\n            border-bottom: 2px solid white;\n            background-color:#006600;\n        } \n\n        .sliding-panel ul {\n            background-color: white;\n            height:100%;\n            margin:0;\n            padding:0;\n            list-style: none;\n            overflow-y: scroll;\n        }\n        .sliding-panel ul li {\n            cursor: pointer;\n            text-align: right;\n            border-bottom: 1px solid #eee;\n            color: black;\n            font-weight: bold;\n            padding-right: 10px;\n            height: 30px;\n            text-decoration: none;\n            box-sizing: border-box;\n            padding-top: 3px;\n            padding-bottom: 3px;\n        }\n        .sliding-panel ul li:hover {\n            background-color: #006600;\n            color:white;\n        }\n        \n        \n        .state-legend {\n            width: 20px;\n            height: 30px;\n            float: left;\n            margin-top: -3px;\n        }\n        \n\n    "]
        })
    ], AlfehrestBottomPanelComponent);
    return AlfehrestBottomPanelComponent;
}());
exports.AlfehrestBottomPanelComponent = AlfehrestBottomPanelComponent;
