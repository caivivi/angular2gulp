import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ListRoute } from "./list.router";
import { ListComponent } from "./list.component";
import { ImageService } from "./list.service";

@NgModule({
    imports: [CommonModule, ListRoute],
    declarations: [ListComponent],
    providers: [ImageService]
})
export class ListModule {
    constructor() { }
}