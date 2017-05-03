import { NgModule } from "@angular/core";
import { ListRoute } from "./list.router";
import { ListComponent } from "./list.component";

@NgModule({
    imports: [ListRoute],
    declarations: [ListComponent]
})
export class ListModule {
    constructor() { }
}