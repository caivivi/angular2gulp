import { Component, OnInit, Inject, Input } from "@angular/core";
import { LanguageService } from "../app/app.service";
import { Observable } from "rxjs/Observable";
import { AppImageFilter, ImageFilterType } from "./measure.model";
import { ImageViewerService } from "./measure.service";

@Component({
    selector: "img-measure",
    templateUrl: "modules/measure/measure.component.html",
    styleUrls: ["modules/measure/measure.component.css"]
})
export class MeasureComponent implements OnInit {
    constructor(
        @Inject(LanguageService) private langSVC: LanguageService,
        @Inject(ImageViewerService) private viewer: ImageViewerService
    ) { }

    ngOnInit() {
        this.viewer.initialize(<HTMLCanvasElement>document.querySelector("#canMeasure"));
        this.viewer.loadImage("resources/images/specimen1.jpg");
    }
}