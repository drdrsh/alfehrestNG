import { Pipe, PipeTransform } from '@angular/core';
import {DateConverterService, NameLength, CalendarMode} from "../services/date-converter/date-converter.service";
import {TranslateService} from "../language/translation.service";

@Pipe({name: 'hijri'})
export class HijriPipe implements PipeTransform {

    constructor(private translateService:TranslateService) {}


    transform(value: Date, param: string): string {

        let dateConverter = new DateConverterService(this.translateService);
        let result = dateConverter.toHijri(value);

        let hy = result[0];
        let hm = result[1];
        let hd = result[2];
        let gy = value.getFullYear();
        let gm = value.getMonth();
        let gd = value.getDate();

        let lookup = {
            'ce'   : this.translateService.instant('CE'),
            'ah'   : this.translateService.instant('AH'),

            'dddd' : dateConverter.getDayName(value.getDay(), NameLength.LONG),
            'ddd'  : dateConverter.getDayName(value.getDay(), NameLength.SHORT),
            'hdd'  : hd<10?"0" + hd:hd,
            'hd'   : hd,
            'gdd'  : gd<10?"0" + gd:gd,
            'gd'   : gd,

            'hmmmm': dateConverter.getMonthName(hm, NameLength.LONG, CalendarMode.HIJRI),
            'hmmm' : dateConverter.getMonthName(hm, NameLength.SHORT, CalendarMode.HIJRI),
            'hmm'  : hm<10?"0" + hm:hm,
            'hm'   : hm,

            'gmmmm': dateConverter.getMonthName(gm, NameLength.LONG, CalendarMode.GREGORIAN),
            'gmmm' : dateConverter.getMonthName(gm, NameLength.SHORT, CalendarMode.GREGORIAN),
            'gmm'  : gm<10?"0" + gm:gm,
            'gm'   : gm,

            'hyyyy': hy,
            'hyyy' : hy,
            'hy'   : hy,

            'gyyyy': gy,
            'gyyy' : gy,
            'gy'   : gy
        };

        let output = param;
        for(let idx in lookup) {
            output = output.replace(idx, lookup[idx]);
        }
        return output;
    }
}