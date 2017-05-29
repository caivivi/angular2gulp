import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { AppImageFilter, ImageFilterType } from "./measure.model";

export class ImageViewer {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private imageRawData: ImageData;
    private imgStream: Observable<any>;

    filter: AppImageFilter = {
        saturation: 0,
        hue: 0,
        contrast: 0
    };

     private get fullSize() {
        return [0, 0, this.canvas.width, this.canvas.height];
    }

    constructor() { }

    initialize(can: HTMLCanvasElement) {
        this.canvas = can;
        
        if (!this.canvas || !(this.canvas instanceof HTMLCanvasElement)) throw new Error("ImageViewer failed tp initialize.");
        else {// initialization
            this.context = this.canvas.getContext("2d");
        }
    }

    loadImage(url: string) {
        if (!!url) {
            this.imgStream = new Observable((subscriber) => {
                let img = new Image();
                img.onload = (e) => {
                    (<any>this.context).drawImage(img, ...this.fullSize);
                    this.imageRawData = (<any>this.context).getImageData(...this.fullSize);
                    subscriber.next();
                };

                img.src = url;
            });

            this.imgStream.subscribe();
        }
    }
}