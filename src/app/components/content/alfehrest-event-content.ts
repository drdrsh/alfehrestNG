import {Component, Input} from "@angular/core";
import {StateModel} from "../../models/state";
import {ScholarModel} from "../../models/scholar";
import {EventModel} from "../../models/event";

@Component({
    moduleId: module.id,
    selector: "alfehrest-event",
    template: ``,
    styles: [``]
})
export class AlfehrestEventContentComponent{

    @Input('id') stateId:number;
    @Input('data') event: EventModel;

}