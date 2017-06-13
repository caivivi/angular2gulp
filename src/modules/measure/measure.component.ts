import { Component, OnInit, Inject, Input, ViewEncapsulation } from "@angular/core";
import { LanguageService } from "../app/app.service";
import { Observable } from "rxjs/Observable";
import { AppImageFilter, ImageFilterType } from "./measure.model";
import { ImageViewerService } from "./measure.service";

@Component({
    selector: "img-measure",
    templateUrl: "modules/measure/measure.component.html",
    styleUrls: ["modules/measure/measure.component.css"],
    encapsulation: ViewEncapsulation.None
})
export class MeasureComponent implements OnInit {
    selectedImage: string;
    images: string[] = [
        "resources/images/specimen1.jpg",
        "resources/images/specimen2.jpg",
        "resources/images/specimen3.jpg",
        "resources/images/worm1.jpg",
        "resources/images/spider.jpg",
        "resources/images/butterfly.jpg",
        "resources/images/mm1.jpg",
        "http://upload.wikimedia.org/wikipedia/commons/8/8a/Museum_Boerhaave_-_Specimen_by_Brugmans.jpg"
    ];

    constructor(
        @Inject(LanguageService) private langSVC: LanguageService,
        @Inject(ImageViewerService) private viewer: ImageViewerService
    ) { }

    ngOnInit() {
        this.viewer.initialize(<HTMLCanvasElement>document.querySelector("#canMeasure"));
        this.selectedImage = this.images[0];
        this.viewer.loadImage(this.selectedImage);
    }
}