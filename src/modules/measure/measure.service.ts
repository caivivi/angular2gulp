import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";

import { AppImageFilter, ImageFilterType, AppImageChannel, ImageChannelType } from "./measure.model";

export class ImageViewerService {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private imageRawData: ImageData;
    private imgStream: Observable<any>;
    private channel: AppImageChannel = {
        red: 100,
        green: 100,
        blue: 100,
        alpha: 100
    };
    filterOptions: AppImageFilter = {
        saturation: 0,
        hue: 0,
        contrast: 0,
        gamma: 1,
        sharpness: 0
    };

    private get fullSize() {
        return [0, 0, this.canvas.width, this.canvas.height];
    }
    private get currentData(): ImageData {
        return !!this.context ? (<any>this.context).getImageData(...this.fullSize) : null;
    }

    constructor() { }

    initialize(can: HTMLCanvasElement): void {
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

    filterImage(type: ImageFilterType) {

    }

    channelImage(type: ImageChannelType) {

    }

    reverseColor() {
        let data = this.currentData;
        
        for (let i = 0; i < data.data.length; i++) (i + 1) % 4 && (data.data[i] = 255 - data.data[i]);
        this.context.putImageData(data, 0, 0);
    }
}