import { Inject, Injectable, OnInit } from "@angular/core";
import { Http, HttpModule, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';

export declare type AppLanguageCode = "en-US" | "en-AU" | "es-ES" | "fr-GF" | "ja-JP" | "zh-CN" | "zh-TW";

export interface ILanguageService {
    current: AppLanguageData;
    switchLanguage(code: AppLanguageCode);
}

export interface AppLanguageData {
    data: {
        articleTitle: string;
        articleContent: string;
    }
}

@Injectable()
export class LanguageService implements ILanguageService {
    current: AppLanguageData;
    languages: AppLanguageCode[] = ["en-US", "en-AU", "es-ES", "fr-GF", "ja-JP", "zh-CN", "zh-TW"];
    constructor(@Inject(Http) private http: Http) { }

    switchLanguage(code: AppLanguageCode = "en-US") {
        this.http.get(`resources/languages/${code}.json`)
            .map<Response, AppLanguageData>((response) => response.json())
            .subscribe((lang) => {
                this.current = lang;
                console.log("Application language has switched into:", code, lang);
            });
    }
}