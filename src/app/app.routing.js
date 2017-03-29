"use strict";
var alfehrest_main_component_1 = require("./components/alfehrest-main.component");
var alfehrest_content_panel_1 = require("./components/alfehrest-content-panel");
exports.routes = [{
        path: '',
        redirectTo: 'time/-26410772271500',
        pathMatch: 'full'
    }, {
        path: 'time/:time',
        component: alfehrest_main_component_1.AlfehrestMainComponent,
        children: [{
                path: ':entityType/:id/:sid',
                component: alfehrest_content_panel_1.AlfehrestContentComponent
            }]
    }];
