import {Component, EventEmitter, Output, Input, ViewEncapsulation} from "@angular/core";
import {AlfehrestDataService} from "../services/alfehrest-data.service";
import {StateModel} from "../models/state";
import {EventModel} from "../models/event";
import {ScholarModel} from "../models/scholar";
import {Router, ActivatedRoute} from "@angular/router";
import {Model} from "../models/model";
import { SlimScrollModule } from 'ng2-slimscroll';
import {ISlimScrollOptions} from "ng2-slimscroll/src/classes/slimscroll-options.class";

@Component({
    moduleId: module.id,
    selector: "alfehrest-bottom-panel",
    template: `
        <span class="year">{{currentDate | hijri:'gmmmm gyyyy ce (hmmmm hyyyy ah)'}}</span>
        <div class="menu-toggle" (click)="onMenuBtnClicked()">
            <svg width="30" height="30" id="icoOpen">
                <path d="M0,5 30,5" stroke="#006600" stroke-width="5"/>
                <path d="M0,14 30,14" stroke="#006600" stroke-width="5"/>
                <path d="M0,23 30,23" stroke="#006600" stroke-width="5"/>
            </svg>
        </div>
        
        <div class="sliding-panel state" [ngClass]="{open: openPanel=='state', scrolling: scrolling}">
            <div class="button" (click)="openPanel = (openPanel=='state'?'':'state')"></div>
            <div class="badge">{{states.length}}</div>
            <ul slimScroll [options]="opts" (scroll)="onScroll()">
                <li *ngFor="let state of states" (click)="onEntityClicked(state)">
                <div class="state-legend" [ngStyle]="{'background-color': '#' + state.internalData.color}"></div>
                    {{state.title}}
                </li>
            </ul>
        </div>
            
        <div class="sliding-panel scholar" [ngClass]="{open: openPanel=='scholar', scrolling: scrolling}">
            <div class="button" (click)="openPanel = (openPanel=='scholar'?'':'scholar')"></div>
            <div class="badge">{{scholars.length}}</div>
            <ul slimScroll [options]="opts" (scroll)="onScroll()">
                <li *ngFor="let scholar of scholars" (click)="onEntityClicked(scholar)">
                    {{scholar.title}}
                </li>
            </ul>
        </div>
        
        <div class="sliding-panel event" [ngClass]="{open: openPanel=='event', scrolling: scrolling}">
            <div class="button" (click)="openPanel = (openPanel=='event'?'':'event')"></div>
            <div class="badge">{{events.length}}</div>
            <ul slimScroll [options]="opts" (scroll)="onScroll()">
                <li *ngFor="let event of events" (click)="onEntityClicked(event)">
                    {{event.title}}
                </li>
            </ul>
        </div>
        `,
    styles: [`
        :host {
            text-align:center;
            background-color:#006600;
            border:1px solid black;
            border-bottom:0;
            white-space:nowrap;
            font-weight:bold;
            color:white;
            font-size:80%;
        }
        
        .menu-toggle {
            width: 70px;
            height:35px;
            padding-top:4px;
            background-color:white;
            cursor:pointer;
        }
        
        span{
            display:block;
            float:left;
            width:50%;
            text-align:left;
            margin-left:15px;
            margin-top:5px;
        }
        
        .sliding-panel {
            position: absolute;
            top:0px;
            transition: all 0.5s;
            height:230px;
            width: 200px;
            z-index: 0;
        }

        .sliding-panel.state { right:100px; }
        .sliding-panel.scholar { right:160px; }
        .sliding-panel.event { right:220px; }

        .sliding-panel.state .button { background-image: url('assets/state.png'); }
        .sliding-panel.scholar .button { background-image: url('assets/scholar.png'); }
        .sliding-panel.event .button { background-image: url('assets/event.png'); }

        .sliding-panel.open {
            transform: translateY(-230px);
            z-index: 50;
         }
        
        .sliding-panel .badge {
            background-color:green;
            border-radius:36px;
            border: 2px solid white;
            position: absolute;
            display: inline-block;
            right: -10px;
            top: -10px;
            width:14px;
            height: 14px;
            font-weight:bold;
            white-space: nowrap;
            color:#ffffff;
            padding: 2px;
            text-shadow: 0 1px 1px #707070;
            text-align: center;
            font-size: 12px;
            box-shadow:0 0 1px #333;
            z-index: 50;
        }
        
        .sliding-panel .button {
            cursor: pointer;
            height: 33px;
            width: 36px;
            background-repeat: no-repeat;
            background-position: center center;
            background-size: 30px 30px;
            border-bottom: 2px solid white;
            background-color:#006600;
        } 

        .sliding-panel ul {
            background-color: white;
            height:100%;
            margin:0;
            padding:0;
            list-style: none;
            overflow-y: scroll;
        }
        .sliding-panel ul li {
            cursor: pointer;
            text-align: right;
            border-bottom: 1px solid #eee;
            color: black;
            font-weight: bold;
            padding-right: 10px;
            height: 30px;
            text-decoration: none;
            box-sizing: border-box;
            padding-top: 3px;
            padding-bottom: 3px;
        }
        .sliding-panel ul li:hover {
            background-color: #006600;
            color:white;
        }
        
        
        .state-legend {
            width: 20px;
            height: 30px;
            float: left;
            margin-top: -3px;
        }
        

    `]
})
export class AlfehrestBottomPanelComponent {

    @Input('current-date') private currentDate:Date = new Date();
    @Output('menu_button_clicked') private menu_button_clicked:EventEmitter<void>;

    private openPanel:string = "";

    private scrolling:boolean = false;
    private scrollTimeout = null;

    private states:StateModel[] = [];
    private scholars:ScholarModel[] = [];
    private events:EventModel[] = [];

    opts: ISlimScrollOptions;

    constructor(
        private router:Router,
        private route:ActivatedRoute,
        private dataService:AlfehrestDataService) {
        this.menu_button_clicked = new EventEmitter<void>();

        this.dataService.active_period_changed.subscribe(this.onActivePeriodChanged.bind(this));

    }

    ngOnInit() {
        this.opts = {
            position: 'left',
            barBackground: '#000000'
        }
    }

    onActivePeriodChanged(activeEntities) {
        this.states = activeEntities.state;
        this.scholars = activeEntities.scholar;
        this.events = activeEntities.event;
    }

    onMenuBtnClicked() {
        this.menu_button_clicked.emit();
    }

    onEntityClicked(e:Model) {
        let route = ['time', this.route.snapshot.params['time']];
        route.push(e.entityType);
        route.push(e.id);
        if(e.activeState.ruler){
            route.push(e.activeState.ruler.id);
        } else {
            route.push(0);
        }
        this.router.navigate(route)
    }

    onScroll() {
        //this.scrolling = true;
        //clearTimeout(this.scrollTimeout);
        //this.scrollTimeout = setTimeout(() => this.scrolling = false, 1500);
    }
}