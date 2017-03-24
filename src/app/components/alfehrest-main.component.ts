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
                [center]="currentCenter">
            </gm-map>
            <div #contentPane class="content-pane">
                    <h2 [innerHTML]="currentTitle"></h2>
                <router-outlet></router-outlet>
            </div>
            <alfehrest-slider #slider 
                (value_sliding)="onSliderSliding($event)"
                (close_button_clicked)="onSliderCloseClicked()">
        </alfehrest-slider>
            <div #bottomPane class="bottom-pane">
                <span class="year">{{currentDate | hijri:'gmmmm gyyyy ce (hmmmm hyyyy ah)'}}</span>
                <div class="menu-toggle" (click)="onMenuBtnClicked()">
                    <svg width="30" height="30" id="icoOpen">
                        <path d="M0,5 30,5" stroke="#006600" stroke-width="5"/>
                        <path d="M0,14 30,14" stroke="#006600" stroke-width="5"/>
                        <path d="M0,23 30,23" stroke="#006600" stroke-width="5"/>
                    </svg>
                </div>
            </div>
        </div>
        <div #sidePane class="side-pane">
            <ul>
                <li class='about'>عن الفهرست</li>
                <li class='search'>بحث</li>
                <li class='settings'>الإعدادت</li>
                <li class='help'>مساعدة</li>
                <li class='facebook'>صفحتنا على الفيسبوك</li>
                <li class='twitter'>حسابنا على تويتر</li>
                <li class='report'>الإبلاغ عن خطأ</li>
                <li class='exit'>خروج</li>
            </ul>        
        </div>
        `,
    styles: [`
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
        
        .main-pane {
            transition: transform 0.5s;
            position: fixed;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
            z-index:1;
        }

        .menu-open .main-pane{
            transform: translateX(-200px);
        }
        
        .side-pane {
            position: fixed;
            left: 0;
            right:0;
            top:0;
            bottom:0;

            width:200px;

        	z-index:-22;
            overflow-x: hidden;
            overflow-y: auto;
            color: #fff;
            box-shadow: inset 0 0 5px 5px #222;
            background-color: #333;
            background-image:url('assets/logo.png');
            background-size:65px 65px;
            background-position:50% 95%;
            background-repeat:no-repeat;
        }
        
        .content-pane h2 {
            height: 50px;
            margin: 0;
            color: wheat;
            box-sizing: border-box;
            padding: 10px;
        }
        
        .content-pane {
            transition: all 1.5s;
            width: calc(100% - 120px);
            height: 50%;
            position: absolute;
            right: 0;
            bottom: 100%;
            z-index: 15;
            background-color: black;
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
        }

  
        gm-map {
            width: 100%;
            height: calc(100% - 35px);
            position: absolute;
            left: 0;
            top:0;
            z-index:0;
        
        }
        
        alfehrest-slider {
            position: absolute;
            left:0;
            width:120px;
            height: 80%;
            background-color:red;
            z-index: 15;
            border-radius: 0  0 25px 0;
            transition: all 1.5s;
        }
        
        .slider-gone  alfehrest-slider {
            transform: translateY(-90%);
        }
        
        .menu-toggle {
            width: 70px;
            height:35px;
            padding-top:4px;
            background-color:white;
            cursor:pointer;
        }

        .slider-gone  .content-pane {
            width:100%;
        }
        
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

        .side-pane  ul{
            margin:0;
            padding:0;
        }
        .side-pane li{
            cursor:pointer;
            background-repeat:no-repeat;
            background-position:5% 50%;
            background-size:30px 30px;
            text-indent:5px;
            display: block;
            margin: 0;
            line-height: 48px;
            border-top: 1px solid #4d4d4d;
            border-bottom: 1px solid #1a1a1a;
        }

        .side-pane li.facebook{
            background-image:url('assets/facebook.png');
        }
        .side-pane li.twitter{
            background-image:url('assets/twitter.png');
        }
        .side-pane li.about{
            background-image:url('assets/about.png');
        }
        .side-pane li.settings{
            background-image:url('assets/settings.png');
        }
        .side-pane li.report{
            background-image:url('assets/report.png');
        }
        .side-pane li.help{
            background-image:url('assets/help.png');
        }
        .side-pane li.search{
            background-image:url('assets/search.png');
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