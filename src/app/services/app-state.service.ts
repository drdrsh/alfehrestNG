import {Injectable, ComponentFactoryResolver} from "@angular/core";
import {Model} from "../models/model";
import {StateModel} from "../models/state";
import {EventModel} from "../models/event";
import {ScholarModel} from "../models/scholar";
import { DOCUMENT } from '@angular/platform-browser';



@Injectable()
export class AppStateService {

    private stateVariable = {
        'timeline' : true,
        'content-pane': false,

    };
    constructor() {

    }


}
