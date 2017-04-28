import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
//import { FormsModule } from "@angular/forms";
//import { HttpModule } from "@angular/http";

import { AppComponent } from "./app.component";
import { rootRouterCocnfig } from "./app.router";
import { ListComponent } from "../list/list.component";

@NgModule({
    declarations: [AppComponent, ListComponent],
    imports: [BrowserModule, RouterModule.forRoot(rootRouterCocnfig)],//FormsModule, HttpModule
    providers: [],
    bootstrap: [AppComponent]
})
/**
 * AppModule
 */
export class AppModule {
    constructor() { }
}