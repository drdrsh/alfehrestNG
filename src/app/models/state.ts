import {AlfehrestDataService} from "../services/alfehrest-data.service";
import {Inject, ReflectiveInjector} from "@angular/core";
import {DateConverterService} from "../services/date-converter/date-converter.service";
import {Model} from "./model";
import {DisplayData, DisplaySection} from "../components/interfaces/display-data";
import {MapCenter} from "../components/interfaces/MapCenter";
import {TRANSLATION_PROVIDERS} from "../language/translation";
import {TranslateService} from "../language/translation.service";
import {HijriPipe} from "../pipes/hijri.pipe";

export class StateModel extends Model{


    public static fromInitial(obj:any) {
        let injector = ReflectiveInjector.resolveAndCreate([DateConverterService, TranslateService, TRANSLATION_PROVIDERS]);
        let entity = new StateModel(injector.get(DateConverterService), obj);
        entity._entityType = 'state';
        return entity;
    }

    get center() : MapCenter {
        let m:MapCenter = new MapCenter();
        if(!this._activeState) {
            return m;
        }
        let centeroid = this.getNorthMostPoint();
        m.latitude  = centeroid[0];
        m.longitude  = centeroid[1];
        return m;
    }

    get color() {
        return this.internalData.color;
    }

    protected readData() {

        let ss:any = this.internalData.start_date;
        let se:any = this.internalData.end_date;
        this.internalData.start_date = new Date(ss);
        this.internalData.end_date = new Date(se);

        for(let coord of this.internalData.coords) {
            let x:any = coord.start_date;
            coord.start_date = new Date(x);
        }

        for(let ruler of this.internalData.rulers) {
            let x:any = ruler.start_date;
            ruler.start_date = new Date(x);
        }

        //var area = google.maps.geometry.spherical.computeArea(p.getPath());
        //nationData.area   = formatArea(area);
        //nationData.center = new google.maps.Marker({position:bounds.getCenter(),map:null});


    }

    private getNorthMostPoint() {
        let arr = this._activeState.land.points;
        let maxLat = -1000;
        let targetPoint = null;
        for (let pnt of arr) {
            maxLat = Math.max(pnt[0], maxLat);
            if(maxLat == pnt[0]) {
                targetPoint = pnt;
            }
        }
        return targetPoint;
    }
    //From : http://stackoverflow.com/questions/22796520/finding-the-center-of-leaflet-polygon
    private getCenteroid() {
        let arr = this._activeState.land.points;
        let twoTimesSignedArea = 0;
        let cxTimes6SignedArea = 0;
        let cyTimes6SignedArea = 0;

        let length = arr.length;

        let x = function (i) { return arr[i % length][0] };
        let y = function (i) { return arr[i % length][1] };

        for (let i = 0; i < length; i++) {
            let twoSA = x(i)*y(i+1) - x(i+1)*y(i);
            twoTimesSignedArea += twoSA;
            cxTimes6SignedArea += (x(i) + x(i+1)) * twoSA;
            cyTimes6SignedArea += (y(i) + y(i+1)) * twoSA;
        }
        let sixSignedArea = 3 * twoTimesSignedArea;
        return [ cxTimes6SignedArea / sixSignedArea, cyTimes6SignedArea / sixSignedArea];
    }

    public get title():string {
        return this.internalData.name;
    }

    public get data() : DisplayData {
        let data = new DisplayData();
        data.title = this.internalData.name;

        let mainSection = new DisplaySection();
        let rulerSection = new DisplaySection();
        let referenceSection = new DisplaySection();

        mainSection.cls = "state";
        mainSection.title =  this.internalData.name;
        mainSection.subtitle = "Subtitle";
        mainSection.content = this.internalData.description;
        mainSection.type = "text";

        rulerSection.cls = "ruler";
        rulerSection.title =  this._activeState.ruler.name;
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

        return data;
    }

    public updateFromPartial(subid:number, partial:any) {

        this.internalData['description'] = partial.s_description;
        this.internalData['shareLink'] = partial.s_shareLink;
        this.internalData['references'] = partial.references.split('\n');

        this.internalData.rulers[subid]['shareLink'] = partial.r_shareLink;
        this.internalData.rulers[subid]['description'] = partial.r_description;

    }

    public updateActiveState(currentTime:Date): boolean {
        this._isVisible = this.dateHelper.isVisible(
            currentTime,
            this.internalData.start_date,
            this.internalData.end_date
        );

        if(!this._isVisible) {
            this._activeState = null;
            return this._isVisible;
        }

        for(let i:number=0; i<this.internalData.coords.length; i++) {
            let current_state = this.internalData.coords[i];
            let next_state = this.internalData.coords[i+1];

            var stateStartDate 	= current_state.start_date.getTime();
            var stateEndDate	= this.internalData.end_date.getTime();

            if(i < this.internalData.coords.length - 1) {
                stateEndDate = next_state.start_date.getTime();
                stateEndDate -= 1000 * 5;
            }
            if (this.dateHelper.isVisible(
                    currentTime,
                    new Date(stateStartDate),
                    new Date(stateEndDate))) {
                this._activeState = {
                    'age': this.dateHelper.getAge(this.internalData.start_date, currentTime),
                    'ageString': this.dateHelper.getAgeAsString(this.internalData.start_date, currentTime),
                    'area': 0,
                    'land': current_state,
                    'ruler': null
                };
            }
        }

        for(let i:number=0; i<this.internalData.rulers.length; i++) {
            let current_ruler = this.internalData.rulers[i];
            let next_ruler = this.internalData.rulers[i+1];

            var stateStartDate 	= current_ruler.start_date.getTime();
            var stateEndDate	= this.internalData.end_date.getTime();

            if(i < this.internalData.rulers.length - 1) {
                stateEndDate = next_ruler.start_date.getTime();
                stateEndDate -= 1000 * 5;
            }
            current_ruler.id = i;
            if (this.dateHelper.isVisible(
                    currentTime,
                    new Date(stateStartDate),
                    new Date(stateEndDate))) {
                this._activeState.ruler = current_ruler;
            }
        }
        return this._isVisible;
    }


}