export type ImageFilterType = "saturation" | "hue" | "contrast" | "gamma" | "brightness" | "sharpness";
export type ImageChannelType = "red" | "green" | "blue" | "alpha";

export class AppImageFilter {
    saturation: number = 1;
    hue: number = 1;
    contrast: number = 0;
    gamma: number = 1;
    brightness: number = 1;
    sharpness: number = 1;
    colorReversed: boolean = false;
}

export class AppImageChannel {
    red: number = 1;
    green: number = 1;
    blue: number = 1;
    alpha: number = 1;
}