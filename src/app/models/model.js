"use strict";
var Model = (function () {
    function Model(dateHelper, initialData) {
        this.dateHelper = dateHelper;
        this._isVisible = false;
        this._selected = false;
        this._entityType = "";
        this._displayData = null;
        this.internalData = initialData;
        this.readData();
    }
    Object.defineProperty(Model.prototype, "data", {
        get: function () { },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Model.prototype, "center", {
        get: function () { },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Model.prototype, "title", {
        get: function () { },
        enumerable: true,
        configurable: true
    });
    Model.prototype.getFullData = function () {
        return this.internalData;
    };
    Object.defineProperty(Model.prototype, "id", {
        get: function () {
            return this.internalData.id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Model.prototype, "activeState", {
        get: function () {
            return this._activeState;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Model.prototype, "visible", {
        get: function () {
            return this._isVisible;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Model.prototype, "entityType", {
        get: function () {
            return this._entityType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Model.prototype, "selected", {
        get: function () {
            return this._selected;
        },
        set: function (s) {
            this._selected = s;
        },
        enumerable: true,
        configurable: true
    });
    Model.prototype.get = function (property) {
        return this.getFullData()[property];
    };
    return Model;
}());
exports.Model = Model;
