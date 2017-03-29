"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var model_1 = require("./model");
var core_1 = require("@angular/core");
var date_converter_service_1 = require("../services/date-converter/date-converter.service");
var display_data_1 = require("../components/interfaces/display-data");
var MapCenter_1 = require("../components/interfaces/MapCenter");
var translation_1 = require("../language/translation");
var translation_service_1 = require("../language/translation.service");
var EventModel = (function (_super) {
    __extends(EventModel, _super);
    function EventModel() {
        _super.apply(this, arguments);
    }
    EventModel.fromInitial = function (obj) {
        var injector = core_1.ReflectiveInjector.resolveAndCreate([date_converter_service_1.DateConverterService, translation_service_1.TranslateService, translation_1.TRANSLATION_PROVIDERS]);
        var entity = new EventModel(injector.get(date_converter_service_1.DateConverterService), obj);
        entity._entityType = 'event';
        return entity;
    };
    Object.defineProperty(EventModel.prototype, "center", {
        get: function () {
            var m = new MapCenter_1.MapCenter();
            m.longitude = parseFloat(this.internalData.longitude);
            m.latitude = parseFloat(this.internalData.latitude);
            return m;
        },
        enumerable: true,
        configurable: true
    });
    EventModel.prototype.readData = function () {
        var date = this.internalData.date;
        this.internalData.id = parseInt(this.internalData.id, 10);
        this.internalData.date = new Date(date);
        this.internalData.longitude = parseFloat(this.internalData.longitude);
        this.internalData.latitude = parseFloat(this.internalData.latitude);
        this.internalData.type = parseInt(this.internalData.type, 10);
    };
    Object.defineProperty(EventModel.prototype, "title", {
        get: function () {
            return this.internalData.name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EventModel.prototype, "data", {
        get: function () {
            if (this._displayData) {
                return this._displayData;
            }
            var data = new display_data_1.DisplayData();
            data.title = this.internalData.name;
            var mainSection = new display_data_1.DisplaySection();
            var referenceSection = new display_data_1.DisplaySection();
            mainSection.cls = "event";
            mainSection.title = this.internalData.name;
            mainSection.subtitle = "Subtitle";
            mainSection.content = this.internalData.description;
            mainSection.type = "text";
            referenceSection.cls = "references";
            referenceSection.title = "References";
            referenceSection.subtitle = "Subtitle";
            referenceSection.content = this.internalData.references;
            referenceSection.type = "list";
            data.sections.push(mainSection);
            data.sections.push(referenceSection);
            this._displayData = data;
            return data;
        },
        enumerable: true,
        configurable: true
    });
    EventModel.prototype.updateFromPartial = function (subid, partial) {
        this.internalData['description'] = partial.description;
        this.internalData['shareLink'] = partial.shareURL;
        this.internalData['link'] = partial.link;
        this.internalData['references'] = partial.references.split("\n");
    };
    EventModel.prototype.updateActiveState = function (currentTime) {
        var startDate = this.internalData.date;
        var endDate = new Date(new Date(startDate.getTime()).setMonth(startDate.getMonth() + 1));
        this._isVisible = this.dateHelper.isVisible(currentTime, startDate, endDate);
        return this._isVisible;
    };
    return EventModel;
}(model_1.Model));
exports.EventModel = EventModel;
