import {Component, ElementRef, Output, EventEmitter, Input, Inject, NgZone} from "@angular/core";
import {AlfehrestDataService} from "../services/alfehrest-data.service";
import {StateModel} from "../models/state";
import {Router, ActivatedRoute} from "@angular/router";
import {PinAggregate} from "./interfaces/PinAggregate";
import {Model} from "../models/model";
import {MapOverlayLabelGen} from "../models/MapOverlayLabel"

@Component({
    moduleId: module.id,
    selector: "alfehrest-gm-pin",
    template: ''
})
export class AlfehrestMapPin {

    @Input('pin') public pin:PinAggregate;

    private marker:any;
    private label:any;


    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private dataStore:AlfehrestDataService,
        private zone:NgZone,
        @Inject('MAPS') private map: any,
        @Inject('GOOGLE') private google: any) {
    }

    ngDoCheck() {
    }

    ngOnInit() {
        this.render();
    }

    ngOnDestroy() {
        this.destory();
    }


    private destory() {
        if(this.marker) {
            this.marker.setMap( null );
            this.marker = null;
        }
        if(this.label) {
            this.label.setMap( null );
            this.label = null;
        }
    }

    private render() {

        let google = this.google;
        let map = this.map;

        let overlayGen = new MapOverlayLabelGen(this.zone, this.google);

        let count = this.pin.pins.length;
        let types = this.pin.types;
        let title = this.pin.title;
        let lng = this.pin.longitude;
        let lat = this.pin.latitude;
        let imageURL = "assets/";

        if(count == 1) {
            let imageNameParts = [];
            imageNameParts.push(types[0]);
            imageNameParts.push('marker');
            if(this.pin.pins[0].get('type')) {
                imageNameParts.push(this.pin.pins[0].get('type'));
            }
            imageURL += imageNameParts.join('-') + '.png';
        } else {
            imageURL += types.join('-') + '-marker.png';
        }
        this.marker =
            new google.maps.Marker({
                position: new google.maps.LatLng(lat, lng),
                map: map,
                title: title,
                icon: {
                    url: imageURL,
                    size: new google.maps.Size(96, 96),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(18, 38),
                    scaledSize: new google.maps.Size(36, 36)
                }
            });
        google.maps.event.addListener(
            this.marker,
            'click',
            this.z(this.onClick)
        );

        if(count > 1) {
            this.label = overlayGen.generate({map: map});
            this.label.set('zIndex', 1234);
            this.label.bindTo('position', this.marker, 'position');
            this.label.set('text', count);
        }
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
        google.maps.event.trigger(this.map, 'pin_clicked', this.pin);
        let t = parseFloat(this.route.snapshot.params['time']);
        let t1 = t + 1;
        if(this.pin.pins.length == 1) {
            this.router.navigate(['time', t1], { skipLocationChange: true });
            this.router.navigate([
                'time', this.route.snapshot.params['time'],
                this.pin.pins[0].entityType, this.pin.pins[0].id, 0
            ]);
        } else {
            this.dataStore.selectedAggregate = this.pin;
            let q = {};
            q['x' + Math.round(Math.random()* 100)] = 1;
            this.router.navigate(['time', this.route.snapshot.params['time'], 'agg'], {queryParams: q});
        }
    }


    private onMouseMove(ev) {
        //console.log(ev, this);
    }
}
