import { Component, ViewEncapsulation, Input, OnChanges, SimpleChanges, OnInit, EventEmitter } from "@angular/core";

@Component({
    selector: "app-home",
    templateUrl: "modules/home/home.component.html",
    styleUrls: ["modules/home/home.component.css"],
    encapsulation: ViewEncapsulation.Emulated
})
export class HomeComponent implements OnInit, OnChanges {
    @Input("xxx") xxx: number = 2;
    @Input("yyy") yyy: number = 2;
    @Input("zzz") zzz = new ZZZ();

    constructor() { }

    clickMyButton(e: MouseEvent) {
        this.yyy = 0;
        this.zzz = new ZZZ();

        setTimeout(() => this.zzz = new ZZZ(), 1000);
    }

    ngOnInit() { }

    ngOnChanges(changes: SimpleChanges) {
        console.log("Change detected on home component:", changes);
    }
}

class ZZZ {
    id: number = Math.random();
    constructor() { }
}