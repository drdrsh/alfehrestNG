/// <reference path="../../../typings/globals/google.maps/index.d.ts" />
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
var MapOverlayLabelGen = (function () {
    function MapOverlayLabelGen(zone, google) {
        this.zone = zone;
        this.google = google;
    }
    MapOverlayLabelGen.prototype.generate = function (op) {
        var label = new google.maps.OverlayView();
        label.setValues(op);
        // Here go the label styles
        var span = document.createElement('span');
        span.style.cssText = "\n            background-color:green;\n            border-radius:36px;\n            border: 2px solid white;\n            position: relative;\n            display: inline-block;\n            left: 5px;\n            top: -50px;\n            width:14px;\n            height: 14px;\n            font-weight:bold;\n            white-space: nowrap;\n            color:#ffffff;\n            padding: 2px;\n            font-family: Arial;\n            text-shadow: 0 1px 1px #707070;\n            text-align: center;\n            font-size: 12px;\n            box-shadow:0 0 1px #333;\n        ";
        span.className = 'element-count-overlay';
        var div = document.createElement('div');
        div.appendChild(span);
        div.style.cssText = 'position: absolute; display: none';
        label._span = span;
        label._div = div;
        label.onAdd = this.onAdd.bind(label);
        label.draw = this.draw.bind(label);
        label.onRemove = this.onRemove.bind(label);
        label._listeners = [];
        return label;
    };
    MapOverlayLabelGen.prototype.onAdd = function () {
        var self = this;
        var pane = self.getPanes().overlayImage;
        pane.appendChild(self._div);
        // Ensures the label is redrawn if the text or position is changed.
        self._listeners = [
            google.maps.event.addListener(self, 'position_changed', function () { return self.draw(); }),
            google.maps.event.addListener(self, 'text_changed', function () { return self.draw(); }),
            google.maps.event.addListener(self, 'zindex_changed', function () { return self.draw(); })
        ];
    };
    MapOverlayLabelGen.prototype.onRemove = function () {
        var self = this;
        self._div.parentNode.removeChild(self._div);
        // Label is removed from the map, stop updating its position/text.
        for (var i = 0, I = self._listeners.length; i < I; ++i) {
            google.maps.event.removeListener(self._listeners[i]);
        }
    };
    MapOverlayLabelGen.prototype.draw = function () {
        var self = this;
        var projection = self.getProjection();
        var position = projection.fromLatLngToDivPixel(self.get('position'));
        var div = self._div;
        div.style.left = position.x + 'px';
        div.style.top = position.y + 'px';
        div.style.display = 'block';
        div.style.zIndex = self.get('zIndex'); //ALLOW LABEL TO OVERLAY MARKER
        if (!self._span.innerHTML) {
            self._span.innerHTML = self.get('text').toString();
        }
    };
    MapOverlayLabelGen = __decorate([
        core_1.Injectable(),
        __param(1, core_1.Inject('GOOGLE'))
    ], MapOverlayLabelGen);
    return MapOverlayLabelGen;
}());
exports.MapOverlayLabelGen = MapOverlayLabelGen;
