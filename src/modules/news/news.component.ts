import { Injectable, Inject, Component, OnInit, OnDestroy } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { LanguageService, AppLanguageCode } from "../app/app.service";
import 'rxjs/add/operator/publish';

@Component({
    selector: "app-news",
    templateUrl: "modules/news/news.component.html",
    styleUrls: ["modules/news/news.component.css"]
})
export class NewsComponent implements OnInit, OnDestroy {
    selectedLang: AppLanguageCode = "en-US";

    constructor(@Inject(LanguageService) private langSVC: LanguageService) { }

    switchLanguage() {
        this.langSVC.switchLanguage(this.selectedLang);
    }

    ngOnInit(): void { }

    ngOnDestroy(): void { }
}