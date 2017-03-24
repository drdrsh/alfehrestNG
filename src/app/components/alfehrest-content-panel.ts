import {
    Component, ElementRef, EventEmitter, Output, ChangeDetectorRef, style, state, animate,
    transition, trigger
} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";
import {AlfehrestDataService} from "../services/alfehrest-data.service";
import {Model} from "../models/model";

/*
 <div *ngIf="entityData" class="parent" [ngSwitch]="entityType">
 <alfehrest-state   *ngSwitchCase="'state'"   [data]="entityData" ></alfehrest-state>
 <alfehrest-scholar *ngSwitchCase="'scholar'" [data]="entityData" ></alfehrest-scholar>
 <alfehrest-event   *ngSwitchCase="'event'"   [data]="entityData" ></alfehrest-event>
 </div>

 */
@Component({
    moduleId: module.id,
    selector: "alfehrest-content",
    animations: [
        trigger('routeAnimation', [
            state('void', style({opacity: 0})),
            state('*', style({opacity: 0.8})),
            transition(':enter', [
                style({opacity: 0}),
                animate('500ms ease-out', style({opacity:1}))
            ]),
            transition(':leave', [
                style({opacity: 0.8}),
                animate('500ms ease-out', style({opacity:0}))
            ])
        ])
    ],
    host: {'[@routeAnimation]': ''},
    template: `
        <section [ngClass]="{loading: !entityData}">
            <alfehrest-state  [data]="entityData" ></alfehrest-state>
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
            background-color: black;
            opacity: 0.8;
        }
        section.loading {
            background-position: center;
            background-repeat: no-repeat;
            background-image: url('assets/loading.gif');
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
        this.subscriptions.push(this.route.params.subscribe(this.onParamsChange.bind(this)));
        this.subscriptions.push(this.dataService.entity_data_loaded.subscribe(this.onDataArrived.bind(this)));
    }

    onDataArrived(model:Model) {
        this.entityId = model.id;
        this.entityType = model.entityType;
        this.entityData = model;
    }

    onParamsChange(params) {
        //TODO: URL Error checking
        this.currentTime = new Date(parseInt(this.route.parent.snapshot.params['time'], 10));

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
