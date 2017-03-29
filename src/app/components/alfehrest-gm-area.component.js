"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var core_1 = require("@angular/core");
var AlfehrestMapArea = (function () {
    function AlfehrestMapArea(router, route, dataStore, zone, map, google) {
        this.router = router;
        this.route = route;
        this.dataStore = dataStore;
        this.zone = zone;
        this.map = map;
        this.google = google;
        this.currentActiveState = null;
    }
    AlfehrestMapArea.prototype.ngDoCheck = function () {
        if (this.currentActiveState != this.state.activeState) {
            this.destory();
            this.render();
        }
    };
    AlfehrestMapArea.prototype.ngOnInit = function () {
        this.render();
    };
    AlfehrestMapArea.prototype.ngOnDestroy = function () {
        this.destory();
    };
    AlfehrestMapArea.prototype.ngOnChanges = function (changes) {
        if (changes.selected) {
            var width = changes.selected.currentValue ? 2 : 0;
            var zIndex = changes.selected.currentValue ? 999 : -1;
            if (this.polygon) {
                this.polygon.setOptions({
                    strokeWeight: width,
                    zIndex: zIndex
                });
            }
        }
    };
    AlfehrestMapArea.prototype.destory = function () {
        if (this.polygon) {
            this.polygon.setMap(null);
            this.polygon = null;
        }
    };
    AlfehrestMapArea.prototype.render = function () {
        var google = this.google;
        this.currentActiveState = this.state.activeState;
        if (!this.currentActiveState) {
            this.destory();
            return;
        }
        var bounds = new google.maps.LatLngBounds();
        var pCoordinates = [];
        for (var i = 0; i < this.currentActiveState.land.points.length; i++) {
            var vertex = new google.maps.LatLng(this.currentActiveState.land.points[i][0], this.currentActiveState.land.points[i][1]);
            bounds.extend(vertex);
            pCoordinates.push(vertex);
        }
        this.polygon = new google.maps.Polygon({
            paths: pCoordinates,
            strokeColor: "#000000",
            strokeOpacity: 0.8,
            strokeWeight: 0,
            fillColor: "#" + this.state.color,
            fillOpacity: 0.7,
            zIndex: -1
        });
        this.polygon.setMap(this.map);
        this.polygon.stateId = this.state.id;
        this.area = google.maps.geometry.spherical.computeArea(this.polygon.getPath());
        this.center = new google.maps.Marker({
            position: bounds.getCenter(),
            map: null
        });
        google.maps.event.addListener(this.polygon, 'click', this.z(this.onClick));
        google.maps.event.addListener(this.polygon, 'mousedown', this.onMouseDown.bind(this));
        google.maps.event.addListener(this.polygon, 'mouseup', this.onMouseUp.bind(this));
    };
    AlfehrestMapArea.prototype.z = function (callback) {
        var that = this;
        return function () {
            var args = arguments;
            that.zone.run(function () {
                callback.apply(that, args);
            });
        };
    };
    AlfehrestMapArea.prototype.onClick = function (ev) {
        google.maps.event.trigger(this.map, 'area_clicked', this.state);
        this.router.navigate([
            'time', this.route.snapshot.params['time'],
            'state', this.state.id, this.currentActiveState.ruler.id
        ]);
    };
    AlfehrestMapArea.prototype.onMouseDown = function () {
        //Bubble event up to the map
        var args = [this.map, 'mousedown'];
        args = args.concat(arguments);
        this.google.maps.event.trigger.apply(this.map, args);
    };
    AlfehrestMapArea.prototype.onMouseUp = function () {
        //Bubble event up to the map
        var args = [this.map, 'mouseup'];
        args = args.concat(arguments);
        this.google.maps.event.trigger.apply(this.map, args);
    };
    AlfehrestMapArea.prototype.onMouseMove = function (ev) {
        //console.log(ev, this);
    };
    __decorate([
        core_1.Input()
    ], AlfehrestMapArea.prototype, "state");
    __decorate([
        core_1.Input()
    ], AlfehrestMapArea.prototype, "selected");
    AlfehrestMapArea = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: "alfehrest-gm-area",
            template: ''
        }),
        __param(4, core_1.Inject('MAPS')),
        __param(5, core_1.Inject('GOOGLE'))
    ], AlfehrestMapArea);
    return AlfehrestMapArea;
}());
exports.AlfehrestMapArea = AlfehrestMapArea;
