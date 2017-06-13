import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { newsRoute } from "./news.router";
import { NewsComponent } from "./news.component";

@NgModule({
    imports: [FormsModule, CommonModule, newsRoute],
    declarations: [NewsComponent],
    providers: []
})
export class NewsModule {
    constructor() { }
}