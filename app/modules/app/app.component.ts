import { Component, ViewEncapsulation } from "@angular/core";

@Component({
    selector: "body",
    templateUrl: "modules/app/app.component.html",
    styleUrls: ["modules/app/app.component.css"],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent {
    constructor() { }
}