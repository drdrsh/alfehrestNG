
import {NgModule, ApplicationRef, Renderer, OnInit, Directive, ViewContainerRef, Inject} from "@angular/core"
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
import {AlfehrestBottomPanelComponent} from "./components/alfehrest-bottom-pane";
import {AlfehrestSidePanelComponent} from "./components/alfehrest-side-panel";
import {SlimScrollModule} from "ng2-slimscroll/index";



@NgModule({
    imports:      [
        BrowserModule,
        RouterModule,
        HttpModule,
        SlimScrollModule,
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
        AlfehrestSidePanelComponent,
        AlfehrestBottomPanelComponent,
        AlfehrestSliderComponent,
        AlfehrestContentComponent,
        AlfehrestScholarContentComponent,
        AlfehrestEventContentComponent,
        AlfehrestStateContentComponent,
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


@NgModule({
    imports:      [
        BrowserModule,
    ],
    providers:    [],
    declarations: [
    ],
    exports:      [],
    bootstrap:    []
})
export class ScrollModule {}


@Directive({
    selector: '[simplescroll]',
    exportAs: 'simplescroll'
})
export class ScrollDirective implements OnInit {

    el: HTMLElement;
    wrapper: HTMLElement;
    grid: HTMLElement;
    bar: HTMLElement;
    body: HTMLElement;
    pageY: number;
    top: number;
    dragging: boolean;
    mutationThrottleTimeout: number;
    mutationObserver: MutationObserver;
    lastTouchPositionY: number;

    constructor(
        @Inject(ViewContainerRef) private viewContainer: ViewContainerRef,
        @Inject(Renderer) private renderer: Renderer) {
        if (typeof window === 'undefined') { return; }
        this.viewContainer = viewContainer;
        this.el = viewContainer.element.nativeElement;
    }

    ngOnInit() {
        if (typeof window === 'undefined') { return; }
        console.log('hello');
    }


}