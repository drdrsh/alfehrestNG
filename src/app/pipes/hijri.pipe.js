"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var date_converter_service_1 = require("../services/date-converter/date-converter.service");
var HijriPipe = (function () {
    function HijriPipe(translateService) {
        this.translateService = translateService;
    }
    HijriPipe.prototype.transform = function (value, param) {
        var dateConverter = new date_converter_service_1.DateConverterService(this.translateService);
        var result = dateConverter.toHijri(value);
        var hy = result[0];
        var hm = result[1];
        var hd = result[2];
        var gy = value.getFullYear();
        var gm = value.getMonth();
        var gd = value.getDate();
        var lookup = {
            'ce': this.translateService.instant('CE'),
            'ah': this.translateService.instant('AH'),
            'dddd': dateConverter.getDayName(value.getDay(), date_converter_service_1.NameLength.LONG),
            'ddd': dateConverter.getDayName(value.getDay(), date_converter_service_1.NameLength.SHORT),
            'hdd': hd < 10 ? "0" + hd : hd,
            'hd': hd,
            'gdd': gd < 10 ? "0" + gd : gd,
            'gd': gd,
            'hmmmm': dateConverter.getMonthName(hm, date_converter_service_1.NameLength.LONG, date_converter_service_1.CalendarMode.HIJRI),
            'hmmm': dateConverter.getMonthName(hm, date_converter_service_1.NameLength.SHORT, date_converter_service_1.CalendarMode.HIJRI),
            'hmm': hm < 10 ? "0" + hm : hm,
            'hm': hm,
            'gmmmm': dateConverter.getMonthName(gm, date_converter_service_1.NameLength.LONG, date_converter_service_1.CalendarMode.GREGORIAN),
            'gmmm': dateConverter.getMonthName(gm, date_converter_service_1.NameLength.SHORT, date_converter_service_1.CalendarMode.GREGORIAN),
            'gmm': gm < 10 ? "0" + gm : gm,
            'gm': gm,
            'hyyyy': hy,
            'hyyy': hy,
            'hy': hy,
            'gyyyy': gy,
            'gyyy': gy,
            'gy': gy
        };
        var output = param;
        for (var idx in lookup) {
            output = output.replace(idx, lookup[idx]);
        }
        return output;
    };
    HijriPipe = __decorate([
        core_1.Pipe({ name: 'hijri' })
    ], HijriPipe);
    return HijriPipe;
}());
exports.HijriPipe = HijriPipe;
