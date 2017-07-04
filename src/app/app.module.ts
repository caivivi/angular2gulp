import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";

import { AppRoute } from "./app.router";
import { LanguageService } from "./app.service";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { SubComponent } from "./home/sub.component";

@NgModule({
    declarations: [AppComponent, HomeComponent, SubComponent],
    imports: [BrowserModule, FormsModule, HttpModule, AppRoute],
    providers: [LanguageService],
    bootstrap: [AppComponent],
    schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule {
    constructor() { }
}