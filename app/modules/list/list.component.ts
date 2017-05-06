import { Component, OnInit, OnDestroy, Inject, Injectable } from "@angular/core";
import { Http, Response, Jsonp } from "@angular/http";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';

@Injectable()
export class ImageService {
    constructor(
        @Inject(Http) public http: Http
    ) { }

    getImages() {
        //return [new MSImage(), new MSImage(), new MSImage(), new MSImage()];
        return this.http.get("modules/list/list.json");
    }
}

@Component({
    selector: "img-list",
    templateUrl: "modules/list/list.component.html",
    styleUrls: ["modules/list/list.component.css"],
    providers: [ImageService]
})
@Injectable()
export class ListComponent implements OnInit, OnDestroy {
    Images: MSImage[] = [];
    PageSize: number = 30;

    constructor(
        @Inject(ImageService) private imgSVC: ImageService
    ) { }

    async refreshImages() {
        console.log("Retrieving images from server...");
        this.imgSVC.getImages()
            .map((result) => result.json())
            .subscribe(result => {
                this.Images = result;
            });
        console.log(`${this.Images.length} images retrieved.`, this.Images);
    }

    async getImagesByPage() {
        return await new Promise<Array<MSImage>>((resolve, reject) => {
            setTimeout(() => {
                let imgs: Array<MSImage> = [];

                for (var i = 0; i < this.PageSize; i++) {
                    imgs.push(new MSImage());
                }

                resolve(imgs);
            }, 1000);
        });
    }

    ngOnInit(): void {
        console.log("list component init...");
        this.refreshImages();
    }

    ngOnDestroy(): void {
        console.log("Destorying ListComponent...");
    }
}

export class MSImage {
    ID: number;
    Name: string;
    Description: string;
    Data: string;

    constructor() {
        this.Name = `${Math.random().toString().replace(/0\./ig, "")}.png`;
    }
}