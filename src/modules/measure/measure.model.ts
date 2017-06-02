export type ImageFilterType = "saturation" | "hue" | "contrast" | "gamma" | "brightness" | "sharpness" | null;
export type ImageChannelType = "red" | "green" | "blue" | "alpha" | null;

export class AppImageFilter {
    saturation: number = 0;
    hue: number = 0;
    contrast: number = 0;
    gamma: number = 1;
    exposure: number = 1;

    sharpness: number = 0;
    blur: number = 0;
    
    edgeDetect: boolean = false;
    colorReversed: boolean = false;
}

export class AppImageNoise {
    gaussian: number = 0;
    saltpepper: number = 0;
}

export class AppImageChannel {
    red: number = 1;
    green: number = 1;
    blue: number = 1;
    alpha: number = 1;
}

export class AppColor {
    constructor(public red: number = IPConsts.colorLength, public green: number = IPConsts.colorLength, public blue: number = IPConsts.colorLength, public alpha: number = IPConsts.colorLength) { }

    static random(colorful = true) {
        let color = new AppColor();

        if (colorful) {
            color.red = Math.random() * IPConsts.colorLength >> 0;
            color.green = Math.random() * IPConsts.colorLength >> 0;
            color.blue = Math.random() * IPConsts.colorLength >> 0;
        } else {
            let depth = Math.random() * IPConsts.colorLength >> 0;
            color.blue = color.green = color.red = depth;
        }
        

        return color;
    }
}

export class IPConsts {
    static readonly colorLength: number = 255;
    static readonly middleColor: number = 128;
    static readonly channelLength: number = 4;
    static readonly convolutionList: ReadonlyMap<string, Convolution> = new Map([
        ["sharpness", { type: "sharpness", matrix: [0, -2, 0, -2, 11, -2, 0, -2, 0] }],
        ["blur", { type: "blur", matrix: [1, 2, 1, 2, 4, 2, 1, 2, 1] }],
        ["edge", { type: "edge", matrix: [1, 1, 1, 1, -7, 1, 1, 1, 1] }]
    ]);
}

export interface Convolution {
    type: string;
    matrix: number[];
}