///<reference path="../../../typings/modules/crypto-js/index.d.ts" />
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var http_1 = require("@angular/http");
var core_1 = require("@angular/core");
var Rx_1 = require("rxjs/Rx");
require('rxjs/add/operator/map');
var CryptoJS = require("crypto-js");
var environment_1 = require("../environment");
var AlfehrestDataService = (function () {
    function AlfehrestDataService(http, modelFactory) {
        this.http = http;
        this.modelFactory = modelFactory;
        this.pendingUpdate = null;
        this.apiVersion = environment_1.environment.apiVersion;
        this.language = 'ar';
        this.entities = null;
        this.data = {};
        this.cache = {};
        this.visibleEntities = [];
        this.initialDataLoaded = false;
        this.initial_data_loaded = new core_1.EventEmitter();
        this.active_period_changed = new core_1.EventEmitter();
        this.entity_data_loaded = new core_1.EventEmitter();
        this.entity_data_loading = new core_1.EventEmitter();
        this.entities = modelFactory.getActiveEntities();
        for (var _i = 0, _a = this.entities; _i < _a.length; _i++) {
            var e = _a[_i];
            this.cache[e] = {};
            this.data[e] = {};
            this.visibleEntities[e] = [];
        }
    }
    AlfehrestDataService.prototype.getRequestHeaders = function (url) {
        //http://alfehrest.org/scholars/:application/vnd.alfehrest.org+json;version=2:ar:1489457892;
        //2f0cdc1de4fe6afc3dc5f06243f1487568f67831
        var headers = new http_1.Headers();
        var secretKey = environment_1.environment.apiKeyP1;
        var requestInfo = [
            url,
            "application/vnd.alfehrest.org+json;version=" + this.apiVersion,
            this.language,
            Math.floor(Date.now() / 1000)
        ];
        var reqData = requestInfo.join(":");
        var sign = CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA1(reqData, secretKey));
        var authHead = environment_1.environment.apiKeyP2 + ':' +
            requestInfo[3] + ":" + sign;
        headers.append('Accept', 'application/vnd.alfehrest.org+json;version=' + this.apiVersion);
        headers.append('Accept-Language', this.language);
        headers.append("Authorization", authHead);
        return headers;
    };
    AlfehrestDataService.prototype.onEntityError = function (err) {
    };
    AlfehrestDataService.prototype.prepareEntityData = function (type, id, subid, value) {
        var target = this.data[type][id];
        target.updateFromPartial(subid, value);
        return target;
    };
    AlfehrestDataService.prototype.onEntityLoaded = function (type, id, subid, value) {
        this.entity_data_loaded.emit(this.prepareEntityData(type, id, subid, value));
    };
    AlfehrestDataService.prototype.loadEntityData = function (type, id, subid) {
        var _this = this;
        var localTypeId = type;
        var apiTypeId = environment_1.environment.localToApiLookup[type];
        if (!this.initialDataLoaded) {
            /*
            Our caller expects an observable, the problem is that this method might be called very early when we have
            no initialData yet, so we set up an observable that waits for initial data to arrive and then serves the
            requested data afterwards
             */
            var subInitial_1 = this.initial_data_loaded.subscribe(function () {
                subInitial_1.unsubscribe();
                var subSecond = _this.entity_data_loaded.subscribe(function (loadedEntity) {
                    subSecond.unsubscribe();
                    _this.entity_data_loaded.emit(loadedEntity);
                });
                _this.loadEntityData(type, id, subid);
            });
            return;
        }
        //Cache hit? Return a "Quick" observable
        var target = this.data[localTypeId][id];
        this.entity_data_loading.emit(target);
        if (id in this.cache[localTypeId] && subid in this.cache[localTypeId][id]) {
            setTimeout(function () {
                var loadedEntity = _this.prepareEntityData(localTypeId, id, subid, _this.cache[localTypeId][id][subid]);
                _this.entity_data_loaded.emit(loadedEntity);
            }, 100);
            return;
        }
        var requests = [];
        var url = environment_1.environment.apiURL + apiTypeId + '/' + id + '/';
        if (subid) {
            url += "?rid=" + subid;
        }
        var headers = this.getRequestHeaders(url);
        setTimeout(function () {
            var sub = _this.http.get(url, { headers: headers }).map(function (res) { return res.json(); })
                .subscribe(function (data) {
                sub.unsubscribe();
                if (!(id in _this.cache[localTypeId])) {
                    _this.cache[type][id] = {};
                }
                if (!(subid in _this.cache[localTypeId][id])) {
                    _this.cache[localTypeId][id][subid] = {};
                }
                _this.cache[localTypeId][id][subid] = data;
                var value = _this.prepareEntityData(localTypeId, id, subid, data);
                _this.entity_data_loaded.emit(value);
            }, function (error) {
                sub.unsubscribe();
                console.log(error);
            });
        }, 0);
    };
    AlfehrestDataService.prototype.loadInitialData = function () {
        var _this = this;
        var requests = [];
        var rootUrl = environment_1.environment.apiURL;
        var _loop_1 = function(i) {
            var localTypeId = this_1.entities[i];
            var apiTypeId = environment_1.environment.localToApiLookup[localTypeId];
            var fullUrl = rootUrl + apiTypeId + '/';
            var headers = this_1.getRequestHeaders(fullUrl);
            var req = this_1.http
                .get(fullUrl, { headers: headers })
                .map(function (res) {
                var data = res.json();
                _this.initialDataLoaded = true;
                var constructor = _this.modelFactory.getConstructor(localTypeId);
                for (var idx in data) {
                    _this.data[localTypeId][idx] = constructor.fromInitial(data[idx]);
                }
            });
            requests.push(req);
        };
        var this_1 = this;
        for (var i = 0; i < this.entities.length; i++) {
            _loop_1(i);
        }
        Rx_1.Observable.forkJoin.apply(null, requests)
            .subscribe(function (data) {
            _this.initial_data_loaded.emit(_this.data);
            _this.initial_data_loaded.complete();
        }, function (err) { return console.error(err); });
        return this.initial_data_loaded;
    };
    AlfehrestDataService.prototype.updateActivePeriod = function (currentTime) {
        var _this = this;
        if (!this.initialDataLoaded) {
            if (this.pendingUpdate) {
                this.pendingUpdate.unsubscribe();
            }
            this.pendingUpdate = this.initial_data_loaded.subscribe(function () {
                _this.pendingUpdate.unsubscribe();
                _this.updateActivePeriod(currentTime);
            });
            return;
        }
        for (var _i = 0, _a = this.entities; _i < _a.length; _i++) {
            var entity = _a[_i];
            this.visibleEntities[entity] = [];
            for (var _b = 0, _c = Object.keys(this.data[entity]); _b < _c.length; _b++) {
                var idx1 = _c[_b];
                var model = this.data[entity][idx1];
                model.updateActiveState(currentTime);
                if (model.visible) {
                    this.visibleEntities[entity].push(model);
                }
            }
        }
        this.active_period_changed.emit(this.visibleEntities);
    };
    __decorate([
        core_1.Output()
    ], AlfehrestDataService.prototype, "initial_data_loaded");
    __decorate([
        core_1.Output()
    ], AlfehrestDataService.prototype, "entity_data_loaded");
    __decorate([
        core_1.Output()
    ], AlfehrestDataService.prototype, "entity_data_loading");
    __decorate([
        core_1.Output()
    ], AlfehrestDataService.prototype, "active_period_changed");
    AlfehrestDataService = __decorate([
        core_1.Injectable()
    ], AlfehrestDataService);
    return AlfehrestDataService;
}());
exports.AlfehrestDataService = AlfehrestDataService;
