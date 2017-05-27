import { Component, OnInit, OnDestroy, Inject, DoCheck, OnChanges, SimpleChanges, Input } from "@angular/core";
import { LanguageService } from "../app/app.service";
import { Observable } from "rxjs/Observable";
import { AppImageFilter } from "./measure.model";

@Component({
    selector: "img-measure",
    templateUrl: "modules/measure/measure.component.html",
    styleUrls: ["modules/measure/measure.component.css"]
})
export class MeasureComponent implements OnInit {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    imgStream: Observable<any>;
    imgFilter: AppImageFilter = {
        saturation: 10,
        hue: 20,
        contrast: 30
    };
    saturation: number = 10;
    hue: number = 20;
    contrast: number = 30;

    constructor(@Inject(LanguageService) private langSVC: LanguageService) { }

    ngOnInit() {
        this.canvas = <HTMLCanvasElement>document.querySelector("#canMeasure");
        this.context = this.canvas.getContext("2d");
        this.loadImage("resources/images/specimen1.jpg");
    }

    ngOnChanges(changes: SimpleChanges) {
        console.log("on change triggered", changes);
        for (var field in changes) {
            let change = changes[field];
            
            switch (field) {
                case "imgFilter": this.filterImage(); break;
                default: console.log("model changed", field); break;
            }
        }
    }

    loadImage(url: string) {
        if (!!url) {
            this.imgStream = new Observable((subscriber) => {
                let img = new Image();
                img.onload = (e) => {
                    this.context.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
                    subscriber.next();
                };

                img.src = url;
            });

            this.imgStream.subscribe();
        }
    }

    filterImage(filter: string = "") {
        console.log("filter value", this.imgFilter);
    }

    textFunc(e) {
        
    }
}