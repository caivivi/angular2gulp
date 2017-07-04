import { Component, OnInit, Inject, ViewEncapsulation } from "@angular/core";
import { ViewerService } from "./viewer.service";

@Component({
    templateUrl: "app/viewer/viewer.component.html",
    styleUrls: ["app/viewer/viewer.component.css", "styles/leaflet.css"],
    encapsulation: ViewEncapsulation.None
})
export class ViewerComponent implements OnInit {
    constructor(@Inject(ViewerService) public vwrSVC: ViewerService) { }

    ngOnInit() {
        this.vwrSVC.loadViewer("imgView");
    }

    clearAnnotations() {
        this.vwrSVC.clearAnnotations();
    }
}