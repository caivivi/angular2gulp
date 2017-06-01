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
                    this.filterImage();
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

    async filterImage(type: ImageFilterType = null) {
        await this.rgbProcess(this.copiedData);
        this.context.putImageData(this.copiedData, 0, 0);
        this.copiedData = this.copyImageData(this.rawImgData);
    }

    async rgbProcess(data: ImageData) {
        let channelFlag = this.channels.alpha !== 1 || this.channels.red !== 1 || this.channels.green !== 1 || this.channels.blue !== 1;
        let brightnessFlag = this.filters.brightness !== 1, contrastFlag = this.filters.contrast !== 0, saturationFlag = this.filters.saturation !== 0;
        let avgFlag = contrastFlag, gammaFlag = this.filters.gamma !== 1;
        let ir = 0, imgArrLength = data.data.length, colorLength = 255, middleColor = 128, channelLength = 4, avgR = 0, avgG = 0, avgB = 0;

        for (ir = 0; ir < imgArrLength; ir += channelLength) {
            let ig = ir + 1, ib = ir + 2, ia = ir + 3;
            
            if (channelFlag) {//channel
                data.data[ir] *= this.channels.red;
                data.data[ig] *= this.channels.green;
                data.data[ib] *= this.channels.blue;
                data.data[ia] *= this.channels.alpha;
            }
            if (avgFlag) {
                avgR += data.data[ir];
                avgG += data.data[ig];
                avgB += data.data[ib];
            }
            if (brightnessFlag) {//brightness
                data.data[ir] *= this.filters.brightness;
                data.data[ig] *= this.filters.brightness;
                data.data[ib] *= this.filters.brightness;
            }
            if (gammaFlag) {
                data.data[ir] = Math.pow(data.data[ir] / colorLength, this.filters.gamma) * colorLength;
                data.data[ig] = Math.pow(data.data[ig] / colorLength, this.filters.gamma) * colorLength;
                data.data[ib] = Math.pow(data.data[ib] / colorLength, this.filters.gamma) * colorLength;
            }
            if (saturationFlag) {//saturation
                let rs = data.data[ir] * this.filters.saturation, gs = data.data[ig] * this.filters.saturation, bs = data.data[ib] * this.filters.saturation;
                data.data[ir] += data.data[ir] >= middleColor ? rs : -rs;
                data.data[ig] += data.data[ig] >= middleColor ? gs : -gs;
                data.data[ib] += data.data[ib] >= middleColor ? bs : -bs;
            }
            if (this.filters.colorReversed) {//color reverse
                data.data[ir] = colorLength ^ data.data[ir];
                data.data[ig] = colorLength ^ data.data[ig];
                data.data[ib] = colorLength ^ data.data[ib];
            }
        }

        if (contrastFlag) {//contrast
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