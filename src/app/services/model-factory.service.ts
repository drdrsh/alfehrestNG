import {Injectable, ComponentFactoryResolver} from "@angular/core";
import {Model} from "../models/model";
import {StateModel} from "../models/state";
import {EventModel} from "../models/event";
import {ScholarModel} from "../models/scholar";

@Injectable()
export class ModelFactoryService {

    private objectMap:any = null;


    public getActiveEntities() {
        return Object.keys(this.objectMap);
    }

    public getConstructor(name: string) {
        return this.objectMap[name];
    }

    public getInstance(name: string, ...args: any[])  {
        let instance = Object.create(this.objectMap[name].prototype);
        instance.constructor.apply(instance, args);
        return instance;
    }

    constructor() {
        this.objectMap = {
            'state': StateModel,
            'scholar': ScholarModel,
            'event': EventModel
        };
    }


}
