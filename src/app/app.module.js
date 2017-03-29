"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var core_1 = require("@angular/core");
var app_component_1 = require("./app.component");
var ng2_nouislider_1 = require('ng2-nouislider');
var model_factory_service_1 = require("./services/model-factory.service");
var alfehrest_data_service_1 = require("./services/alfehrest-data.service");
var date_converter_service_1 = require("./services/date-converter/date-converter.service");
var http_1 = require("@angular/http");
var alfehrest_slider_component_1 = require("./components/alfehrest-slider.component");
var gm_map_component_1 = require("./components/gm-map.component");
var reference_pipe_1 = require("./pipes/reference.pipe");
var alfehrest_gm_area_component_1 = require("./components/alfehrest-gm-area.component");
var app_routing_1 = require("./app.routing");
var platform_browser_1 = require("@angular/platform-browser");
var router_1 = require("@angular/router");
var alfehrest_main_component_1 = require("./components/alfehrest-main.component");
var alfehrest_content_panel_1 = require("./components/alfehrest-content-panel");
var alfehrest_scholar_content_1 = require("./components/content/alfehrest-scholar-content");
var alfehrest_event_content_1 = require("./components/content/alfehrest-event-content");
var alfehrest_state_content_1 = require("./components/content/alfehrest-state-content");
var alfehrest_tabs_component_1 = require("./components/alfehrest-tabs.component");
var alfehrest_gm_pin_component_1 = require("./components/alfehrest-gm-pin.component");
var publication_pipe_1 = require("./pipes/publication.pipe");
var app_state_service_1 = require("./services/app-state.service");
var hijri_pipe_1 = require("./pipes/hijri.pipe");
var translation_service_1 = require("./language/translation.service");
var translation_1 = require("./language/translation");
var alfehrest_bottom_pane_1 = require("./components/alfehrest-bottom-pane");
var alfehrest_side_panel_1 = require("./components/alfehrest-side-panel");
var index_1 = require("ng2-slimscroll/index");
console.log(SimpleBar);
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [
                platform_browser_1.BrowserModule,
                router_1.RouterModule,
                http_1.HttpModule,
                index_1.SlimScrollModule,
                router_1.RouterModule.forRoot(app_routing_1.routes, { useHash: false }),
            ],
            providers: [
                translation_service_1.TranslateService,
                translation_1.TRANSLATION_PROVIDERS,
                model_factory_service_1.ModelFactoryService,
                alfehrest_data_service_1.AlfehrestDataService,
                date_converter_service_1.DateConverterService,
                app_state_service_1.AppStateService,
            ],
            declarations: [
                ng2_nouislider_1.NouisliderComponent,
                app_component_1.AppComponent,
                alfehrest_main_component_1.AlfehrestMainComponent,
                alfehrest_side_panel_1.AlfehrestSidePanelComponent,
                alfehrest_bottom_pane_1.AlfehrestBottomPanelComponent,
                alfehrest_slider_component_1.AlfehrestSliderComponent,
                alfehrest_content_panel_1.AlfehrestContentComponent,
                alfehrest_scholar_content_1.AlfehrestScholarContentComponent,
                alfehrest_event_content_1.AlfehrestEventContentComponent,
                alfehrest_state_content_1.AlfehrestStateContentComponent,
                alfehrest_tabs_component_1.AlfehrestTabsComponent,
                gm_map_component_1.GoogleMapsComponent,
                alfehrest_gm_area_component_1.AlfehrestMapArea,
                alfehrest_gm_pin_component_1.AlfehrestMapPin,
                publication_pipe_1.PublicationPipe,
                reference_pipe_1.ReferencesPipe,
                hijri_pipe_1.HijriPipe
            ],
            exports: [],
            bootstrap: [app_component_1.AppComponent]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
var ScrollModule = (function () {
    function ScrollModule() {
    }
    ScrollModule = __decorate([
        core_1.NgModule({
            imports: [
                platform_browser_1.BrowserModule,
            ],
            providers: [],
            declarations: [],
            exports: [],
            bootstrap: []
        })
    ], ScrollModule);
    return ScrollModule;
}());
exports.ScrollModule = ScrollModule;
var ScrollDirective = (function () {
    function ScrollDirective(viewContainer, renderer) {
        this.viewContainer = viewContainer;
        this.renderer = renderer;
        if (typeof window === 'undefined') {
            return;
        }
        this.viewContainer = viewContainer;
        this.el = viewContainer.element.nativeElement;
    }
    ScrollDirective.prototype.ngOnInit = function () {
        if (typeof window === 'undefined') {
            return;
        }
        console.log('hello');
    };
    ScrollDirective = __decorate([
        core_1.Directive({
            selector: '[simplescroll]',
            exportAs: 'simplescroll'
        }),
        __param(0, core_1.Inject(core_1.ViewContainerRef)),
        __param(1, core_1.Inject(core_1.Renderer))
    ], ScrollDirective);
    return ScrollDirective;
}());
exports.ScrollDirective = ScrollDirective;
