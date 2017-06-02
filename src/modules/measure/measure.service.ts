import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";

import { AppImageFilter, ImageFilterType, AppImageChannel, ImageChannelType, IPConsts, Convolution } from "./measure.model";

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
        let exposureFlag = this.filters.exposure !== 1, contrastFlag = this.filters.contrast !== 0, saturationFlag = this.filters.saturation !== 0;
        let avgFlag = contrastFlag, gammaFlag = this.filters.gamma !== 1;
        let sharpnessFlag = this.filters.sharpness !== 0;
        let ir = 0, avgR = 0, avgG = 0, avgB = 0, imgArrLength = data.data.length;

        let matrixArr: Convolution[] = [];
        sharpnessFlag && matrixArr.push(IPConsts.convolutionList.get("sharpness"));

        for (ir = 0; ir < imgArrLength; ir += IPConsts.channelLength) {
            let ig = ir + 1, ib = ir + 2, ia = ir + 3;
            
            if (channelFlag) {//channel
                data.data[ir] *= this.channels.red;
                data.data[ig] *= this.channels.green;
                data.data[ib] *= this.channels.blue;
                data.data[ia] *= this.channels.alpha;
            }
            if (avgFlag) {//
                avgR += data.data[ir];
                avgG += data.data[ig];
                avgB += data.data[ib];
            }
            if (exposureFlag) {//exposure
                data.data[ir] *= this.filters.exposure;
                data.data[ig] *= this.filters.exposure;
                data.data[ib] *= this.filters.exposure;
            }
            if (gammaFlag) {//gamma
                data.data[ir] = Math.pow(data.data[ir] / IPConsts.colorLength, this.filters.gamma) * IPConsts.colorLength;
                data.data[ig] = Math.pow(data.data[ig] / IPConsts.colorLength, this.filters.gamma) * IPConsts.colorLength;
                data.data[ib] = Math.pow(data.data[ib] / IPConsts.colorLength, this.filters.gamma) * IPConsts.colorLength;
            }
            if (saturationFlag) {//saturation
                let rs = data.data[ir] * this.filters.saturation, gs = data.data[ig] * this.filters.saturation, bs = data.data[ib] * this.filters.saturation;
                data.data[ir] += data.data[ir] >= IPConsts.middleColor ? rs : -rs;
                data.data[ig] += data.data[ig] >= IPConsts.middleColor ? gs : -gs;
                data.data[ib] += data.data[ib] >= IPConsts.middleColor ? bs : -bs;
            }
            if (this.filters.colorReversed) {//color reverse
                data.data[ir] = IPConsts.colorLength ^ data.data[ir];
                data.data[ig] = IPConsts.colorLength ^ data.data[ig];
                data.data[ib] = IPConsts.colorLength ^ data.data[ib];
            }
            !!matrixArr.length && this.matrixProcess(ir, matrixArr);//matrix processing such as sharpness, blur, edge and so on.
        }

        if (contrastFlag) {//contrast
            const pixelLength = ir / IPConsts.channelLength;

            avgR /= pixelLength;
            avgG /= pixelLength;
            avgB /= pixelLength;

            for (ir = 0; ir < imgArrLength; ir += IPConsts.channelLength) {
                let ig = ir + 1, ib = ir + 2;
                let diffR = data.data[ir] - avgR, diffG = data.data[ig] - avgG, diffB = data.data[ib] - avgB;

                data.data[ir] += diffR * this.filters.contrast;
                data.data[ig] += diffG * this.filters.contrast;
                data.data[ib] += diffB * this.filters.contrast;
            }
        }
    }

    matrixProcess(index: number = 0, arrMatrix: Convolution[]) {
        
    }
}