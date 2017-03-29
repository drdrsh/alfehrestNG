"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var date_converter_service_1 = require("../services/date-converter/date-converter.service");
var core_1 = require("@angular/core");
var model_1 = require("./model");
var display_data_1 = require("../components/interfaces/display-data");
var MapCenter_1 = require("../components/interfaces/MapCenter");
var translation_service_1 = require("../language/translation.service");
var translation_1 = require("../language/translation");
var ScholarModel = (function (_super) {
    __extends(ScholarModel, _super);
    function ScholarModel() {
        _super.apply(this, arguments);
    }
    ScholarModel.fromInitial = function (obj) {
        var injector = core_1.ReflectiveInjector.resolveAndCreate([date_converter_service_1.DateConverterService, translation_service_1.TranslateService, translation_1.TRANSLATION_PROVIDERS]);
        var entity = new ScholarModel(injector.get(date_converter_service_1.DateConverterService), obj);
        entity._entityType = 'scholar';
        return entity;
    };
    Object.defineProperty(ScholarModel.prototype, "center", {
        get: function () {
            var m = new MapCenter_1.MapCenter();
            if (!this._activeState) {
                return m;
            }
            m.longitude = this._activeState.place.longitude;
            m.latitude = this._activeState.place.latitude;
            return m;
        },
        enumerable: true,
        configurable: true
    });
    ScholarModel.prototype.readData = function () {
        var b = this.internalData.born;
        var d = this.internalData.died;
        this.internalData.id = parseInt(this.internalData.id, 10);
        this.internalData.born = new Date(b);
        this.internalData.died = new Date(d);
        for (var _i = 0, _a = this.internalData.places; _i < _a.length; _i++) {
            var place = _a[_i];
            delete place.id;
            delete place.sid;
            var pd = place.date;
            place.date = new Date(pd);
            place.longitude = parseFloat(place.longitude);
            place.latitude = parseFloat(place.latitude);
        }
    };
    Object.defineProperty(ScholarModel.prototype, "title", {
        get: function () {
            return this.internalData.name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ScholarModel.prototype, "data", {
        get: function () {
            if (this._displayData) {
                return this._displayData;
            }
            var data = new display_data_1.DisplayData();
            data.title = this.internalData.name;
            var mainSection = new display_data_1.DisplaySection();
            var achSection = new display_data_1.DisplaySection();
            var pubSection = new display_data_1.DisplaySection();
            var referenceSection = new display_data_1.DisplaySection();
            mainSection.cls = "scholar";
            mainSection.title = this.internalData.name;
            mainSection.subtitle = "Subtitle";
            mainSection.content = this.internalData.description;
            mainSection.type = "text";
            achSection.cls = "achievements";
            achSection.title = this.internalData.name;
            achSection.subtitle = "Subtitle";
            achSection.content = this.internalData.achievements;
            achSection.type = "text";
            pubSection.cls = "publications";
            pubSection.title = this.internalData.name;
            pubSection.subtitle = "Subtitle";
            pubSection.content = this.internalData.publications;
            pubSection.type = "bib";
            referenceSection.cls = "references";
            referenceSection.title = "References";
            referenceSection.subtitle = "Subtitle";
            referenceSection.content = this.internalData.references;
            referenceSection.type = "list";
            data.sections.push(mainSection);
            data.sections.push(achSection);
            data.sections.push(pubSection);
            data.sections.push(referenceSection);
            this._displayData = data;
            return this._displayData;
        },
        enumerable: true,
        configurable: true
    });
    ScholarModel.prototype.updateFromPartial = function (subid, partial) {
        this.internalData['description'] = partial.bio;
        this.internalData['shareLink'] = partial.shareLink;
        this.internalData['references'] = partial.references.split('\n');
        this.internalData['publications'] = partial.publications;
        this.internalData['achievements'] = partial.achievements;
    };
    ScholarModel.prototype.updateActiveState = function (currentTime) {
        this._isVisible = this.dateHelper.isVisible(currentTime, this.internalData.born, this.internalData.died);
        if (!this._isVisible) {
            this._activeState = null;
            return this._isVisible;
        }
        for (var i = 0; i < this.internalData.places.length; i++) {
            var current_state = this.internalData.places[i];
            var next_state = this.internalData.places[i + 1];
            var stateStartDate = current_state.date.getTime();
            var stateEndDate = this.internalData.died.getTime();
            if (i < this.internalData.places.length - 1) {
                stateEndDate = next_state.date.getTime();
                stateEndDate -= 1000 * 5;
            }
            if (this.dateHelper.isVisible(currentTime, new Date(stateStartDate), new Date(stateEndDate))) {
                this._activeState = {
                    'age': this.dateHelper.getAge(this.internalData.born, currentTime),
                    'ageString': this.dateHelper.getAgeAsString(this.internalData.born, currentTime),
                    'place': current_state
                };
            }
        }
        return this._isVisible;
    };
    return ScholarModel;
}(model_1.Model));
exports.ScholarModel = ScholarModel;
