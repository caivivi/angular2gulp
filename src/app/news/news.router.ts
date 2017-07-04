import { Routes, RouterModule } from "@angular/router";
import { NewsComponent } from "./news.component";

const newsRouterConfig: Routes = [
    {
        path: "",
        component: NewsComponent
    }
];

export const newsRoute = RouterModule.forChild(newsRouterConfig);