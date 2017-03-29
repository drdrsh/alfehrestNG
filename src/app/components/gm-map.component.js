"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var environment_1 = require("../environment");
var PinAggregate_1 = require("./interfaces/PinAggregate");
var GoogleMapsComponent = (function () {
    function GoogleMapsComponent(domElement, dataService, changeDetector, zone) {
        this.domElement = domElement;
        this.dataService = dataService;
        this.changeDetector = changeDetector;
        this.zone = zone;
        this.centerChangedProgramtically = false;
        this.callbackFunctionName = null;
        this.apiKey = environment_1.environment.GMKey;
        this.map = null;
        this.google = null;
        this.zoomTimeoutHandle = null;
        this.panTimeoutHandle = null;
        this.isPanning = false;
        this.selectedAreaId = -1;
        this.areas = [];
        this.pins = [];
        this.callbackFunctionName = "__GoogleCallback" + Math.random().toString(36).slice(-5);
        this.map_ready = new core_1.EventEmitter();
        this.map_pan_started = new core_1.EventEmitter();
        this.map_pan_finished = new core_1.EventEmitter();
    }
    GoogleMapsComponent.prototype.getDomContainer = function () {
        return this.domContainer;
    };
    GoogleMapsComponent.prototype.ngOnInit = function () {
        var _this = this;
        window[this.callbackFunctionName] = function (ev) {
            /*
            We are initializing google maps outside angular so all callback cascading from this event (which are ALOT)
            will be running outside angular's zone breaking all change detection, to fix this we run this callback from
            within angular zone
             */
            _this.zone.run(function () { return _this.onGoogleMapLoaded(); });
        };
        this.loadMap();
        this.dataService.active_period_changed.subscribe(this.onActivePeriodChanged.bind(this));
    };
    GoogleMapsComponent.prototype.ngOnChanges = function (changes) {
        if (changes.center && this.center) {
            this.centerMap(this.center);
        }
    };
    GoogleMapsComponent.prototype.onActivePeriodChanged = function (data) {
        this.areas = data['state'];
        var pins = [];
        for (var _i = 0, _a = environment_1.environment.pinEntities; _i < _a.length; _i++) {
            var idx = _a[_i];
            pins = pins.concat(data[idx]);
        }
        this.pins = PinAggregate_1.PinAggregate.fromModelArray(pins);
    };
    GoogleMapsComponent.prototype.onGoogleMapLoaded = function () {
        var google = this.google = window["google"];
        var el = document.querySelector(".gm-container");
        var mapStyle = new google.maps.StyledMapType([{
                "featureType": "administrative.country",
                "elementType": "labels",
                "stylers": [{ "visibility": "off" }]
            }, {
                "featureType": "water",
                "elementType": "labels",
                "stylers": [{ "visibility": "off" }]
            }, {
                "featureType": "administrative.province",
                "stylers": [{ "visibility": "off" }]
            }, {
                "featureType": "landscape",
                "stylers": [
                    { "hue": "#ffa200" },
                    { "saturation": 65 },
                    { "lightness": -5 }
                ]
            }, {
                "featureType": "poi",
                "stylers": [{ "visibility": "off" }]
            }, {
                "featureType": "road",
                "stylers": [{ "visibility": "off" }]
            }, {
                "featureType": "transit",
                "stylers": [{ "visibility": "off" }]
            }], { "name": "Geography" });
        this.map = new google.maps.Map(el, {
            panControl: false,
            zoomControl: false,
            mapTypeControl: false,
            zoom: 4,
            minZoom: 3,
            maxZoom: 6,
            center: new google.maps.LatLng(30.002482071719506, 34.58984375000001),
            mapTypeId: google.maps.MapTypeId.TERRAIN,
            keyboardShortcuts: false,
            mapTypeControlOptions: {
                mapTypeIds: [google.maps.MapTypeId.TERRAIN, 'Geography']
            },
            disableDefaultUI: true,
            streetViewControl: false
        });
        this.map.mapTypes.set('Geography', mapStyle);
        this.map.setMapTypeId('Geography');
        google.maps.event.addListener(this.map, 'center_changed', this.onCenterChanged.bind(this));
        google.maps.event.addListener(this.map, 'zoom_changed', this.onZoomChanged.bind(this));
        google.maps.event.addListener(this.map, 'resize', this.z(this.onResize));
        google.maps.event.addListener(this.map, 'mousedown', this.z(this.onMouseDown));
        google.maps.event.addListener(this.map, 'mouseup', this.z(this.onMouseUp));
        google.maps.event.addListener(this.map, 'area_clicked', this.onAreaClicked.bind(this));
        google.maps.event.addListener(this.map, 'pin_clicked', this.onPinClicked.bind(this));
        this.map_ready.emit(this.map);
    };
    GoogleMapsComponent.prototype.onAreaClicked = function (model) {
        this.selectedAreaId = model.id;
        for (var _i = 0, _a = this.areas; _i < _a.length; _i++) {
            var a = _a[_i];
            a.selected = (model.id == a.id);
        }
        this.changeDetector.detectChanges();
    };
    GoogleMapsComponent.prototype.onPinClicked = function (models) {
        this.selectedAreaId = -1;
        this.changeDetector.detectChanges();
    };
    GoogleMapsComponent.prototype.onMouseDown = function () {
        this.isPanning = true;
        this.map_pan_started.emit();
    };
    GoogleMapsComponent.prototype.onMouseUp = function () {
        if (this.isPanning) {
            this.isPanning = false;
            this.map_pan_finished.emit();
        }
    };
    GoogleMapsComponent.prototype.onCenterChanged = function () {
        var _this = this;
        if (this.centerChangedProgramtically) {
            this.centerChangedProgramtically = false;
            return;
        }
        if (this.center == null) {
            return;
        }
        clearTimeout(this.zoomTimeoutHandle);
        this.zoomTimeoutHandle = setTimeout(function () {
            _this.center = null;
            _this.zone.run(function () { return _this.onZoomChanged(); });
        }, 20);
    };
    GoogleMapsComponent.prototype.onZoomChanged = function () {
        if (this.center) {
            clearTimeout(this.zoomTimeoutHandle);
            this.centerMap(this.center);
        }
    };
    GoogleMapsComponent.prototype.onResize = function () {
        if (this.center) {
            this.centerMap(this.center);
        }
    };
    GoogleMapsComponent.prototype.onWindowResize = function (event) {
        var _this = this;
        setTimeout(function () { return _this.google.maps.event.trigger(_this.map, 'resize'); }, 50);
    };
    GoogleMapsComponent.prototype.z = function (callback) {
        var that = this;
        return function () {
            var args = arguments;
            that.zone.run(function () {
                callback.apply(that, args);
            });
        };
    };
    GoogleMapsComponent.prototype.getMapUrl = function () {
        var rootUrl = "http://maps.googleapis.com/maps/api/js?";
        var parts = {
            "key": this.apiKey,
            "libraries": ["geometry"],
            "language": "ar",
            "callback": this.callbackFunctionName
        };
        var fullUrl = rootUrl;
        var urlFragments = [];
        for (var _i = 0, _a = Object.keys(parts); _i < _a.length; _i++) {
            var idx = _a[_i];
            var val = parts[idx];
            if (Array.isArray(parts[idx])) {
                val = parts[idx].join(",");
            }
            urlFragments.push(idx + "=" + val);
        }
        fullUrl += urlFragments.join("&");
        return fullUrl;
    };
    GoogleMapsComponent.prototype.loadMap = function () {
        console.log("Loading Google Maps");
        var node = document.createElement("script");
        node.src = this.getMapUrl();
        node.type = "text/javascript";
        node.defer = true;
        node.async = true;
        document.getElementsByTagName("head")[0].appendChild(node);
    };
    //From: http://stackoverflow.com/questions/10656743/how-to-offset-the-center-point-in-google-maps-api-v3
    GoogleMapsComponent.prototype.centerMap = function (newCenter) {
        this.center = newCenter;
        var google = this.google = window["google"];
        var map = this.map;
        var offsetX = newCenter.offsetX;
        var offsetY = newCenter.offsetY;
        var centerLatLng = new google.maps.LatLng(newCenter.latitude, newCenter.longitude);
        var worldCoordinateCenter = map.getProjection().fromLatLngToPoint(centerLatLng);
        var scale = Math.pow(2, map.getZoom());
        var pixelOffset = new google.maps.Point((offsetX / scale) || 0, (offsetY / scale) || 0);
        var worldCoordinateNewCenter = new google.maps.Point(worldCoordinateCenter.x - pixelOffset.x, worldCoordinateCenter.y + pixelOffset.y);
        this.centerChangedProgramtically = true;
        var latlngNewCenter = map.getProjection().fromPointToLatLng(worldCoordinateNewCenter);
        map.panTo(latlngNewCenter);
    };
    __decorate([
        core_1.Input('center')
    ], GoogleMapsComponent.prototype, "center");
    __decorate([
        core_1.Output('map_ready')
    ], GoogleMapsComponent.prototype, "map_ready");
    __decorate([
        core_1.Output('map_pan_started')
    ], GoogleMapsComponent.prototype, "map_pan_started");
    __decorate([
        core_1.Output('map_pan_finished')
    ], GoogleMapsComponent.prototype, "map_pan_finished");
    __decorate([
        core_1.ViewChild('container')
    ], GoogleMapsComponent.prototype, "domContainer");
    GoogleMapsComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: "gm-map",
            template: "\n        <alfehrest-gm-area *ngFor=\"let state of areas\" [selected]=\"state.id == selectedAreaId\" [state]=\"state\"></alfehrest-gm-area>\n        <alfehrest-gm-pin  *ngFor=\"let pin of pins\" [pin]=\"pin\"></alfehrest-gm-pin>\n        <div #container class=\"gm-container\" (window:resize)=\"onWindowResize($event)\"></div>\n    ",
            styles: ["\n        .gm-container {\n            width: 100%;\n            height: 100%;\n        }\n    "],
            providers: [{
                    "provide": "GOOGLE",
                    "useFactory": function (gm) { return gm.google; },
                    "deps": [GoogleMapsComponent]
                }, {
                    "provide": "MAPS",
                    "useFactory": function (gm) { return gm.map; },
                    "deps": [GoogleMapsComponent]
                }]
        })
    ], GoogleMapsComponent);
    return GoogleMapsComponent;
}());
exports.GoogleMapsComponent = GoogleMapsComponent;
