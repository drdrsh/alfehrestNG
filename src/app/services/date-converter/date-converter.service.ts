/// <reference path="astro.ts"/>

import {AstronomicalCalculator} from "./astro"
import {Injectable, Inject, EventEmitter, Output} from "@angular/core";
import 'rxjs/add/operator/map';
import {TranslateService} from "../../language/translation.service";

export enum NameLength {SHORT, LONG}
export enum CalendarMode {GREGORIAN, HIJRI}

@Injectable()
export class DateConverterService {

    private astroCalc:AstronomicalCalculator;
    constructor(private translateService:TranslateService) {
        this.astroCalc = AstronomicalCalculator.getInstance();
    }

    public getDayName(dayOfWeek:number, mode:NameLength) {
        let id = null;
        switch(mode) {
            case NameLength.SHORT: id = 'SHORT_DAYS';break;
            case NameLength.LONG: id = 'LONG_DAYS';break;
        }
        let dict = this.translateService.instant(id);
        return dict[dayOfWeek];
    }

    public getMonthName(month:number, mode:NameLength, cal:CalendarMode) {
        let id = "";
        switch(cal) {
            case CalendarMode.GREGORIAN: id += 'G_';break;
            case CalendarMode.HIJRI: id = 'H_';break;
        }
        switch(mode) {
            case NameLength.SHORT: id += 'SHORT_MONTHS';break;
            case NameLength.LONG: id += 'LONG_MONTHS';break;
        }
        let dict = this.translateService.instant(id);
        return dict[month];
    }

    public getAge(startTime:Date, endTime:Date) : number {
        return -1;
    }

    public getAgeAsString(startTime:Date, endTime:Date): string {
        let age = this.getAge(startTime, endTime);
        return 'kotomoto';
    }
    public toHijri(time:Date) {
        let jd= this.astroCalc.gregorian_to_jd(
            time.getFullYear(),
            time.getMonth(),
            time.getDay()
        );
        let res = this.astroCalc.jd_to_islamic(jd);
        res[1] -= 1;
        return res;
    }

    public isVisible(currentTime:Date, startTime:Date, endTime:Date) {

        let monthStart  = new Date(currentTime.getFullYear(), currentTime.getMonth()	, 1).getTime();
        let monthEnd    = new Date(currentTime.getFullYear(), currentTime.getMonth() + 1, 0, 23, 59, 59, 999).getTime();

        if(startTime.getTime() == monthStart || endTime.getTime() == monthStart)return true;
        if(startTime.getTime() == monthEnd   || endTime.getTime() == monthEnd)return true;

        //If Start time or end time is within the range of this month
        if(startTime.getTime() >= monthStart && startTime.getTime() <= monthEnd)return true;
        if(endTime.getTime() >= monthStart && endTime.getTime() <= monthEnd)return true;

        //Event spanning across the month but neither starts nor ends here
        if(startTime.getTime() <= monthStart && endTime.getTime() >= monthEnd )return true;
        return false;
    }

}
