import {Component, Input} from "@angular/core";
import {StateModel} from "../../models/state";
import {ScholarModel} from "../../models/scholar";

@Component({
    moduleId: module.id,
    selector: "alfehrest-scholar",
    template: ``,
    styles: [``]
})
export class AlfehrestScholarContentComponent{

    @Input('id') stateId:number;
    @Input('data') event: ScholarModel;


}