import {Component, ElementRef, Output, EventEmitter, Input, Inject, NgZone} from "@angular/core";
import {AlfehrestDataService} from "../services/alfehrest-data.service";
import {StateModel} from "../models/state";
import {Router, ActivatedRoute} from "@angular/router";

@Component({
    moduleId: module.id,
    selector: "alfehrest-gm-area",
    template: ''
})
export class AlfehrestMapArea {

    private currentActiveState:any=null;
    @Input() public state:StateModel;
    @Input() public selected:boolean;

    private polygon:any;
    private area:number;
    private center:any;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private dataStore:AlfehrestDataService,
        private zone:NgZone,
        @Inject('MAPS') private map: any,
        @Inject('GOOGLE') private google: any) {
    }

    ngDoCheck() {
        if(this.currentActiveState !=  this.state.activeState) {
            this.destory();
            this.render();
        }
    }

    ngOnInit() {
        this.render();

    }

    ngOnDestroy() {
        this.destory();
    }

    ngOnChanges(changes) {
        if(changes.selected) {
            let width = changes.selected.currentValue?2:0;
            let zIndex = changes.selected.currentValue?999:-1;
            if(this.polygon) {
                this.polygon.setOptions({
                    strokeWeight: width,
                    zIndex: zIndex
                });
            }
        }
    }

    private destory() {
        if(this.polygon) {
            this.polygon.setMap( null );
            this.polygon = null;
        }
    }

    private render() {

        let google = this.google;

        this.currentActiveState = this.state.activeState;

        if(!this.currentActiveState) {
            this.destory();
            return;
        }

        let bounds = new google.maps.LatLngBounds();

        let pCoordinates = [];
        for(let i:number=0; i<this.currentActiveState.land.points.length; i++) {
            let vertex = new google.maps.LatLng(
                this.currentActiveState.land.points[i][0],
                this.currentActiveState.land.points[i][1]
            );
            bounds.extend(vertex);
            pCoordinates.push(vertex);
        }

        this.polygon = new google.maps.Polygon({
            paths: pCoordinates,
            strokeColor: "#000000",
            strokeOpacity: 0.8,
            strokeWeight: 0,
            fillColor: "#" + this.state.color,
            fillOpacity: 0.7,
            zIndex: -1
        });
        this.polygon.setMap(this.map);
        this.polygon.stateId = this.state.id;

        this.area = google.maps.geometry.spherical.computeArea(this.polygon.getPath());
        this.center = new google.maps.Marker({
            position:bounds.getCenter(),
            map:null
        });

        google.maps.event.addListener(this.polygon, 'click', this.z(this.onClick));
        google.maps.event.addListener(this.polygon, 'mousedown', this.onMouseDown.bind(this));
        google.maps.event.addListener(this.polygon, 'mouseup', this.onMouseUp.bind(this));

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

    private onClick(ev) {
        google.maps.event.trigger(this.map, 'area_clicked', this.state);
        this.router.navigate([
            'time', this.route.snapshot.params['time'],
            'state', this.state.id, this.currentActiveState.ruler.id
        ]);
    }

    private onMouseDown() {
        //Bubble event up to the map
        let args = [this.map, 'mousedown'];
        args = args.concat(arguments);
        this.google.maps.event.trigger.apply(this.map, args);
    }

    private onMouseUp() {
        //Bubble event up to the map
        let args = [this.map, 'mouseup'];
        args = args.concat(arguments);
        this.google.maps.event.trigger.apply(this.map, args);
    }

    private onMouseMove(ev) {
        //console.log(ev, this);
    }
}
