import { Component, ViewEncapsulation, Input, OnInit, EventEmitter } from "@angular/core";

@Component({
    selector: "app-home",
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.css"],
    encapsulation: ViewEncapsulation.Emulated
})
export class HomeComponent implements OnInit {
    @Input("xxx") number1: number = 2;
    @Input("yyy") number2: number = 2;

    constructor() { }

    ngOnInit() { }

    randomNumber(e: MouseEvent) {
        this.number1 = parseInt((Math.random() * 100).toFixed(0));
        this.number2 = parseInt((Math.random() * 100).toFixed(0));
    }
}