import { Component, OnInit, OnDestroy, Inject, Injectable } from "@angular/core";
import { Response } from "@angular/http";
import { ImageService } from "./list.service";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';

@Injectable()
@Component({
    selector: "img-list",
    templateUrl: "modules/list/list.component.html",
    styleUrls: ["modules/list/list.component.css"],
    providers: [ImageService]
})
export class ListComponent implements OnInit, OnDestroy {
    Images: MSImage[] = [];
    PageSize: number = 30;

    constructor(@Inject(ImageService) private imgSVC: ImageService) { }

    async refreshImages() {
        console.log("Retrieving images from server...");
        this.imgSVC.getImages()
            .map<Response, MSImage[]>((result) => result.json())
            .subscribe(data => {
                this.Images = data;
                console.log(`${data.length} images retrieved.`);
            });
    }

    ngOnInit(): void {
        console.log("Initiating list component...");
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
}