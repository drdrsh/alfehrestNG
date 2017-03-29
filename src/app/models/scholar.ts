import {DateConverterService} from "../services/date-converter/date-converter.service";
import {ReflectiveInjector} from "@angular/core";
import {Model} from "./model";
import {DisplayData, DisplaySection} from "../components/interfaces/display-data";
import {MapCenter} from "../components/interfaces/MapCenter";
import {TranslateService} from "../language/translation.service";
import {TRANSLATIONS, TRANSLATION_PROVIDERS} from "../language/translation";

export class ScholarModel extends Model{


    public static fromInitial(obj:any) {
        let injector = ReflectiveInjector.resolveAndCreate([DateConverterService, TranslateService, TRANSLATION_PROVIDERS]);
        let entity = new ScholarModel(injector.get(DateConverterService), injector.get(TranslateService), obj);
        entity._entityType = 'scholar';
        return entity;
    }

    get center() : MapCenter {
        let m:MapCenter = new MapCenter();
        if(!this._activeState) {
            return m;
        }
        m.longitude  = this._activeState.place.longitude;
        m.latitude  = this._activeState.place.latitude;
        return m;
    }

    protected readData() {

        let b:any = this.internalData.born;
        let d:any = this.internalData.died;
        this.internalData.id = parseInt(this.internalData.id, 10);
        this.internalData.born = new Date(b);
        this.internalData.died = new Date(d);

        for(let place of this.internalData.places) {
            delete place.id;
            delete place.sid;

            let pd = place.date;
            place.date = new Date(pd);

            place.longitude = parseFloat(place.longitude);
            place.latitude = parseFloat(place.latitude);
        }
    }

    public get title():string {
        return this.internalData.name;
    }

    public get data() : DisplayData {

        if(this._displayData) {
            return this._displayData;
        }

        let data = new DisplayData();
        data.title = this.internalData.name;

        let mainSection = new DisplaySection();
        let achSection = new DisplaySection();
        let pubSection = new DisplaySection();
        let referenceSection = new DisplaySection();

        mainSection.cls = "scholar";
        mainSection.title =  "";
        mainSection.subtitle = "";
        mainSection.content = this.internalData.description;
        mainSection.type = "text";

        achSection.cls = "achievements";
        achSection.title =  "انجازاته";
        achSection.subtitle = "";
        achSection.content = this.internalData.achievements;
        achSection.type = "text";

        pubSection.cls = "publications";
        pubSection.title =  "كتبه";
        pubSection.subtitle = "";
        pubSection.content = this.internalData.publications;
        pubSection.type = "bib";

        referenceSection.cls = "references";
        referenceSection.title = "المراجع";
        referenceSection.subtitle = "";
        referenceSection.content = this.internalData.references;
        referenceSection.type = "list";

        data.sections.push(mainSection);
        data.sections.push(achSection);
        data.sections.push(pubSection);
        data.sections.push(referenceSection);

        this._displayData = data;
        return this._displayData;

    }


    public updateFromPartial(subid:number, partial:any) {
        this.internalData['description'] = partial.bio;
        this.internalData['shareLink'] = partial.shareLink;
        this.internalData['references'] = partial.references.split('\n');
        this.internalData['publications'] = partial.publications;
        this.internalData['achievements'] = partial.achievements;
    }

    public updateActiveState(currentTime:Date): boolean {

        this._isVisible = this.dateHelper.isVisible(
            currentTime,
            this.internalData.born,
            this.internalData.died
        );

        if(!this._isVisible) {
            this._activeState = null;
            return this._isVisible;
        }

        for(let i:number=0; i<this.internalData.places.length; i++) {
            let current_state = this.internalData.places[i];
            let next_state = this.internalData.places[i+1];

            var stateStartDate 	= current_state.date.getTime();
            var stateEndDate	= this.internalData.died.getTime();

            if(i < this.internalData.places.length - 1) {
                stateEndDate = next_state.date.getTime();
                stateEndDate -= 1000 * 5;
            }
            if (this.dateHelper.isVisible(
                    currentTime,
                    new Date(stateStartDate),
                    new Date(stateEndDate))) {
                this._activeState = {
                    'age': this.dateHelper.getAge(this.internalData.born, currentTime),
                    'ageString': this.dateHelper.getAgeAsString(this.internalData.born, currentTime),
                    'place': current_state
                }
            }
        }
        return this._isVisible;
    }

}