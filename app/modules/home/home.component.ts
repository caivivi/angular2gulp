import { Component, ViewEncapsulation } from "@angular/core";

@Component({
    selector: "app-home",
    templateUrl: "modules/home/home.component.html",
    styleUrls: ["modules/home/home.component.css"],
    encapsulation: ViewEncapsulation.Emulated
})
export class HomeComponent {
    xxx: number = 2;
    yyy: number = 2;

    constructor() { }

    clickMyButton(e: MouseEvent) {
        this.yyy = 0;
        console.log("Clicked myButton", e);
    }
}