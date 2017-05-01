import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";

import { AppComponent } from "./app.component";
import { rootRouterCocnfig } from "./app.router";
import { ListComponent } from "../list/list.component";

@NgModule({
    declarations: [AppComponent, ListComponent],
    imports: [BrowserModule, FormsModule, HttpModule, RouterModule.forRoot(rootRouterCocnfig)],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor() { }
}