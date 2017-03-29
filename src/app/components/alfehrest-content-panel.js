"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
/*
 <div *ngIf="entityData" class="parent" [ngSwitch]="entityType">
 <alfehrest-state   *ngSwitchCase="'state'"   [data]="entityData" ></alfehrest-state>
 <alfehrest-scholar *ngSwitchCase="'scholar'" [data]="entityData" ></alfehrest-scholar>
 <alfehrest-event   *ngSwitchCase="'event'"   [data]="entityData" ></alfehrest-event>
 </div>

 */
var AlfehrestContentComponent = (function () {
    function AlfehrestContentComponent(route, router, dataService) {
        this.route = route;
        this.router = router;
        this.dataService = dataService;
        this.entityId = null;
        this.entityType = null;
        this.entityData = null;
        this.subscriptions = [];
        this.currentTime = null;
    }
    AlfehrestContentComponent.prototype.ngOnInit = function () {
        this.subscriptions.push(this.route.params.subscribe(this.onParamsChange.bind(this)));
        this.subscriptions.push(this.dataService.entity_data_loaded.subscribe(this.onDataArrived.bind(this)));
    };
    AlfehrestContentComponent.prototype.onDataArrived = function (model) {
        this.entityId = model.id;
        this.entityType = model.entityType;
        this.entityData = model;
    };
    AlfehrestContentComponent.prototype.onParamsChange = function (params) {
        //TODO: URL Error checking
        this.currentTime = new Date(parseInt(this.route.parent.snapshot.params['time'], 10));
        this.entityId = null;
        this.entityType = null;
        this.entityData = null;
        var entityType = params.entityType;
        var id = parseInt(params.id, 10);
        var sid = parseInt(params.sid, 10);
        sid = isNaN(sid) ? undefined : sid;
        this.dataService.loadEntityData(entityType, id, sid);
    };
    AlfehrestContentComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.map(function (v) { return v.unsubscribe(); });
    };
    __decorate([
        core_1.Output()
    ], AlfehrestContentComponent.prototype, "entityId");
    __decorate([
        core_1.Output()
    ], AlfehrestContentComponent.prototype, "entityType");
    __decorate([
        core_1.Output()
    ], AlfehrestContentComponent.prototype, "entityData");
    AlfehrestContentComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: "alfehrest-content",
            animations: [
                core_1.trigger('routeAnimation', [
                    core_1.state('void', core_1.style({ opacity: 0 })),
                    core_1.state('*', core_1.style({ opacity: 0.8 })),
                    core_1.transition(':enter', [
                        core_1.style({ opacity: 0 }),
                        core_1.animate('500ms ease-out', core_1.style({ opacity: 1 }))
                    ]),
                    core_1.transition(':leave', [
                        core_1.style({ opacity: 0.8 }),
                        core_1.animate('500ms ease-out', core_1.style({ opacity: 0 }))
                    ])
                ])
            ],
            host: { '[@routeAnimation]': '' },
            template: "\n        <section [ngClass]=\"{loading: !entityData}\">\n        <alfehrest-tabs *ngIf=\"entityData\" [data]=\"entityData.data\"></alfehrest-tabs>\n            <!--\n            <alfehrest-state  [data]=\"entityData\" ></alfehrest-state>\n            -->\n        </section>\n    ",
            styles: ["\n        :host {\n           height: calc(100% - 50px);\n           display: block;\n        }\n        section {\n            height: 100%;\n            color:white;\n            background-color: black;\n            opacity: 0.8;\n        }\n        section.loading {\n            background-position: center;\n            background-repeat: no-repeat;\n            background-image: url('assets/loading.gif');\n        }\n    "]
        })
    ], AlfehrestContentComponent);
    return AlfehrestContentComponent;
}());
exports.AlfehrestContentComponent = AlfehrestContentComponent;
