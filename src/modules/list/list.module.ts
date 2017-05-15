import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ListRoute } from "./list.router";
import { ListComponent } from "./list.component";

@NgModule({
    imports: [CommonModule, ListRoute],
    declarations: [ListComponent]
})
export class ListModule {
    constructor() { }
}