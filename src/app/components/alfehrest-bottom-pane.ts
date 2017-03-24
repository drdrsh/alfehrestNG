import {
    Component, Output, EventEmitter, ChangeDetectorRef, ViewChild, ElementRef, style, state,
    animate, transition, trigger, ViewEncapsulation
} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {AlfehrestDataService} from "../services/alfehrest-data.service";
import {Model} from "../models/model";
import {MapCenter} from "./interfaces/MapCenter";
import {GoogleMapsComponent} from "./gm-map.component";
import {environment} from "../environment";

@Component({
    moduleId: module.id,
    selector: "alfehrest-bottom-pane",
    template: `
        <div #bottomPane class="bottom-pane">
            <span class="year">{{currentDate | hijri:'hijri-long'}}</span>
            <div class="menu-toggle" (click)="onMenuBtnClicked()">
                <svg width="30" height="30" id="icoOpen">
                    <path d="M0,5 30,5" stroke="#006600" stroke-width="5"/>
                    <path d="M0,14 30,14" stroke="#006600" stroke-width="5"/>
                    <path d="M0,23 30,23" stroke="#006600" stroke-width="5"/>
                </svg>
            </div>
        </div>
        `,
    styles: [`
        .bottom-pane {
            position:absolute;
            height:35px;
            width:100%;
            left:0;
            bottom:0;
            transform: translateY(0px);
            transition: transform 0.3s;
            text-align:center;
            background-color:#006600;
            border:1px solid black;
            border-bottom:0;
            white-space:nowrap;
            font-weight:bold;
            color:white;
            font-size:80%;
        }
        
        .bottom-pane > span{
            display:block;
            float:left;
            width:50%;
            text-align:left;
            margin-left:15px;
            margin-top:5px;
        }
    `]
})

export class AlfehrestBottomPaneComponent {

    @ViewChild('contentPane') domContentPane: ElementRef;
    @ViewChild('mapPane') domMapPane: GoogleMapsComponent;

    private isPanning:boolean = false;
    private contentPaneOpen:boolean = false;
    private currentCenter:MapCenter = null;
    private currentDate:Date = null;
    private sliderHidden:boolean = false;
    private menuOpen:boolean = false;
    private currentTitle:string = null;

    constructor(
        private route: ActivatedRoute,
        private dataService: AlfehrestDataService) {
    }

    ngOnInit() {
        this.route.params.subscribe(this.onParamsChange.bind(this));
        this.dataService.entity_data_loaded.subscribe(this.onDataArrived.bind(this));
        this.dataService.entity_data_loading.subscribe(this.onQueryStarted.bind(this));
    }

    onQueryStarted(requestedEntity:Model) {
        this.contentPaneOpen = true;
        this.currentCenter = requestedEntity.center;
        this.currentTitle = requestedEntity.title;
        let contentPaneHeight = this.domContentPane.nativeElement['offsetHeight'];
        let contentPaneWidth = this.domContentPane.nativeElement['offsetWidth'];
        let mapPaneHeight = this.domMapPane.getDomContainer().nativeElement['offsetHeight'];
        let mapPaneWidth = this.domMapPane.getDomContainer().nativeElement['offsetWidth'];

        this.currentCenter.offsetX = (mapPaneWidth - contentPaneWidth) / 2;
        this.currentCenter.offsetY = mapPaneHeight/2 - contentPaneHeight - 25;
        if(environment.pinEntities.indexOf(requestedEntity.entityType) != -1) {
            this.currentCenter.offsetY -= 40;
        }
        this.sliderHidden = true;

    }

    onDataArrived(loadedEntity:Model) {
    }

    onParamsChange(params) {
        if(params.time) {
            this.contentPaneOpen = false;
            let t = +params.time;
            let d:Date = new Date(t);
            this.currentDate = d;
            this.dataService.updateActivePeriod(d);
        }
    }

    onMapPanStarted() {
        this.isPanning = true;
        console.log('started');
    }

    onMapPanFinished() {
        this.currentCenter = null;
        this.isPanning = false;
        console.log('finished');
    }

    onSliderCloseClicked() {
        this.sliderHidden = !this.sliderHidden;
    }

    onSliderSliding(date:number) {

        this.currentDate = new Date(date);
    }

    onMapReady (map:any) {
        this.dataService.loadInitialData().subscribe(
            data => console.log(data),
            err => console.error(err),
            () => console.log('Authentication Complete')
        );
    }

    onMenuBtnClicked() {
        this.menuOpen = !this.menuOpen;
    }
}