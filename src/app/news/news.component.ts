import { Injectable, Inject, Component, OnInit } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { LanguageService, AppLanguageCode } from "../app.service";
import "rxjs/add/observable/timer";

@Component({
    selector: "app-news",
    templateUrl: "./news.component.html",
    styleUrls: ["./news.component.css"]
})
export class NewsComponent implements OnInit {
    date: Date = new Date();
    selectedLang: AppLanguageCode = "en-US";

    constructor(@Inject(LanguageService) private langSVC: LanguageService) { }

    switchLanguage() {
        this.langSVC.switchLanguage(this.selectedLang);
    }

    ngOnInit(): void {
        Observable.timer(1000, 1000).subscribe((time) => this.date = new Date());
    }
}