export type ImageFilterType = "saturation" | "hue" | "contrast" | "gamma" | "brightness" | "sharpness";
export type ImageChannelType = "red" | "green" | "blue" | "alpha";

export interface AppImageFilter {
    saturation: number;
    hue: number;
    contrast: number;
    gamma: number;
    brightness: number;
    sharpness: number;
    colorReversed?: boolean;
}

export interface AppImageChannel {
    red,
    green,
    blue,
    alpha
}