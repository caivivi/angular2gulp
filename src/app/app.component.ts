import { Component, ViewEncapsulation, Inject, OnInit, OnDestroy } from "@angular/core";
import { LanguageService, AppLanguageCode } from "./app.service";

@Component({
    selector: "body",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, OnDestroy {
    constructor(@Inject(LanguageService) private langSVC: LanguageService) { }

    ngOnInit(): void {
        this.langSVC.switchLanguage();
    }

    ngOnDestroy(): void { }
}