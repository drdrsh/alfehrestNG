"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var state_1 = require("../models/state");
var event_1 = require("../models/event");
var scholar_1 = require("../models/scholar");
var ModelFactoryService = (function () {
    function ModelFactoryService() {
        this.objectMap = null;
        this.objectMap = {
            'state': state_1.StateModel,
            'scholar': scholar_1.ScholarModel,
            'event': event_1.EventModel
        };
    }
    ModelFactoryService.prototype.getActiveEntities = function () {
        return Object.keys(this.objectMap);
    };
    ModelFactoryService.prototype.getConstructor = function (name) {
        return this.objectMap[name];
    };
    ModelFactoryService.prototype.getInstance = function (name) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var instance = Object.create(this.objectMap[name].prototype);
        instance.constructor.apply(instance, args);
        return instance;
    };
    ModelFactoryService = __decorate([
        core_1.Injectable()
    ], ModelFactoryService);
    return ModelFactoryService;
}());
exports.ModelFactoryService = ModelFactoryService;
