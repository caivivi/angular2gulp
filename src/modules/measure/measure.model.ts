export type ImageFilterType = "saturation" | "hue" | "contrast" | "gamma" | "sharpness";
export type ImageChannelType = "red" | "green" | "blue" | "alpha";

export interface AppImageFilter {
    saturation: number;
    hue: number;
    contrast: number;
    gamma: number;
    sharpness: number;
}

export interface AppImageChannel {
    red,
    green,
    blue,
    alpha
}