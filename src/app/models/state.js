"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var core_1 = require("@angular/core");
var date_converter_service_1 = require("../services/date-converter/date-converter.service");
var model_1 = require("./model");
var display_data_1 = require("../components/interfaces/display-data");
var MapCenter_1 = require("../components/interfaces/MapCenter");
var translation_1 = require("../language/translation");
var translation_service_1 = require("../language/translation.service");
var StateModel = (function (_super) {
    __extends(StateModel, _super);
    function StateModel() {
        _super.apply(this, arguments);
    }
    StateModel.fromInitial = function (obj) {
        var injector = core_1.ReflectiveInjector.resolveAndCreate([date_converter_service_1.DateConverterService, translation_service_1.TranslateService, translation_1.TRANSLATION_PROVIDERS]);
        var entity = new StateModel(injector.get(date_converter_service_1.DateConverterService), obj);
        entity._entityType = 'state';
        return entity;
    };
    Object.defineProperty(StateModel.prototype, "center", {
        get: function () {
            var m = new MapCenter_1.MapCenter();
            if (!this._activeState) {
                return m;
            }
            var centeroid = this.getNorthMostPoint();
            m.latitude = centeroid[0];
            m.longitude = centeroid[1];
            return m;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StateModel.prototype, "color", {
        get: function () {
            return this.internalData.color;
        },
        enumerable: true,
        configurable: true
    });
    StateModel.prototype.readData = function () {
        var ss = this.internalData.start_date;
        var se = this.internalData.end_date;
        this.internalData.start_date = new Date(ss);
        this.internalData.end_date = new Date(se);
        for (var _i = 0, _a = this.internalData.coords; _i < _a.length; _i++) {
            var coord = _a[_i];
            var x = coord.start_date;
            coord.start_date = new Date(x);
        }
        for (var _b = 0, _c = this.internalData.rulers; _b < _c.length; _b++) {
            var ruler = _c[_b];
            var x = ruler.start_date;
            ruler.start_date = new Date(x);
        }
        //var area = google.maps.geometry.spherical.computeArea(p.getPath());
        //nationData.area   = formatArea(area);
        //nationData.center = new google.maps.Marker({position:bounds.getCenter(),map:null});
    };
    StateModel.prototype.getNorthMostPoint = function () {
        var arr = this._activeState.land.points;
        var maxLat = -1000;
        var targetPoint = null;
        for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
            var pnt = arr_1[_i];
            maxLat = Math.max(pnt[0], maxLat);
            if (maxLat == pnt[0]) {
                targetPoint = pnt;
            }
        }
        return targetPoint;
    };
    //From : http://stackoverflow.com/questions/22796520/finding-the-center-of-leaflet-polygon
    StateModel.prototype.getCenteroid = function () {
        var arr = this._activeState.land.points;
        var twoTimesSignedArea = 0;
        var cxTimes6SignedArea = 0;
        var cyTimes6SignedArea = 0;
        var length = arr.length;
        var x = function (i) { return arr[i % length][0]; };
        var y = function (i) { return arr[i % length][1]; };
        for (var i = 0; i < length; i++) {
            var twoSA = x(i) * y(i + 1) - x(i + 1) * y(i);
            twoTimesSignedArea += twoSA;
            cxTimes6SignedArea += (x(i) + x(i + 1)) * twoSA;
            cyTimes6SignedArea += (y(i) + y(i + 1)) * twoSA;
        }
        var sixSignedArea = 3 * twoTimesSignedArea;
        return [cxTimes6SignedArea / sixSignedArea, cyTimes6SignedArea / sixSignedArea];
    };
    Object.defineProperty(StateModel.prototype, "title", {
        get: function () {
            return this.internalData.name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StateModel.prototype, "data", {
        get: function () {
            if (this._displayData) {
                return this._displayData;
            }
            var data = new display_data_1.DisplayData();
            data.title = this.internalData.name;
            var mainSection = new display_data_1.DisplaySection();
            var rulerSection = new display_data_1.DisplaySection();
            var referenceSection = new display_data_1.DisplaySection();
            mainSection.cls = "state";
            mainSection.title = this.internalData.name;
            mainSection.subtitle = "Subtitle";
            mainSection.content = this.internalData.description;
            mainSection.type = "text";
            rulerSection.cls = "ruler";
            rulerSection.title = this._activeState.ruler.name;
            rulerSection.subtitle = "Subtitle";
            rulerSection.content = this._activeState.ruler.description;
            rulerSection.type = "text";
            referenceSection.cls = "references";
            referenceSection.title = "References";
            referenceSection.subtitle = "Subtitle";
            referenceSection.content = this.internalData.references;
            referenceSection.type = "list";
            data.sections.push(mainSection);
            data.sections.push(rulerSection);
            data.sections.push(referenceSection);
            this._displayData = data;
            return this._displayData;
        },
        enumerable: true,
        configurable: true
    });
    StateModel.prototype.updateFromPartial = function (subid, partial) {
        this.internalData['description'] = partial.s_description;
        this.internalData['shareLink'] = partial.s_shareLink;
        this.internalData['references'] = partial.references.split('\n');
        this.internalData.rulers[subid]['shareLink'] = partial.r_shareLink;
        this.internalData.rulers[subid]['description'] = partial.r_description;
    };
    StateModel.prototype.updateActiveState = function (currentTime) {
        this._isVisible = this.dateHelper.isVisible(currentTime, this.internalData.start_date, this.internalData.end_date);
        if (!this._isVisible) {
            this._activeState = null;
            return this._isVisible;
        }
        for (var i = 0; i < this.internalData.coords.length; i++) {
            var current_state = this.internalData.coords[i];
            var next_state = this.internalData.coords[i + 1];
            var stateStartDate = current_state.start_date.getTime();
            var stateEndDate = this.internalData.end_date.getTime();
            if (i < this.internalData.coords.length - 1) {
                stateEndDate = next_state.start_date.getTime();
                stateEndDate -= 1000 * 5;
            }
            if (this.dateHelper.isVisible(currentTime, new Date(stateStartDate), new Date(stateEndDate))) {
                this._activeState = {
                    'age': this.dateHelper.getAge(this.internalData.start_date, currentTime),
                    'ageString': this.dateHelper.getAgeAsString(this.internalData.start_date, currentTime),
                    'area': 0,
                    'land': current_state,
                    'ruler': null
                };
            }
        }
        for (var i = 0; i < this.internalData.rulers.length; i++) {
            var current_ruler = this.internalData.rulers[i];
            var next_ruler = this.internalData.rulers[i + 1];
            var stateStartDate = current_ruler.start_date.getTime();
            var stateEndDate = this.internalData.end_date.getTime();
            if (i < this.internalData.rulers.length - 1) {
                stateEndDate = next_ruler.start_date.getTime();
                stateEndDate -= 1000 * 5;
            }
            current_ruler.id = i;
            if (this.dateHelper.isVisible(currentTime, new Date(stateStartDate), new Date(stateEndDate))) {
                this._activeState.ruler = current_ruler;
            }
        }
        return this._isVisible;
    };
    return StateModel;
}(model_1.Model));
exports.StateModel = StateModel;
