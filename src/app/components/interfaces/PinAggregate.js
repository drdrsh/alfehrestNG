"use strict";
var PinAggregate = (function () {
    function PinAggregate() {
        this.latitude = 0;
        this.longitude = 0;
        this.title = "";
        this.pins = [];
        this.types = [];
        this.typeHashmap = {};
    }
    PinAggregate.fromModelArray = function (models) {
        var hashmap = {};
        for (var _i = 0, models_1 = models; _i < models_1.length; _i++) {
            var m = models_1[_i];
            var locId = m.center.latitude + "_" + m.center.longitude;
            if (!(locId in hashmap)) {
                hashmap[locId] = new PinAggregate();
                hashmap[locId].name = m.center.name;
                hashmap[locId].longitude = m.center.longitude;
                hashmap[locId].latitude = m.center.latitude;
            }
            hashmap[locId].typeHashmap[m.entityType] = true;
            hashmap[locId].pins.push(m);
        }
        var ret = [];
        for (var idx in hashmap) {
            hashmap[idx].types = Object.keys(hashmap[idx].typeHashmap);
            ret.push(hashmap[idx]);
        }
        return ret;
    };
    return PinAggregate;
}());
exports.PinAggregate = PinAggregate;
