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
var MapOverlayLabel_1 = require("../models/MapOverlayLabel");
var AlfehrestMapPin = (function () {
    function AlfehrestMapPin(router, route, dataStore, zone, map, google) {
        this.router = router;
        this.route = route;
        this.dataStore = dataStore;
        this.zone = zone;
        this.map = map;
        this.google = google;
    }
    AlfehrestMapPin.prototype.ngDoCheck = function () {
    };
    AlfehrestMapPin.prototype.ngOnInit = function () {
        this.render();
    };
    AlfehrestMapPin.prototype.ngOnDestroy = function () {
        this.destory();
    };
    AlfehrestMapPin.prototype.destory = function () {
        if (this.marker) {
            this.marker.setMap(null);
            this.marker = null;
        }
        if (this.label) {
            this.label.setMap(null);
            this.label = null;
        }
    };
    AlfehrestMapPin.prototype.render = function () {
        var google = this.google;
        var map = this.map;
        var overlayGen = new MapOverlayLabel_1.MapOverlayLabelGen(this.zone, this.google);
        var count = this.pin.pins.length;
        var types = this.pin.types;
        var title = this.pin.title;
        var lng = this.pin.longitude;
        var lat = this.pin.latitude;
        var imageURL = "assets/";
        if (count == 1) {
            var imageNameParts = [];
            imageNameParts.push(types[0]);
            imageNameParts.push('marker');
            if (this.pin.pins[0].get('type')) {
                imageNameParts.push(this.pin.pins[0].get('type'));
            }
            imageURL += imageNameParts.join('-') + '.png';
        }
        else {
            imageURL += types.join('-') + '-marker.png';
        }
        this.marker =
            new google.maps.Marker({
                position: new google.maps.LatLng(lat, lng),
                map: map,
                title: title,
                icon: {
                    url: imageURL,
                    size: new google.maps.Size(96, 96),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(18, 38),
                    scaledSize: new google.maps.Size(36, 36)
                }
            });
        google.maps.event.addListener(this.marker, 'click', this.z(this.onClick));
        if (count > 1) {
            this.label = overlayGen.generate({ map: map });
            this.label.set('zIndex', 1234);
            this.label.bindTo('position', this.marker, 'position');
            this.label.set('text', count);
        }
    };
    AlfehrestMapPin.prototype.z = function (callback) {
        var that = this;
        return function () {
            var args = arguments;
            that.zone.run(function () {
                callback.apply(that, args);
            });
        };
    };
    AlfehrestMapPin.prototype.onClick = function (ev) {
        google.maps.event.trigger(this.map, 'pin_clicked', this.pin.pins);
        this.router.navigate([
            'time', this.route.snapshot.params['time'],
            this.pin.pins[0].entityType, this.pin.pins[0].id, 0
        ]);
    };
    AlfehrestMapPin.prototype.onMouseMove = function (ev) {
        //console.log(ev, this);
    };
    __decorate([
        core_1.Input('pin')
    ], AlfehrestMapPin.prototype, "pin");
    AlfehrestMapPin = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: "alfehrest-gm-pin",
            template: ''
        }),
        __param(4, core_1.Inject('MAPS')),
        __param(5, core_1.Inject('GOOGLE'))
    ], AlfehrestMapPin);
    return AlfehrestMapPin;
}());
exports.AlfehrestMapPin = AlfehrestMapPin;
