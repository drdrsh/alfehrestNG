import {Component, Input, SimpleChanges} from "@angular/core";
import {StateModel} from "../../models/state";
import {GoogleMapsComponent} from "../gm-map.component";
import {DisplayData} from "../interfaces/display-data";

@Component({
    moduleId: module.id,
    selector: "alfehrest-state",
    template: `
        <alfehrest-tabs *ngIf="state" [data]="state.data"></alfehrest-tabs>
    `,
    styles: [`
        :host {
            height:100%;
        }
        p {
        color:black;
        }
       
    `]
})
export class AlfehrestStateContentComponent{

    @Input('id') stateId:number;
    @Input('data') state: StateModel;

    ngOnChanges(changes: SimpleChanges) {

    }
}