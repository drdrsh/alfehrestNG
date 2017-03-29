import {
    Component, ElementRef, Output, EventEmitter, ChangeDetectorRef, Input, ViewChild, NgZone,
    HostListener
} from "@angular/core";
import {AlfehrestDataService} from "../services/alfehrest-data.service";
import {AlfehrestMapArea} from "./alfehrest-gm-area.component";
import {StateModel} from "../models/state";
import {environment} from "../environment"
import {MapCenter} from "./interfaces/MapCenter";
import {Model} from "../models/model";
import {PinAggregate} from "./interfaces/PinAggregate";



@Component({
    moduleId: module.id,
    selector: "gm-map",
    template: `
        <alfehrest-gm-area *ngFor="let state of areas" [selected]="state.id == selectedAreaId" [state]="state"></alfehrest-gm-area>
        <alfehrest-gm-pin  *ngFor="let pin of pins" [pin]="pin"></alfehrest-gm-pin>
        <div #container class="gm-container" (window:resize)="onWindowResize($event)"></div>
    `,
    styles: [`
        .gm-container {
            width: 100%;
            height: 100%;
        }
    `],
    providers: [{
        "provide": "GOOGLE",
        "useFactory": (gm)  => {return gm.google},
        "deps" : [GoogleMapsComponent]
    }, {
        "provide": "MAPS",
        "useFactory": (gm)  => {return gm.map},
        "deps" : [GoogleMapsComponent]
    }]
})
export class GoogleMapsComponent {

    @Input('center') center:MapCenter;

    @Output('map_ready') map_ready:EventEmitter<any>;
    @Output('map_pan_started') map_pan_started:EventEmitter<any>;
    @Output('map_pan_finished') map_pan_finished:EventEmitter<any>;
    @Output('map_aggregate_clicked') map_aggregate_clicked:EventEmitter<PinAggregate>;

    @ViewChild('container') domContainer: ElementRef;

    private centerChangedProgramtically:boolean = false;
    private callbackFunctionName: string = null;
    private apiKey: string = environment.GMKey;
    private map: any = null;
    private google:any = null;
    private zoomTimeoutHandle = null;
    private panTimeoutHandle = null;

    private isPanning:boolean = false;
    private selectedAreaId:number = -1;

    public areas:StateModel[] = [];
    public pins: PinAggregate[] = [];

    constructor(
        private domElement: ElementRef,
        private dataService: AlfehrestDataService,
        private changeDetector:ChangeDetectorRef,
        private zone: NgZone) {

        this.callbackFunctionName = "__GoogleCallback" + Math.random().toString(36).slice(-5);
        this.map_ready = new EventEmitter();
        this.map_pan_started = new EventEmitter();
        this.map_pan_finished = new EventEmitter();
        this.map_aggregate_clicked = new EventEmitter();

    }

    public getDomContainer() : ElementRef {
        return this.domContainer;
    }

    ngOnInit() {
        window[this.callbackFunctionName] = (ev) => {
            /*
            We are initializing google maps outside angular so all callback cascading from this event (which are ALOT)
            will be running outside angular's zone breaking all change detection, to fix this we run this callback from
            within angular zone
             */
            this.zone.run(() => this.onGoogleMapLoaded());
        };
        this.loadMap();
        this.dataService.active_period_changed.subscribe(this.onActivePeriodChanged.bind(this));
    }

    ngOnChanges(changes) {
        if(changes.center && this.center) {
            this.centerMap(this.center)
        }
    }

    private onActivePeriodChanged(data) {
        this.areas = data['state'];
        let pins = [];
        for(let idx of environment.pinEntities) {
            pins = pins.concat(data[idx]);
        }
        this.pins = PinAggregate.fromModelArray(pins);
    }

    private onGoogleMapLoaded() {

        let google = this.google = window["google"];
        var el = document.querySelector(".gm-container");
        let mapStyle =
            new google.maps.StyledMapType([{
                    "featureType":"administrative.country",
                    "elementType":"labels",
                    "stylers":[{ "visibility":"off" }]
                }, {
                    "featureType":"water",
                    "elementType":"labels",
                    "stylers":[{ "visibility":"off" }]
                }, {
                    "featureType":"administrative.province",
                    "stylers":[{ "visibility":"off" }]
                }, {
                    "featureType":"landscape",
                    "stylers":[
                        {"hue":"#ffa200"},
                        {"saturation":65},
                        {"lightness":-5}
                    ]
                }, {
                    "featureType":"poi",
                    "stylers":[{ "visibility":"off" }]
                }, {
                    "featureType":"road",
                    "stylers":[{ "visibility":"off" }]
                }, {
                    "featureType":"transit",
                    "stylers":[{ "visibility":"off" }]
                }],
                { "name": "Geography" }
            );

        this.map = new google.maps.Map(el, {
                panControl		: false,
                zoomControl		: false,
                mapTypeControl  : false,
                zoom			: 4,
                minZoom			: 3,
                maxZoom			: 6,
                center	 		: new google.maps.LatLng(30.002482071719506, 34.58984375000001),
                mapTypeId		: google.maps.MapTypeId.TERRAIN,
                keyboardShortcuts : false,
                mapTypeControlOptions: {
                    mapTypeIds: [google.maps.MapTypeId.TERRAIN,'Geography']
                },
                disableDefaultUI: true,
                streetViewControl:false
            }
        );
        this.map.mapTypes.set('Geography', mapStyle);
        this.map.setMapTypeId('Geography');

        google.maps.event.addListener(this.map, 'center_changed', this.onCenterChanged.bind(this));
        google.maps.event.addListener(this.map, 'zoom_changed', this.onZoomChanged.bind(this));
        google.maps.event.addListener(this.map, 'resize', this.z(this.onResize));

        google.maps.event.addListener(this.map, 'mousedown', this.z(this.onMouseDown));
        google.maps.event.addListener(this.map, 'mouseup', this.z(this.onMouseUp));
        google.maps.event.addListener(this.map, 'area_clicked', this.onAreaClicked.bind(this));
        google.maps.event.addListener(this.map, 'pin_clicked', this.onPinClicked.bind(this));

        this.map_ready.emit(this.map);
    }



    private onAreaClicked(model:StateModel) {
        this.selectedAreaId = model.id;
        for(let a of this.areas) {
            a.selected = (model.id == a.id);

        }
        this.changeDetector.detectChanges();
    }

    private onPinClicked(pin:PinAggregate) {
        this.selectedAreaId = -1;
        this.changeDetector.detectChanges();
    }

    private onMouseDown() {
        this.isPanning = true;
        this.map_pan_started.emit();
    }

    private onMouseUp() {
        if(this.isPanning) {
            this.isPanning = false;
            this.map_pan_finished.emit();
        }
    }

    private onCenterChanged() {
        if(this.centerChangedProgramtically) {
            this.centerChangedProgramtically = false;
            return;
        }
        if(this.center == null) {
            return;
        }

        clearTimeout(this.zoomTimeoutHandle);
        this.zoomTimeoutHandle = setTimeout(() => {
            this.center = null;
            this.zone.run(() => this.onZoomChanged())
        }, 20);
    }

    private onZoomChanged() {
        if(this.center) {
            clearTimeout(this.zoomTimeoutHandle );
            this.centerMap(this.center);
        }
    }

    private onResize() {
        if(this.center) {
            this.centerMap(this.center);
        }
    }

    onWindowResize(event) {
        setTimeout(() => this.google.maps.event.trigger(this.map, 'resize'), 50);
    }

    private z(callback) {
        let that = this;
        return function() {
            let args = arguments;
            that.zone.run(() => {
                callback.apply(that, args);
            });
        };
    }

    private getMapUrl() {

        let rootUrl: string = "http://maps.googleapis.com/maps/api/js?";
        let parts: any = {
            "key": this.apiKey,
            "libraries": ["geometry"],
            "language": "ar",
            "callback": this.callbackFunctionName
        };

        let fullUrl: string = rootUrl;
        let urlFragments: string[] = [];

        for (let idx of Object.keys(parts)) {
            let val: string = parts[idx];
            if (Array.isArray(parts[idx])) {
                val = parts[idx].join(",");
            }
            urlFragments.push(`${idx}=${val}`);
        }

        fullUrl += urlFragments.join("&");
        return fullUrl;

    }


    private loadMap() {

        console.log("Loading Google Maps");
        let node = document.createElement("script");
        node.src = this.getMapUrl();
        node.type = "text/javascript";
        node.defer = true;
        node.async = true;
        document.getElementsByTagName("head")[0].appendChild(node);

    }

    //From: http://stackoverflow.com/questions/10656743/how-to-offset-the-center-point-in-google-maps-api-v3
    private centerMap(newCenter:MapCenter) {

        this.center = newCenter;

        let google = this.google = window["google"];
        let map = this.map;
        let offsetX = newCenter.offsetX;
        let offsetY = newCenter.offsetY;
        let centerLatLng = new google.maps.LatLng(newCenter.latitude, newCenter.longitude);
        let worldCoordinateCenter = map.getProjection().fromLatLngToPoint(centerLatLng);

        let scale = Math.pow(2, map.getZoom());
        let pixelOffset = new google.maps.Point((offsetX/scale) || 0,(offsetY/scale) ||0);
        let worldCoordinateNewCenter = new google.maps.Point(
            worldCoordinateCenter.x - pixelOffset.x,
            worldCoordinateCenter.y + pixelOffset.y
        );

        this.centerChangedProgramtically = true;
        let latlngNewCenter = map.getProjection().fromPointToLatLng(worldCoordinateNewCenter);

        map.panTo(latlngNewCenter);
    }

}
