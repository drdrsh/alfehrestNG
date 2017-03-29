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
import {DisplayData, DisplaySection} from "./interfaces/display-data";
import {PinAggregate} from "./interfaces/PinAggregate";

@Component({
    moduleId: module.id,
    encapsulation: ViewEncapsulation.None,
    selector: "alfehrest-main",
    host:  {
        '[class.content-open]': 'contentPaneOpen',
        '[class.map-centered]': 'currentCenter',
        '[class.map-panning]': 'isPanning',
        '[class.slider-gone]': 'sliderHidden',
        '[class.menu-open]': 'menuOpen'

    },
    template: `
        <div #mainPane class="main-pane">
            <h1 class="logo"></h1>
            <gm-map #mapPane 
                (map_ready)="onMapReady()"  
                (map_pan_started)="onMapPanStarted()" 
                (map_pan_finished)="onMapPanFinished()" 
                (map_aggregate_clicked)="onMapAggregateClicked($event)"
                [center]="currentCenter">
            </gm-map>
            <div #contentPane class="content-pane">
                    <h2>{{currentTitle}}</h2>
                    <div class="btn-close" (click)="onCloseClicked()"></div>
                    
                <router-outlet></router-outlet>
            </div>
            <alfehrest-slider #slider 
                (value_sliding)="onSliderSliding($event)"
                (close_button_clicked)="onSliderCloseClicked()">
            </alfehrest-slider>
            <alfehrest-bottom-panel 
                    
                [current-date]="currentDate" 
                (menu_button_clicked)="menuOpen = !menuOpen" #bottomPanel>
            </alfehrest-bottom-panel>
        </div>
        <alfehrest-side-panel #sidePanel></alfehrest-side-panel>
        `,
    styles: [`
        alfehrest-bottom-panel {
            position:absolute;
            height:35px;
            width:100%;
            left:0;
            bottom:0;
            transform: translateY(0px);
            transition: transform 0.3s;
        }
        
        alfehrest-slider {
            position: absolute;
            left:0;
            width:120px;
            height: 80%;
            z-index: 15;
            transition: all 0.5s;
            box-shadow: 0 0 5px 1px #222;
        }
        
        alfehrest-side-panel {
            width:200px;
            height:100%;
            position: fixed;
            right:0;
            top:0;
        }
        
        gm-map {
            width: 100%;
            height: calc(100% - 35px);
            position: absolute;
            left: 0;
            top:0;
            z-index:0;
            background-color:white;
        }
        
        .main-pane {
            transition: transform 0.5s;
            position: fixed;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
            z-index:1;
            box-shadow: 0 0 5px 5px #222;
        }
        
        .logo {
            transition: all 0.5s;
            background-image: url('assets/logo.png');
            width:120px;
            height:120px;
            background-repeat: no-repeat;
            background-position: center center;
            background-size: 100px 100px;
            margin:0;
        }
        
        .main-pane > .logo {
            background-image: url('assets/logo-inverted.png');
            position: fixed;
            bottom: 55px;
            left: 0;
            z-index: 5;
            opacity: 0;
        }

        .slider-gone .main-pane > .logo {
            opacity: 1;
        }
        


        .menu-open .main-pane{
            transform: translateX(-200px);
        }
        
        .content-pane h2 {
            height: 50px;
            margin: 0;
            background-color: #222;
            color:white;
            box-sizing: border-box;
            padding: 3px;
        }
         
        .content-pane {
            transition: all 0.5s;
            width:100%;
            height: 50%;
            position: absolute;
            right: 0;
            bottom: 100%;
            z-index: 15;    
        }
        
        .content-pane .btn-close {
            position: absolute;
            left:0;
            top:0;
            background-image: url("assets/close-square.png");
            background-repeat: no-repeat;
            width:50px;
            height:50px;
            background-size: 50px 50px;
            transform: translateX(120px);
            transition: all 0.5s;
            cursor: pointer;
        }
        .slider-gone .content-pane .btn-close {
            transform: translateX(0px);
        }
        .map-panning .content-pane {
            opacity: 0.1;
        }
        .content-open.map-centered .content-pane:before {
            content: ' ';
            border-style: solid;
            border-width: 25px 15px 15px 15px;
            border-color: black transparent transparent transparent;
            position: absolute;
            bottom: -40px;
            right: calc(50% - 14px);
        }
        
        .content-open .content-pane {
            transform: translateY(100%);
            box-shadow: 0 0 25px 1px #222;
        }

  

        

        
        .slider-gone  alfehrest-slider {
            transform: translateX(-100%);
        }
        
        .content-pane  /deep/ .tab-body p,
        .content-pane  /deep/ .tab-body ol {
            width: calc(100% - 120px);
        }
        
        .slider-gone  .content-pane  /deep/ .tab-body p,
        .slider-gone  .content-pane  /deep/ .tab-body ol {
            width: auto;
        }
        
        
    
        .scrolling .slimscroll-grid, 
        .scrolling .slimscroll-bar {
            transition: all 0.2s !important;
            opacity: 1 !important;
        }
        
        
        .slimscroll-grid, 
        .slimscroll-bar {
            transition: all 0.2s !important;
            opacity: 0 !important;
        }
        
        .slimscroll-bar {
            width: 8px !important;
            left: 2px !important;
        }
        

    `]
})

export class AlfehrestMainComponent {

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

    onCloseClicked() {
        this.contentPaneOpen = false;
        this.currentCenter = null;
    }

    onMapAggregateClicked(pin:PinAggregate){

        this.currentTitle = pin.title;


    }
}