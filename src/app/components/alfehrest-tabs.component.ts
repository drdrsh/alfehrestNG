import {Component, ElementRef, EventEmitter, Output, Input, ViewChild} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";

@Component({
    moduleId: module.id,
    selector: "alfehrest-tabs",
    template: `
        <ul class="tabs" simplescroll>
            <li
                *ngFor="let sect of data.sections" 
                class="{{sect.cls}}"
                [ngClass]="{'active': (sect.cls === activeTab)}"
                (click)="onTabClicked($event)">
            </li>
        </ul>
        <div
            *ngFor="let item of data.sections" 
            [ngSwitch]="item.type" 
            class="tab-body {{item.cls}}" [ngClass]="{'active': item.cls === activeTab}">
                <div>
                    <h3 *ngIf="item.title">{{item.title}}</h3>
                    <h4 *ngIf="item.subtitle">{{item.subtitle}}</h4>
                    <p *ngSwitchCase="'text'">{{item.content}}</p>
                    <ol *ngSwitchCase="'list'">
                        <li *ngFor="let ref of item.content" [innerHTML]="ref | references"></li>
                    </ol>
                    <ol *ngSwitchCase="'bib'">
                        <li *ngFor="let ref of item.content" [innerHTML]="ref | publication"></li>
                    </ol>
                    <ol *ngSwitchCase="'entity'" class="entity">
                        <li *ngFor="let ref of item.content">   
                                <a [routerLink]="['/time/' + currentTime + '/' + ref.entityType + '/' + ref.id + '/' + ref.subid]">{{ref.title}}</a>    
                        </li>
                    </ol>
                </div>
        </div>
    `,
    styles : [`
        :host {
            display: flex;   
            height: 100%;
            width: 100%;
        }
        
        
        ol {
            margin-top:0;
            list-style-type: arabic-indic;
            color:black;
        }
        
        ol.entity {
            margin-top: 5px;
        }
        
        ul.tabs {
            position: relative;
            list-style: none;
            margin: 0;
            padding: 0;
            z-index: 5;
            background-color: #00aa00;
        }
        
        .tabs li {
            display: block;
            cursor: pointer;
            background-color: #00aa00;
            background-position: center center;
            background-repeat: no-repeat;
            background-size: 35px 35px;
            width: 50px;
            height: 50px;
            z-index: 55;             
        }

        .tabs li.active {
            background-color: white;
            z-index: 0;
            border-right:0;
        }

        li.pin { background-image: url('assets/pin.png'); }
        li.event { background-image: url('assets/event.png'); }
        li.state { background-image: url('assets/state.png'); }
        li.ruler { background-image: url('assets/crown.png'); }
        li.scholar { background-image: url('assets/scholar.png'); }
        li.publications { background-image: url('assets/publications.png'); }
        li.achievements { background-image: url('assets/achievements.png'); }
        li.references { background-image: url('assets/references.png'); }

        li.pin.active { background-image: url('assets/pin-invert.png'); }
        li.event.active { background-image: url('assets/event-invert.png'); }
        li.state.active  { background-image: url('assets/state-invert.png'); }
        li.ruler.active  { background-image: url('assets/crown-invert.png'); }
        li.scholar.active { background-image: url('assets/scholar-invert.png'); }
        li.publications.active { background-image: url('assets/publications-invert.png'); }
        li.achievements.active { background-image: url('assets/achievements-invert.png'); }
        li.references.active { background-image: url('assets/references-invert.png'); }


        .tab-body {
            box-shadow: -4px 0 5px -2px #444;
            background-color: white;
            flex-grow: 1;
            z-index: 0;
            display:none;
            overflow-y:scroll;
        }
        
        .tab-body.active {
            display: block;
        }
        
        p {
            color:black;
            padding: 10px;
            margin:0;
            box-sizing: content-box;
        }
        
        h3 {
            margin:0;
            padding:5px;
            color:black;
        }
        h4 {
            margin:0;
            padding:5px;
            color:green;
        }
    `]
})

export class AlfehrestTabsComponent {

    @Input('data') data: any = null;

    private activeTab:string = null;

    private scrolling:boolean = false;
    private scrollTimeout = null;
    private currentTime:string = "";

    constructor(private route: ActivatedRoute) {

    }
    ngOnChanges(changes) {
        this.currentTime = this.route.snapshot.parent.params['time'];
        console.log(this.route.snapshot);
        if(changes.data && !changes.data.previousValue.sections && this.data) {
            this.activeTab = this.data.sections[0].cls;
        }
    }

    ngOnInit() {
    }

    onTabClicked(ev:any) {
        this.activeTab = ev.target.classList[0];
    }
    /*
    onScroll() {
        this.scrolling = true;
        clearTimeout(this.scrollTimeout);
        this.scrollTimeout = setTimeout(() => this.scrolling = false, 1500);
    }
    */

}
