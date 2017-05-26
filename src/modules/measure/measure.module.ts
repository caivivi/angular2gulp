import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { MeasureComponent } from "./measure.component";
import { MeasureRoute } from "./measure.router";

@NgModule({
    imports: [CommonModule, FormsModule, MeasureRoute],
    declarations: [MeasureComponent],
    providers: []
})
export class MeasureModule {
    constructor() { }
}