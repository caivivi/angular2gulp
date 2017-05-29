import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { MeasureComponent } from "./measure.component";
import { MeasureRoute } from "./measure.router";
import { ImageViewer } from "./measure.service";

@NgModule({
    imports: [CommonModule, FormsModule, MeasureRoute],
    declarations: [MeasureComponent],
    providers: [ImageViewer]
})
export class MeasureModule {
    constructor() { }
}