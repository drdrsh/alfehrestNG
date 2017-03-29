/// <reference path="astro.ts"/>
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var astro_1 = require("./astro");
var core_1 = require("@angular/core");
require('rxjs/add/operator/map');
(function (NameLength) {
    NameLength[NameLength["SHORT"] = 0] = "SHORT";
    NameLength[NameLength["LONG"] = 1] = "LONG";
})(exports.NameLength || (exports.NameLength = {}));
var NameLength = exports.NameLength;
(function (CalendarMode) {
    CalendarMode[CalendarMode["GREGORIAN"] = 0] = "GREGORIAN";
    CalendarMode[CalendarMode["HIJRI"] = 1] = "HIJRI";
})(exports.CalendarMode || (exports.CalendarMode = {}));
var CalendarMode = exports.CalendarMode;
var DateConverterService = (function () {
    function DateConverterService(translateService) {
        this.translateService = translateService;
        this.astroCalc = astro_1.AstronomicalCalculator.getInstance();
    }
    DateConverterService.prototype.getDayName = function (dayOfWeek, mode) {
        var id = null;
        switch (mode) {
            case NameLength.SHORT:
                id = 'SHORT_DAYS';
                break;
            case NameLength.LONG:
                id = 'LONG_DAYS';
                break;
        }
        var dict = this.translateService.instant(id);
        return dict[dayOfWeek];
    };
    DateConverterService.prototype.getMonthName = function (month, mode, cal) {
        var id = "";
        switch (cal) {
            case CalendarMode.GREGORIAN:
                id += 'G_';
                break;
            case CalendarMode.HIJRI:
                id = 'H_';
                break;
        }
        switch (mode) {
            case NameLength.SHORT:
                id += 'SHORT_MONTHS';
                break;
            case NameLength.LONG:
                id += 'LONG_MONTHS';
                break;
        }
        var dict = this.translateService.instant(id);
        return dict[month];
    };
    DateConverterService.prototype.getAge = function (startTime, endTime) {
        return -1;
    };
    DateConverterService.prototype.getAgeAsString = function (startTime, endTime) {
        var age = this.getAge(startTime, endTime);
        return 'kotomoto';
    };
    DateConverterService.prototype.toHijri = function (time) {
        var jd = this.astroCalc.gregorian_to_jd(time.getFullYear(), time.getMonth(), time.getDay());
        var res = this.astroCalc.jd_to_islamic(jd);
        res[1] -= 1;
        return res;
    };
    DateConverterService.prototype.isVisible = function (currentTime, startTime, endTime) {
        var monthStart = new Date(currentTime.getFullYear(), currentTime.getMonth(), 1).getTime();
        var monthEnd = new Date(currentTime.getFullYear(), currentTime.getMonth() + 1, 0, 23, 59, 59, 999).getTime();
        if (startTime.getTime() == monthStart || endTime.getTime() == monthStart)
            return true;
        if (startTime.getTime() == monthEnd || endTime.getTime() == monthEnd)
            return true;
        //If Start time or end time is within the range of this month
        if (startTime.getTime() >= monthStart && startTime.getTime() <= monthEnd)
            return true;
        if (endTime.getTime() >= monthStart && endTime.getTime() <= monthEnd)
            return true;
        //Event spanning across the month but neither starts nor ends here
        if (startTime.getTime() <= monthStart && endTime.getTime() >= monthEnd)
            return true;
        return false;
    };
    DateConverterService = __decorate([
        core_1.Injectable()
    ], DateConverterService);
    return DateConverterService;
}());
exports.DateConverterService = DateConverterService;
