import { Component } from "@angular/core";

@Component({
    selector: "my-list",
    templateUrl: "modules/list/list.component.html"
})
/**
 * List Component
 */
export class ListComponent {
    xxx: number;
    yyy: number;

    constructor() {
        this.xxx = 1;
        this.yyy = 2;
    }

    clickMyButton (e) {
        console.log("myButton clicked!", this.xxx, this.yyy);
        console.log("click event", e);
    }
}