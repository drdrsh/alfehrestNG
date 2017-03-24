import {NgModule, ApplicationRef} from "@angular/core"
import {AppComponent} from "./app.component";

import {NouisliderModule, NouisliderComponent} from 'ng2-nouislider';

import {ModelFactoryService} from "./services/model-factory.service";
import {AlfehrestDataService} from "./services/alfehrest-data.service";
import {DateConverterService} from "./services/date-converter/date-converter.service";
import {HttpModule} from "@angular/http";
import {AlfehrestSliderComponent} from "./components/alfehrest-slider.component";
import {GoogleMapsComponent} from "./components/gm-map.component";
import {ReferencesPipe} from "./pipes/reference.pipe";
import {AlfehrestMapArea} from "./components/alfehrest-gm-area.component";
import {routes} from "./app.routing";
import {BrowserModule} from "@angular/platform-browser";
import {Route, RouterModule} from "@angular/router";
import {AlfehrestMainComponent} from "./components/alfehrest-main.component";
import {AlfehrestContentComponent} from "./components/alfehrest-content-panel";
import {AlfehrestScholarContentComponent} from "./components/content/alfehrest-scholar-content";
import {AlfehrestEventContentComponent} from "./components/content/alfehrest-event-content";
import {AlfehrestStateContentComponent} from "./components/content/alfehrest-state-content";
import {AlfehrestTabsComponent} from "./components/alfehrest-tabs.component";
import {AlfehrestMapPin} from "./components/alfehrest-gm-pin.component";
import {PublicationPipe} from "./pipes/publication.pipe";
import {AppStateService} from "./services/app-state.service";
import {HijriPipe} from "./pipes/hijri.pipe";
import {TranslateService} from "./language/translation.service";
import {TRANSLATION_PROVIDERS} from "./language/translation";


@NgModule({
    imports:      [
        BrowserModule,
        RouterModule,
        HttpModule,
        RouterModule.forRoot(routes, { useHash: false }),
    ],
    providers:    [
        TranslateService,
        TRANSLATION_PROVIDERS,
        ModelFactoryService,
        AlfehrestDataService,
        DateConverterService,
        AppStateService,
    ],
    declarations: [
        NouisliderComponent,

        AppComponent,
        AlfehrestMainComponent,
        AlfehrestContentComponent,
        AlfehrestScholarContentComponent,
        AlfehrestEventContentComponent,
        AlfehrestStateContentComponent,
        AlfehrestSliderComponent,
        AlfehrestTabsComponent,
        GoogleMapsComponent,
        AlfehrestMapArea,
        AlfehrestMapPin,
        PublicationPipe,
        ReferencesPipe,
        HijriPipe
    ],
    exports:      [],
    bootstrap:    [ AppComponent ]
})
export class AppModule {}