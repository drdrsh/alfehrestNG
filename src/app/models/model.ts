import {DateConverterService} from "../services/date-converter/date-converter.service";
import {DisplayData} from "../components/interfaces/display-data";
import {MapCenter} from "../components/interfaces/MapCenter";
import {TranslateService} from "../language/translation.service";
export abstract class Model {

    protected internalData:any;
    protected _activeState:any;
    protected _isVisible:boolean = false;
    protected _selected:boolean = false;
    protected _entityType:string = "";
    protected _displayData = null;

    protected abstract readData();

    public abstract updateFromPartial(subid:number, partial:any);
    public abstract updateActiveState(currentTime:Date): boolean;
    public abstract get data() : DisplayData;
    public abstract get center(): MapCenter;
    public abstract get title(): string;

    constructor(protected dateHelper: DateConverterService, protected translateService:TranslateService, initialData:any) {
        this.internalData = initialData;
        this.readData();
    }

    public getFullData() {
        return this.internalData;
    }

    get id() : number {
        return this.internalData.id;
    }

    get subid() : number {
        return 0;
    }

    get activeState() {
        return this._activeState;
    }

    get visible() : boolean {
        return this._isVisible;
    }

    get entityType() : string {
        return this._entityType
    }

    get selected(): boolean {
        return this._selected;
    }

    set selected(s:boolean) {
        this._selected = s;
    }

    get(property) {
        return this.getFullData()[property];
    }


}
