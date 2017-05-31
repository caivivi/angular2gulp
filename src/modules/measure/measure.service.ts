import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";

import { AppImageFilter, ImageFilterType, AppImageChannel, ImageChannelType } from "./measure.model";

export class ImageViewerService {
    filters = new AppImageFilter();
    channels = new AppImageChannel();

    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private imgStream: Observable<any>;

    private rawImgData: ImageData;
    private copiedData: ImageData;
    private get currentImgData(): ImageData {
        return this.context ? (<any>this.context).getImageData(...this.fullSize) : null;
    }
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
                    this.copiedData = this.copyImageData(this.rawImgData);
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

    resetImage() {
        this.filters = new AppImageFilter();
        this.channels = new AppImageChannel();
        this.context.putImageData(this.rawImgData, 0, 0);
        this.copiedData = this.copyImageData(this.rawImgData);
    }

    filterImage(type: ImageFilterType) {
        this.rgbProcess(this.copiedData);
        this.context.putImageData(this.copiedData, 0, 0);
        this.copiedData = this.copyImageData(this.rawImgData);
    }

    rgbProcess(data: ImageData) {
        let channelFlag = this.channels.alpha !== 1 || this.channels.red !== 1 || this.channels.green !== 1 || this.channels.blue !== 1;
        let brightnessFlag = this.filters.brightness !== 1, contrastFlag = this.filters.contrast !== 0, colorAdjustment = brightnessFlag || contrastFlag;
        let imgArrLength = data.data.length, colorLength = 255, channelLength = 4, avgR = 0, avgG = 0, avgB = 0;

        for (var ir = 0; ir < imgArrLength; ir += channelLength) {
            let ig = ir + 1, ib = ir + 2, ia = ir + 3;
            
            if (channelFlag) {//channel
                data.data[ir] *= this.channels.red;
                data.data[ig] *= this.channels.green;
                data.data[ib] *= this.channels.blue;
                data.data[ia] *= this.channels.alpha;
            }
            if (colorAdjustment) {
                avgR += data.data[ir];
                avgG += data.data[ig];
                avgB += data.data[ib];

                if (brightnessFlag) {//brightness
                    data.data[ir] *= this.filters.brightness;
                    data.data[ig] *= this.filters.brightness;
                    data.data[ib] *= this.filters.brightness;
                }
            }
            if (this.filters.colorReversed) {//color reverse
                data.data[ir] = colorLength ^ data.data[ir];
                data.data[ig] = colorLength ^ data.data[ig];
                data.data[ib] = colorLength ^ data.data[ib];
            }
        }

        if (colorAdjustment) {//contrast
            const pixelLength = ir / channelLength;

            avgR /= pixelLength;
            avgG /= pixelLength;
            avgB /= pixelLength;

            for (ir = 0; ir < imgArrLength; ir += channelLength) {
                let ig = ir + 1, ib = ir + 2;
                let diffR = data.data[ir] - avgR, diffG = data.data[ig] - avgG, diffB = data.data[ib] - avgB;

                data.data[ir] += diffR * this.filters.contrast;
                data.data[ig] += diffG * this.filters.contrast;
                data.data[ib] += diffB * this.filters.contrast;
            }
        }
    }
}