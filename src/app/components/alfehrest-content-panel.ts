import {
    Component, ElementRef, EventEmitter, Output, ChangeDetectorRef, style, state, animate,
    transition, trigger
} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";
import {AlfehrestDataService} from "../services/alfehrest-data.service";
import {Model} from "../models/model";
import {DisplayData, DisplaySection} from "./interfaces/display-data";
import {PinAggregate} from "./interfaces/PinAggregate";

/*
 <div *ngIf="entityData" class="parent" [ngSwitch]="entityType">
 <alfehrest-state   *ngSwitchCase="'state'"   [data]="entityData" ></alfehrest-state>
 <alfehrest-scholar *ngSwitchCase="'scholar'" [data]="entityData" ></alfehrest-scholar>
 <alfehrest-event   *ngSwitchCase="'event'"   [data]="entityData" ></alfehrest-event>
 </div>

 animations: [
 trigger('routeAnimation', [
 state('void', style({opacity: 0})),
 state('*', style({opacity: 0.85})),
 transition(':enter', [
 style({opacity: 0}),
 animate('500ms ease-out', style({opacity:1}))
 ]),
 transition(':leave', [
 style({opacity: 0.85}),
 animate('500ms ease-out', style({opacity:0}))
 ])
 ])
 ],
 host: {'[@routeAnimation]': ''},
 */
@Component({
    moduleId: module.id,
    selector: "alfehrest-content",
    template: `
        <section [ngClass]="{loading: !entityData}">
        <alfehrest-tabs *ngIf="entityData" [data]="entityData.data"></alfehrest-tabs>
            <!--
            <alfehrest-state  [data]="entityData" ></alfehrest-state>
            -->
        </section>
    `,
    styles : [`
        :host {
           height: calc(100% - 50px);
           display: block;
        }
        section {
            height: 100%;
            color:white;
            background-color: white;
        }
        section.loading {
            background-position: center;
            background-repeat: no-repeat;
            background-image: url('assets/loading-invert.gif');
        }
    `]
})
export class AlfehrestContentComponent {

    @Output() private entityId = null;
    @Output() private entityType = null;
    @Output() private entityData = null;

    private subscriptions:any[] = [];
    private currentTime:Date = null;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private dataService:AlfehrestDataService) {
    }

    ngOnInit() {
        this.route.queryParams.subscribe(this.onUrlChange.bind(this));
        this.subscriptions.push(this.route.params.subscribe(this.onParamsChange.bind(this)));
        this.subscriptions.push(this.dataService.entity_data_loaded.subscribe(this.onDataArrived.bind(this)));
    }

    onUrlChange() {
        this.onParamsChange(this.route.snapshot.params);
    }

    onDataArrived(model:Model) {
        this.entityId = model.id;
        this.entityType = model.entityType;
        this.entityData = model;
    }

    loadAggregateData() {


        let pin:PinAggregate = this.dataService.selectedAggregate;

        if(!pin) {
            return;
        }

        let data = new DisplayData();
        data.title = pin.title;

        let mainSection = new DisplaySection();
        mainSection.cls = "pin";
        mainSection.title =  pin.title;
        mainSection.subtitle = "";
        mainSection.content = pin.pins;
        mainSection.type = "entity";
        data.sections.push(mainSection);

        this.entityData = {'data' : data};

    }
    onParamsChange(params) {
        //TODO: URL Error checking
        this.currentTime = new Date(parseInt(this.route.parent.snapshot.params['time'], 10));

        if(!params.entityType) {
            this.loadAggregateData();
            return;
        }
        this.entityId = null;
        this.entityType = null;
        this.entityData = null;

        let entityType = params.entityType;
        let id = parseInt(params.id, 10);
        let sid = parseInt(params.sid, 10);
        sid = isNaN(sid)?undefined:sid;
        this.dataService.loadEntityData(entityType, id, sid);
    }

    ngOnDestroy() {
        this.subscriptions.map(v => v.unsubscribe());
    }
}
