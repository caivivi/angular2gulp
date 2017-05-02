import { Component } from "@angular/core";

@Component({
    selector: "img-list",
    templateUrl: "modules/list/list.component.html",
    styleUrls: ["modules/list/list.component.css"]
})
export class ListComponent {
    Images: Array<MSImage> = [];
    PageSize: number = 30;

    constructor() {
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
}

export class MSImage {
    Name: string;
    Description: string;
    Data: string;//base64

    constructor() {
        this.Name = `${Math.random().toString().replace(/0\./ig, "")}.png`;
    }
}