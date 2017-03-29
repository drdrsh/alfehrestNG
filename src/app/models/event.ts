import {Model} from "./model";
import {ReflectiveInjector} from "@angular/core";
import {DateConverterService} from "../services/date-converter/date-converter.service";
import {DisplayData, DisplaySection} from "../components/interfaces/display-data";
import {MapCenter} from "../components/interfaces/MapCenter";
import {TRANSLATION_PROVIDERS} from "../language/translation";
import {TranslateService} from "../language/translation.service";
import {HijriPipe} from "../pipes/hijri.pipe";

export class EventModel extends Model {

    public static fromInitial(obj:any) {
        let injector = ReflectiveInjector.resolveAndCreate([DateConverterService, TranslateService, TRANSLATION_PROVIDERS]);
        let entity = new EventModel(injector.get(DateConverterService), injector.get(TranslateService), obj);
        entity._entityType = 'event';
        return entity;
    }

    get center() : MapCenter {
        let m:MapCenter = new MapCenter();
        m.longitude = parseFloat(this.internalData.longitude);
        m.latitude = parseFloat(this.internalData.latitude);
        return m;
    }


    protected readData() {

        let date:any = this.internalData.date;
        this.internalData.id = parseInt(this.internalData.id, 10);
        this.internalData.date = new Date(date);

        this.internalData.longitude = parseFloat(this.internalData.longitude);
        this.internalData.latitude = parseFloat(this.internalData.latitude);
        this.internalData.type = parseInt(this.internalData.type, 10);

    }

    public get title():string {
        return this.internalData.title;
    }

    public get data() : DisplayData {

        if(this._displayData) {
           return this._displayData;
        }

        let data = new DisplayData();
        data.title = this.internalData.title;

        let mainSection = new DisplaySection();
        let referenceSection = new DisplaySection();

        let hPipe = new HijriPipe(this.translateService);
        this.translateService.use('ar');
        mainSection.cls = "event";
        mainSection.title =  this.internalData.name;
        mainSection.subtitle = hPipe.transform(this.internalData.date, "gd gmmmm gyyyy ce (hd hmmmm hyyyy ah)");
        mainSection.content = this.internalData.description;
        mainSection.type = "text";

        referenceSection.cls = "references";
        referenceSection.title = "المراجع";
        referenceSection.subtitle = "";
        referenceSection.content = this.internalData.references;
        referenceSection.type = "list";

        data.sections.push(mainSection);
        data.sections.push(referenceSection);

        this._displayData = data;
        return data;
    }

    public updateFromPartial(subid:number, partial:any) {
        this.internalData['description'] = partial.description;
        this.internalData['shareLink'] = partial.shareURL;
        this.internalData['link'] = partial.link;
        this.internalData['references'] = partial.references.split("\n");
    }

    public updateActiveState(currentTime:Date) {
        let startDate:Date =  this.internalData.date;
        let endDate = new Date(new Date(startDate.getTime()).setMonth(startDate.getMonth()+1));
        this._isVisible = this.dateHelper.isVisible(currentTime, startDate, endDate);
        return this._isVisible;
    }



}