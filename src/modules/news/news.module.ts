import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { newsRoute } from "./news.router";
import { NewsComponent } from "./news.component";

@NgModule({
    imports: [FormsModule, CommonModule, newsRoute],
    declarations: [NewsComponent],
    providers: [],
    schemas: [NO_ERRORS_SCHEMA]
})
export class NewsModule {
    constructor() { }
}