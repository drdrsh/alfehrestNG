import {
    Component, ElementRef, EventEmitter, Output, ChangeDetectorRef, style, state, animate,
    transition, trigger
} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";
import {AlfehrestDataService} from "../services/alfehrest-data.service";
import {Model} from "../models/model";


@Component({
    moduleId: module.id,
    selector: "alfehrest-side-panel",
    template: `
        <ul>
            <li class='about'>عن الفهرست</li>
            <li class='search'>بحث</li>
            <li class='settings'>الإعدادت</li>
            <li class='help'>مساعدة</li>
            <li class='facebook'>صفحتنا على الفيسبوك</li>
            <li class='twitter'>حسابنا على تويتر</li>
            <li class='report'>الإبلاغ عن خطأ</li>
        </ul>    
    `,
    styles : [`
        :host {
            overflow-x: hidden;
            overflow-y: auto;
            color: #fff;
            background-color: #333;
            background-image:url('assets/logo.png');
            background-size:65px 65px;
            background-position:50% 95%;
            background-repeat:no-repeat;
            padding: 0;
            margin: 0;
        }
        
         ul{
            margin:0;
            padding:0;
        }
        
        li {
            cursor:pointer;
            background-repeat:no-repeat;
            background-position:5% 50%;
            background-size:30px 30px;
            text-indent:5px;
            display: block;
            margin: 0;
            line-height: 48px;
            border-top: 1px solid #4d4d4d;
            border-bottom: 1px solid #1a1a1a;
        }

        li.facebook{
            background-image:url('assets/facebook.png');
        }
        li.twitter{
            background-image:url('assets/twitter.png');
        }
        li.about{
            background-image:url('assets/about.png');
        }
        li.settings{
            background-image:url('assets/settings.png');
        }
        li.report{
            background-image:url('assets/report.png');
        }
        li.help{
            background-image:url('assets/help.png');
        }
        li.search{
            background-image:url('assets/search.png');
        }

        
    `]
})
export class AlfehrestSidePanelComponent {

}
