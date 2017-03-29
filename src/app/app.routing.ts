import {AppComponent} from "./app.component";
import {Route, RouterModule} from "@angular/router";
import {ModuleWithProviders} from "@angular/core";
import {AlfehrestMainComponent} from "./components/alfehrest-main.component";
import {AlfehrestContentComponent} from "./components/alfehrest-content-panel";

export const routes:Route[]= [{
        path: '',
        redirectTo: 'time/-26410772271500',
        pathMatch: 'full'
    },{
        path: 'time/:time',
        component: AlfehrestMainComponent,
        children: [{
            path: 'agg',
            component: AlfehrestContentComponent
        }, {
            path: ':entityType/:id/:sid',
            component: AlfehrestContentComponent
        }]
}];
