"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var reference_pipe_1 = require("./reference.pipe");
var CryptoJS = require("crypto-js");
var PublicationPipe = (function () {
    function PublicationPipe() {
    }
    PublicationPipe.prototype.transform = function (value) {
        var refPipe = new reference_pipe_1.ReferencesPipe();
        var isFromIdeo = false;
        var tabContent = "";
        if (value.title.length == 0) {
            return;
        }
        if (value.ideo_id == 0) {
            return refPipe.transform(value.title);
        }
        isFromIdeo = true;
        var h = CryptoJS.SHA256("work" + value.ideo_id);
        var hash = h.toString(CryptoJS.enc.Hex);
        var url = 'http://experiments.alfehrest.org/public/alkindi/?id=work_' + hash.substr(0, 13);
        return "<a target='_blank' href='" + url + "'>" + value.title + "</a>";
    };
    PublicationPipe = __decorate([
        core_1.Pipe({ name: 'publication' })
    ], PublicationPipe);
    return PublicationPipe;
}());
exports.PublicationPipe = PublicationPipe;
