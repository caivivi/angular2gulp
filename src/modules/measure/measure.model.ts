export type ImageFilterType = "saturation" | "hue" | "contrast";
export type ImageChannelType = "red" | "green" | "blue" | "alpha";

export interface AppImageFilter {
    saturation: number;
    hue: number;
    contrast: number;
}

export interface AppImageChannel {
    red,
    green,
    blue,
    alpha
}