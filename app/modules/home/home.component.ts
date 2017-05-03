import { Component } from "@angular/core";

@Component({
    selector: "app-home",
    templateUrl: "modules/home/home.component.html"
})
export class HomeComponent {
    xxx: number = 1;
    yyy: number = 2;

    constructor() { }

    clickMyButton(e: MouseEvent) {
        this.yyy = 0;
        console.log("Clicked myButton", e);
    }
}