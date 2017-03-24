///<reference path="../../../typings/modules/crypto-js/index.d.ts" />

import {Http, Headers, Response} from "@angular/http";
import {Injectable, Inject, EventEmitter, Output} from "@angular/core";
import {Observable} from "rxjs/Rx";
import 'rxjs/add/operator/map';
import {DateConverterService} from "./date-converter/date-converter.service";
import {ModelFactoryService} from "./model-factory.service";
import {Model} from "../models/model";
import * as CryptoJS from "crypto-js";
import {environment} from "../environment"

@Injectable()
export class AlfehrestDataService {

    @Output() initial_data_loaded:EventEmitter<any>;
    @Output() entity_data_loaded:EventEmitter<Model>;
    @Output() entity_data_loading:EventEmitter<Model>;
    @Output() active_period_changed:EventEmitter<Model[]>;

    private pendingUpdate:any = null;
    private apiVersion:number = environment.apiVersion;
    private language:string = 'ar';
    private entities:string[] = null;
    private data:any = {};
    private cache:any = {};
    private visibleEntities = [];
    private initialDataLoaded:boolean = false;

    constructor(
        private http: Http,
        private modelFactory:ModelFactoryService
    ) {
        this.initial_data_loaded = new EventEmitter<any>();
        this.active_period_changed = new EventEmitter<Model[]>();
        this.entity_data_loaded = new EventEmitter<Model>();
        this.entity_data_loading = new EventEmitter<Model>();
        this.entities = modelFactory.getActiveEntities();

        for(let e of this.entities){
            this.cache[e] = {};
            this.data[e] = {};
            this.visibleEntities[e] = [];
        }
    }

    private getRequestHeaders(url:string) {

        //http://alfehrest.org/scholars/:application/vnd.alfehrest.org+json;version=2:ar:1489457892;
        //2f0cdc1de4fe6afc3dc5f06243f1487568f67831

        let headers = new Headers();

        let secretKey = environment.apiKeyP1;
        let requestInfo = [
            url,
            "application/vnd.alfehrest.org+json;version=" + this.apiVersion,
            this.language,
            Math.floor(Date.now() / 1000)
        ];
        let reqData = requestInfo.join(":");
        let sign = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA1(reqData, secretKey));
        let authHead =
            environment.apiKeyP2 + ':' +
            requestInfo[3] + ":" + sign;

        headers.append('Accept', 'application/vnd.alfehrest.org+json;version=' + this.apiVersion);
        headers.append('Accept-Language', this.language);
        headers.append("Authorization", authHead);

        return headers;
    }

    private onEntityError(err:any) {

    }

    private prepareEntityData(type:string, id:number, subid:number, value:any) {
        let target = this.data[type][id];
        target.updateFromPartial(subid, value);
        return target;
    }

    private onEntityLoaded(type:string, id:number, subid:number, value:any) {
        this.entity_data_loaded.emit(this.prepareEntityData(type, id, subid, value));
    }

    loadEntityData(type:string, id:number, subid:number) : EventEmitter<any> {
        let localTypeId = type;
        let apiTypeId = environment.localToApiLookup[type];

        if(!this.initialDataLoaded) {
            /*
            Our caller expects an observable, the problem is that this method might be called very early when we have
            no initialData yet, so we set up an observable that waits for initial data to arrive and then serves the
            requested data afterwards
             */
            let subInitial = this.initial_data_loaded.subscribe(() => {
                subInitial.unsubscribe();
                let subSecond = this.entity_data_loaded.subscribe( (loadedEntity) => {
                    subSecond.unsubscribe();
                    this.entity_data_loaded.emit(loadedEntity);
                });
                this.loadEntityData(type, id, subid);
            });
            return;
        }

        //Cache hit? Return a "Quick" observable
        let target = this.data[localTypeId][id];
        this.entity_data_loading.emit(target);

        if(id in this.cache[localTypeId] && subid in this.cache[localTypeId][id]) {
            setTimeout(() => {
                let loadedEntity = this.prepareEntityData(localTypeId, id, subid, this.cache[localTypeId][id][subid]);
                this.entity_data_loaded.emit(loadedEntity);
            }, 100);
            return;
        }

        let requests = [];
        let url = environment.apiURL + apiTypeId + '/' + id + '/';
        if(subid) {
            url += "?rid=" + subid;
        }
        let headers = this.getRequestHeaders(url);
        setTimeout(() => {
            let sub = this.http.get(url, {headers: headers}).map(res => res.json())
                .subscribe(data => {
                    sub.unsubscribe();
                    if (!(id in this.cache[localTypeId])) {
                        this.cache[type][id] = {};
                    }
                    if (!(subid in this.cache[localTypeId][id])) {
                        this.cache[localTypeId][id][subid] = {};
                    }
                    this.cache[localTypeId][id][subid] = data;
                    let value = this.prepareEntityData(localTypeId, id, subid, data);
                    this.entity_data_loaded.emit(value);
                }, error => {
                    sub.unsubscribe();
                    console.log(error);
                });
        }, 0);
    }

    loadInitialData() {

        let requests = [];
        let rootUrl = environment.apiURL;
        for(let i:number=0;i<this.entities.length; i++) {
            let localTypeId = this.entities[i];
            let apiTypeId = environment.localToApiLookup[localTypeId];
            let fullUrl = rootUrl + apiTypeId + '/';
            let headers = this.getRequestHeaders(fullUrl);
            let req = this.http
                .get(fullUrl, {headers: headers})
                .map((res:Response) => {
                    let data = res.json();
                    this.initialDataLoaded = true;
                    let constructor = this.modelFactory.getConstructor(localTypeId);
                    for(let idx in data) {
                        this.data[localTypeId][idx] = constructor.fromInitial(data[idx]);
                    }
                });
            requests.push(req);
        }

        Observable.forkJoin.apply(null, requests)
        .subscribe(
            data => {
                this.initial_data_loaded.emit(this.data);
                this.initial_data_loaded.complete();
            },
            err => console.error(err)
        );

        return this.initial_data_loaded ;
    }

    updateActivePeriod(currentTime:Date) {

        if(!this.initialDataLoaded) {
            if(this.pendingUpdate) {
                this.pendingUpdate.unsubscribe();
            }
            this.pendingUpdate = this.initial_data_loaded.subscribe(() => {
                this.pendingUpdate.unsubscribe();
                this.updateActivePeriod(currentTime);
            });
            return;
        }

        for(let entity of this.entities ) {
            this.visibleEntities[entity] = [];
            for(let idx1 of Object.keys(this.data[entity])) {
                let model = this.data[entity][idx1];
                model.updateActiveState(currentTime);
                if(model.visible) {
                    this.visibleEntities[entity].push(model);
                }

            }
        }

        this.active_period_changed.emit(this.visibleEntities);

    }
}
