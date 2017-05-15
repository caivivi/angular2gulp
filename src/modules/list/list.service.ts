import { Inject, Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";

export interface IImageService {
    getImages();
}

@Injectable()
export class ImageService implements IImageService {
    constructor(@Inject(Http) private http: Http) { }

    getImages() {
        return this.http.get("modules/list/list.json");
    }
}