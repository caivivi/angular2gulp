import { Component, ViewEncapsulation, Inject, OnInit, OnDestroy } from "@angular/core";
import { LanguageService, AppLanguageCode } from "../app/app.service";

@Component({
    selector: "body",
    templateUrl: "modules/app/app.component.html",
    styleUrls: ["modules/app/app.component.css"],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, OnDestroy {
    constructor(@Inject(LanguageService) private langSVC: LanguageService) { }

    ngOnInit(): void {
        this.langSVC.switchLanguage();
    }

    ngOnDestroy(): void { }
}