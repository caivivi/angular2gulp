import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ViewerComponent } from "./viewer.component";
import { ViewerRoute } from "./viewer.router";
import { ViewerService } from "./viewer.service";

@NgModule({
    imports: [CommonModule, ViewerRoute],
    declarations: [ViewerComponent],
    providers: [ViewerService]
})
export class ViewerModule {
    constructor() { }
}