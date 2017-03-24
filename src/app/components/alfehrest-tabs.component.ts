import {Component, ElementRef, EventEmitter, Output, Input, ViewChild} from "@angular/core";
import {Router} from "@angular/router";

@Component({
    moduleId: module.id,
    selector: "alfehrest-tabs",
    template: `
        <div class="content-body" #contentBody>
            <ul class="tabs">
                <li 
                    *ngFor="let item of data.sections" 
                    [innerHTML]="item.cls" 
                    class="{{item.cls}}"
                    [ngClass]="{'active': item.cls === activeTab}"
                    (click)="onTabClicked($event)">
                </li>
            </ul>
            <div
                *ngFor="let item of data.sections" 
                [ngSwitch]="item.type" 
                class="tab-body {{item.cls}}" [ngClass]="{'active': item.cls === activeTab}">
                    <p *ngSwitchCase="'text'" [innerHTML]="item.content"></p>
                    <ol *ngSwitchCase="'list'">
                        <li *ngFor="let ref of item.content" [innerHTML]="ref | references"></li>
                    </ol>
                    <ol *ngSwitchCase="'bib'">
                        <li *ngFor="let ref of item.content" [innerHTML]="ref | publication"></li>
                    </ol>
            </div>
        </div>
    `,
    styles : [`
        .content-body {
            display: flex;   
            height: 100%;
            width: 100%;
        }
        .content-body ul {
           position: relative;
            list-style: none;
            margin: 0;
            padding: 0;
            margin-right: 5px;
            z-index: 5;
        }
        
        .content-body li {
            padding:5px;
        }

        .content-body li.active {
            border-right:0;
            background-color: white;
            z-index: 0;
            width: 101%;
        }
        
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
        }
    `]
})

export class AlfehrestTabsComponent {

    @Input('data') data: any = null;
    @ViewChild('contentBody') domContentBody:ElementRef;

    private activeTab:string = null;

    ngOnChanges(changes) {
        //This is an initial load
        if(changes.data && !changes.data.previousValue.sections && this.data) {
            this.activeTab = this.data.sections[0].cls;
        }
    }

    ngOnInit() {
    }

    onTabClicked(ev:any) {
        this.activeTab = ev.target.classList[0];
    }

}
