import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { MeasureComponent } from "./measure.component";
import { MeasureRoute } from "./measure.router";
import { ImageViewerService } from "./measure.service";
import { FilterDirective } from "./measure.directive";

@NgModule({
    imports: [CommonModule, FormsModule, MeasureRoute],
    declarations: [MeasureComponent, FilterDirective],
    providers: [ImageViewerService]
})
export class MeasureModule {
    constructor() { }
}