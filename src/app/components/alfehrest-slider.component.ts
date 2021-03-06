import {Component, ElementRef, EventEmitter, Output} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";
import { NouisliderModule } from 'ng2-nouislider';


@Component({
    moduleId: module.id,
    selector: "alfehrest-slider",
    template: `
    <div class="container">
        <div class="btn-close" (click)="onCloseBtnClicked()"></div>
        <h1 class="logo"></h1>
        <div class="slider-container">
            <div class="ticks">
                <div *ngFor="let y of ticks" [innerHTML]="y"></div>
            </div>
            <nouislider 
                [config]="config" 
                [min]="14800298400000" 
                [max]="40077309600000" 
                [step]="2592000000" 
                (slide)="onSlide($event)"
                [(ngModel)]="currentValue" 
                (change)="onChange($event)"></nouislider>
        </div>
        <div class="btn-container">
            <button class="btn-year" (click)="onYearBtnClicked()">اختيار السنة</button>
        </div>
    </div>
    `,
    styles : [`
        :host {
            background-color:#00aa00;
            border-radius: 0 0 25px 0;
        }
        .container {
            display: flex;
            flex-direction: column;
            justify-content: space-between; 
        }
        .btn-container {
            height:50px;
            display: flex;
            flex-direction: row-reverse;
        }
        
        .btn-container button {
            flex-grow:2;
        }
        .btn-container .btn-year {
            border-radius: 0 0 25px 0;
            border:0;
            border-top:1px solid white;
            color:white;
            cursor: pointer;
            background-color: #00aa00;
        }

        .btn-close {
        
            position: absolute;
            left: 100%;
            top:70%;
            width: 40px;
            height: 80px;

            cursor: pointer;

            background-image: url('assets/arrow-left.png');
            box-shadow: 1px 0 3px 0 rgba(0,0,0,.85);
            background-repeat: no-repeat;
            background-position: 8px center;
            background-size: 17px 30px;
            background-color: #00aa00;
            border-radius: 0 25px 25px 0;
        }

        .slider-gone :host .btn-close {
            background-image: url('assets/arrow-right.png');
        }

        .container .logo {
            background-image: url('assets/logo.png');
        }
        
        .slider-container {
            display: flex;
            flex-direction: row;
            height:calc(100% - 200px);
            justify-content: space-around;
        }
        .ticks {
            display: flex;
            flex-direction: column-reverse;
            justify-content: space-between;
            color: white;
            font-weight: bold;
        }
        .ticks div {
            height: auto;
        }
        nouislider {
            height:95%;
        }
        :host /deep/ div {
            height:100%;
        }
        
        :host /deep/ .noUi-vertical .noUi-handle {
            right: -6px;
        }
`]
})

export class AlfehrestSliderComponent {

    @Output('close_button_clicked') private close_button_clicked:EventEmitter<void>;
    @Output('value_sliding') private value_sliding:EventEmitter<Number>;
    private config:any = {
        'orientation': 'vertical'
    };

    private yearStart:number = 700;
    private yearEnd:number = 1500;
    private ticks:number[] = [];

    private currentValue:any=14800298400000;
    private map: any = null;

    constructor(private router: Router, private route: ActivatedRoute) {

        this.close_button_clicked = new EventEmitter<void>();
        this.value_sliding = new EventEmitter<Number>();

        let diff = this.yearEnd - this.yearStart;
        let tickSize = Math.round(diff / 8);
        for(let i=0;i<8;i++) {
            this.ticks.push(this.yearStart + (i*tickSize));
        }
        this.ticks.push(this.yearEnd);
        if(this.route.snapshot.params['time']) {
            this.currentValue = parseFloat(this.route.snapshot.params['time']) * -1;
        }


    }

    private onSlide(value: any) {
        let time:number = parseFloat(value) * -1;
        this.value_sliding.emit(time);
    }
    private onChange(value: any) {
        let time:number = parseFloat(value) * -1;
        this.router.navigate(['time', time]);
    }

    private onCloseBtnClicked() {
        this.close_button_clicked.emit();
    }

    private onYearBtnClicked() {
        console.log("Not implemented");
    }
}
