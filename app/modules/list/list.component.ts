import { Component, OnInit, OnDestroy } from "@angular/core";
import { Http } from "@angular/http";

@Component({
    selector: "img-list",
    templateUrl: "modules/list/list.component.html",
    styleUrls: ["modules/list/list.component.css"]
})
export class ListComponent implements OnInit, OnDestroy {
    Images: Array<MSImage> = [];
    PageSize: number = 30;
    private http: Http;

    constructor(_http: Http) {
        this.http = _http;
        this.refreshImages();
    }

    async refreshImages() {
        console.log("Retrieving images from server...");
        this.Images = await this.getImagesByPage();
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
        this.http.get("modules/list/list.json").subscribe((result) => {
            this.Images = result.json();
        });
    }

    ngOnDestroy(): void {
        
    }
}

export class MSImage {
    ID: number;
    Name: string;
    Description: string;
    Data: string;//base64

    constructor() {
        this.Name = `${Math.random().toString().replace(/0\./ig, "")}.png`;
    }
}