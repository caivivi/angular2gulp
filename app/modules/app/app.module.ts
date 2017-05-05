import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { Routes, RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";

import { AppRoute } from "./app.router";
import { AppComponent } from "./app.component";
import { HomeComponent } from "../home/home.component";
import { DetailComponent } from "../detail/detail.component";
import { ListComponent, ImageService } from "../list/list.component";

@NgModule({
    declarations: [AppComponent, HomeComponent, DetailComponent, ListComponent],
    imports: [BrowserModule, FormsModule, HttpModule, AppRoute],
    providers: [ImageService],
    bootstrap: [AppComponent],
    schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule {
    constructor() { }
}