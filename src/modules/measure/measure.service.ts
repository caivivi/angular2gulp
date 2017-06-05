import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";

import { ImageConfig, ImageFilterFlags, AppImageFilter, AppImageNoise, ImageFilterType, AppImageChannel, ImageChannelType, IPConsts, AppColor, RGBHistogram, Step1Result } from "./measure.model";

export class ImageViewerService {
    config: ImageConfig = new ImageConfig();
    filters: AppImageFilter = new AppImageFilter();
    noises: AppImageNoise = new AppImageNoise();
    channels: AppImageChannel = new AppImageChannel();
    histogram: RGBHistogram;

    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;

    private rawImgData: ImageData;
    private thresholdedData: ImageData;
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
            let img = new Image();

            img.onload = (e) => {
                (<any>this.context).drawImage(img, ...this.fullSize);
                this.rawImgData = this.currentImgData;
                this.thresholdedData = this.currentImgData;
                this.preProcessImage();
                this.filterImage();
            };

            img.src = url;
        }
    }

    iterateImageData(data: ImageData, action: (ir: number, ig: number, ib: number, ia: number) => any) {
        let imgArrLength = data.data.length;

        for (let ir = 0; ir < imgArrLength; ir += IPConsts.channelLength) {
            let ig = ir + 1, ib = ir + 2, ia = ir + 3;
            action(ir, ig, ib, ia);
        }
    }

    copyImageData(origin: ImageData): ImageData {
        let rawDataCopy = new Uint8ClampedArray(origin.data);
        rawDataCopy.set(origin.data);

        return new ImageData(rawDataCopy, this.canvas.width, this.canvas.height);
    }

    preProcessImage() {
        this.iterateImageData(this.thresholdedData, (ir, ig, ib, ia) => {//rgb threshold
            if (this.config.thresholdDevisor > 1) {
                this.thresholdedData.data[ir] = (this.thresholdedData.data[ir] / this.config.thresholdDevisor >> 0) * this.config.thresholdDevisor;
                this.thresholdedData.data[ig] = (this.thresholdedData.data[ig] / this.config.thresholdDevisor >> 0) * this.config.thresholdDevisor;
                this.thresholdedData.data[ib] = (this.thresholdedData.data[ib] / this.config.thresholdDevisor >> 0) * this.config.thresholdDevisor;
            }
        });

        this.histogram = RGBHistogram.fromData(this.thresholdedData);
        this.context.putImageData(this.thresholdedData, 0, 0);
        this.copiedData = this.copyImageData(this.thresholdedData);
    }

    resetImage() {
        this.filters = new AppImageFilter();
        this.channels = new AppImageChannel();
        this.noises = new AppImageNoise();
        this.context.putImageData(this.thresholdedData, 0, 0);
        this.copiedData = this.copyImageData(this.thresholdedData);
    }

    async filterImage() {
        await this.updateImageData(this.copiedData);
        
        this.context.putImageData(this.copiedData, 0, 0);
        this.copiedData = this.copyImageData(this.thresholdedData);
        
        // this.noSignal();
    }

    async updateImageData(data: ImageData) {
        let flags: ImageFilterFlags = {
            channelFlag: this.channels.alpha !== 1 || this.channels.red !== 1 || this.channels.green !== 1 || this.channels.blue !== 1,
            exposureFlag: this.filters.exposure !== 1,
            contrastFlag: this.filters.contrast !== 0,
            saturationFlag: this.filters.saturation !== 0,
            gammaFlag: this.filters.gamma !== 1,
            sharpnessFlag: this.filters.sharpness !== 0,
            gaussianFlag: this.noises.gaussian !== 0,
            imgArrLength: data.data.length,
            guassianNoiseArray: this.randomGaussion(this.config.guassianLevel),
        };

        let [redResult, greenResult, blueResult] = await Promise.all([
            this.channelStep1(data, "red", flags),
            this.channelStep1(data, "green", flags),
            this.channelStep1(data, "blue", flags),
            this.alphaStep1(data, flags)
        ]);

        await Promise.all([
            this.channelStep2(data, redResult, flags),
            this.channelStep2(data, greenResult, flags),
            this.channelStep2(data, blueResult, flags)
        ]);

        flags.gaussianFlag && this.iterateImageData(data, (ir, ig, ib, ia) => {
            let color = flags.guassianNoiseArray[Math.random() * this.config.guassianLevel >> 0];

            data.data[ir] = (data.data[ir] * (1 - this.noises.gaussian)) + (color.red * this.noises.gaussian);
            data.data[ig] = (data.data[ig] * (1 - this.noises.gaussian)) + (color.green * this.noises.gaussian);
            data.data[ib] = (data.data[ib] * (1 - this.noises.gaussian)) + (color.blue * this.noises.gaussian);
        });
    }

    async channelStep1(data: ImageData, type: ImageChannelType, flags: ImageFilterFlags): Promise<Step1Result> {
        let colorTotal = 0, channel = this.getChannelInfo(type);

        for (let [val, indexes] of channel.lookupMap) {
            if (flags.saturationFlag) {
                let saturation = val * this.filters.saturation;
                val += val >= IPConsts.middleColor ? saturation : -saturation;
            }
            flags.contrastFlag && (colorTotal += val * indexes.length);
            flags.channelFlag && (val *= channel.stepValue);
            flags.exposureFlag && (val *= this.filters.exposure);
            flags.gammaFlag && (val = Math.pow(val / IPConsts.colorLength, this.filters.gamma) * IPConsts.colorLength);
            this.filters.colorReversed && (val = IPConsts.colorLength ^ val);

            indexes.forEach((i) => data.data[i] = val);
        }

        return { channel, colorTotal };
    }

    async alphaStep1(data: ImageData, flags: ImageFilterFlags): Promise<any> {
        if (flags.channelFlag) {
            for (let [val, indexes] of this.histogram.alpha) {
                val *= this.channels.alpha;
                indexes.forEach((i) => data.data[i] = val);
            }
        }
    }

    async channelStep2(data: ImageData, result: Step1Result, flags: ImageFilterFlags): Promise<any> {
        let pixelLength = flags.imgArrLength / IPConsts.channelLength, avgColor = result.colorTotal / pixelLength >> 0;

        for (let [val, indexes] of result.channel.lookupMap) {
            if (flags.contrastFlag) {
                val = (val - avgColor) * this.filters.contrast;
                indexes.forEach((i) => data.data[i] += val);
            }
        }
    }

    getChannelInfo(type: ImageChannelType) {
        let vm = this;

        return {
            type,
            lookupMap: this.histogram[type],
            get stepValue() {
                return vm.channels[type];
            }
        };
    }

    randomGaussion(level): AppColor[] {
        let gaussians = [];

        for (var i = 0; i < level; i++) gaussians.push(AppColor.random(false));

        return gaussians;
    }

    noSignal() {
        setInterval(() => {
            let copied = this.copyImageData(this.rawImgData);
            for (let ir = 0; ir < copied.data.length; ir += IPConsts.channelLength) {
                let ig = ir + 1, ib = ir + 2, ia = ir + 3, color = AppColor.random(false);

                copied.data[ir] = color.red;
                copied.data[ig] = color.green;
                copied.data[ib] = color.blue;
            }

            this.context.putImageData(copied, 0, 0);
        }, 20);
    }
}