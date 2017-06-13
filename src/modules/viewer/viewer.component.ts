import { Component, OnInit, Inject } from "@angular/core";
import { ViewerService } from "./viewer.service";

@Component({
    templateUrl: "modules/viewer/viewer.component.html",
    styleUrls: ["modules/viewer/viewer.component.css"]
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