import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";

import { AppImageFilter, ImageFilterType, AppImageChannel, ImageChannelType } from "./measure.model";

export class ImageViewerService {
    filters: AppImageFilter = {
        saturation: 0,
        hue: 1,
        contrast: 0,
        gamma: 0,
        brightness: 1,
        sharpness: 1,
        colorReversed: false
    };
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private imgStream: Observable<any>;

    private rawImgData: ImageData;
    private get currentImgData(): ImageData {
        return this.context ? (<any>this.context).getImageData(...this.fullSize) : null;
    }
    private channels: AppImageChannel = {
        red: 1,
        green: 1,
        blue: 1,
        alpha: 1
    };
    
    private get fullSize() {
        return [0, 0, this.canvas.width, this.canvas.height];
    }

    constructor() { }

    initialize(can: HTMLCanvasElement): void {
        this.canvas = can;

        if (!this.canvas || !(this.canvas instanceof HTMLCanvasElement)) throw new Error("ImageViewer failed tp initialize.");
        else {
            this.context = this.canvas.getContext("2d");
        }
    }

    loadImage(url: string) {
        if (!!url) {
            this.imgStream = new Observable((subscriber) => {
                let img = new Image();
                img.onload = (e) => {
                    (<any>this.context).drawImage(img, ...this.fullSize);
                    this.rawImgData = this.currentImgData;
                    subscriber.next();
                };

                img.src = url;
            });

            this.imgStream.subscribe();
        }
    }

    copyImageData(origin: ImageData): ImageData {
        let rawDataCopy = new Uint8ClampedArray(origin.data);
        rawDataCopy.set(origin.data);

        return new ImageData(rawDataCopy, this.canvas.width, this.canvas.height);
    }

    async filterImage(type: ImageFilterType) {
        let copy = this.copyImageData(this.rawImgData);

        (this.channels.alpha !== 1 || this.channels.red !== 1 || this.channels.green !== 1 || this.channels.blue !== 1) && this.channel(copy);
        this.filters.colorReversed && this.reverseColor(copy);
        this.filters.brightness !== 1 && this.brightness(copy);
        this.filters.saturation !== 1 && this.saturate(copy);

        this.context.putImageData(copy, 0, 0);
    }

    reverseColor(data: ImageData) {
        for (let i = 0; i < data.data.length; i++) (i + 1) % 4 && (data.data[i] = 255 - data.data[i]);
    }

    channel (data: ImageData) {
        for (let i = 0; i < data.data.length; i += 4) {
            data.data[i] *= this.channels.red;
            data.data[i + 1] *= this.channels.green;
            data.data[i + 2] *= this.channels.blue;
            data.data[i + 3] *= this.channels.alpha;
        }
    }

    brightness(data: ImageData) {
        for (let i = 0; i < data.data.length; i += 4) {
            data.data[i] *= (this.filters.brightness);
            data.data[i + 1] *= this.filters.brightness;
            data.data[i + 2] *= this.filters.brightness;
        }
    }

    saturate(data: ImageData) {
        // for (let i = 0; i < data.data.length; i += 4) {
        //     let r = data.data[i], g = data.data[i + 1], b = data.data[i + 2];
        //     let hue = (r * 299 + g * 587 + b * 114) / 3000;
        //     data.data[i] += (r - hue) * 100 * this.filters.hue / 255;
        //     data.data[i + 1] += (g - hue) * 100 * this.filters.hue / 255;
        //     data.data[i + 2] += (b - hue) * 100 * this.filters.hue / 255;
        // }
    }
}