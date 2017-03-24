/// <reference path="../../../typings/globals/google.maps/index.d.ts" />

import {NgZone, Inject, Injectable} from "@angular/core";
@Injectable()
export class MapOverlayLabelGen {

    generate(op) {
        let label:any = new google.maps.OverlayView();

        label.setValues(op);

        // Here go the label styles
        let span = document.createElement('span');

        span.style.cssText = `
            background-color:green;
            border-radius:36px;
            border: 2px solid white;
            position: relative;
            display: inline-block;
            left: 5px;
            top: -50px;
            width:14px;
            height: 14px;
            font-weight:bold;
            white-space: nowrap;
            color:#ffffff;
            padding: 2px;
            font-family: Arial;
            text-shadow: 0 1px 1px #707070;
            text-align: center;
            font-size: 12px;
            box-shadow:0 0 1px #333;
        `;

        span.className = 'element-count-overlay';
        let div = document.createElement('div');
        div.appendChild(span);
        div.style.cssText = 'position: absolute; display: none';

        label._span = span;
        label._div = div;
        label.onAdd = this.onAdd.bind(label);
        label.draw = this.draw.bind(label);
        label.onRemove = this.onRemove.bind(label);
        label._listeners = [];
        return label;
    }

    constructor(private zone:NgZone, @Inject('GOOGLE') private google: any) {
    }

    onAdd() {
        let self:any = this;
        var pane = self.getPanes().overlayImage;
        pane.appendChild(self._div);

        // Ensures the label is redrawn if the text or position is changed.
        self._listeners = [
            google.maps.event.addListener(
                self, 'position_changed',
                () => self.draw()
            ),
            google.maps.event.addListener(
                self, 'text_changed',
                () => self.draw()
            ),
            google.maps.event.addListener(
                self, 'zindex_changed',
                () => self.draw()
            )
        ];
    }

    onRemove() {
        let self:any = this;
        self._div.parentNode.removeChild(self._div);
        // Label is removed from the map, stop updating its position/text.
        for (var i = 0, I = self._listeners.length; i < I; ++i) {
            google.maps.event.removeListener(self._listeners[i]);
        }
    }

    draw() {
        let self:any = this;
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
    }
}