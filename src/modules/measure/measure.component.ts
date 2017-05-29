import { Component, OnInit, Inject, Input } from "@angular/core";
import { LanguageService } from "../app/app.service";
import { Observable } from "rxjs/Observable";
import { AppImageFilter, ImageFilterType } from "./measure.model";
import { ImageViewer } from "./measure.service";

@Component({
    selector: "img-measure",
    templateUrl: "modules/measure/measure.component.html",
    styleUrls: ["modules/measure/measure.component.css"]
})
export class MeasureComponent implements OnInit {

    constructor(@Inject(LanguageService) private langSVC: LanguageService, @Inject(ImageViewer) private imgVWR: ImageViewer) { }

    ngOnInit() {
        this.imgVWR.initialize(<HTMLCanvasElement>document.querySelector("#canMeasure"));
        this.imgVWR.loadImage("resources/images/specimen1.jpg");
    }
}