import {Component} from '@angular/core';
import {AlfehrestDataService} from './services/alfehrest-data.service'
import {TranslateService} from "./language/translation.service";

@Component({
    moduleId: module.id,
    selector: 'app-root',
    template: `<router-outlet></router-outlet>`,
    styleUrls: ['app.component.css']
})

export class AppComponent {

    title = 'app works!';

    constructor(
        private dataService:AlfehrestDataService,
        private translateService:TranslateService) {
        translateService.use('ar');
    }

    ngOnInit() {


    }

    onMapReady(map: any) {
        this.dataService.loadInitialData().subscribe(
            data => console.log(data),
            err => console.error(err),
            () => console.log('Authentication Complete')
        );
    }

}
