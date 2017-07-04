import { Inject, Injectable, OnInit } from "@angular/core";
import { Http, HttpModule, Response } from "@angular/http";

export declare type AppLanguageCode = "en-US" | "en-AU" | "es-ES" | "fr-GF" | "ja-JP" | "zh-CN" | "zh-TW";

export interface ILanguageService {
    current: AppLanguageData;
    switchLanguage(code: AppLanguageCode);
}

export interface AppLanguageData {
    code?: AppLanguageCode;
    dateFormat: string;
    data: {
        articleTitle: string;
        articleContent: string;
    }
}

@Injectable()
export class LanguageService implements ILanguageService {
    current: AppLanguageData;
    languages: AppLanguageCode[] = ["en-US", "en-AU", "es-ES", "fr-GF", "ja-JP", "zh-CN", "zh-TW"];
    private loadedLangs: Map<AppLanguageCode, AppLanguageData> = new Map();
    
    constructor(@Inject(Http) private http: Http) { }

    switchLanguage(code: AppLanguageCode = "en-US") {
        if (this.loadedLangs.has(code)) {
            this.current = this.loadedLangs.get(code);
        } else {
            this.http.get(`resources/languages/${code}.json`)
                .subscribe((response) => {
                    this.current = response.json();
                    this.current.code = code;
                    this.loadedLangs.set(code, this.current);
                });
        }
    }
}