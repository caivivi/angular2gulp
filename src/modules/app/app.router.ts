import { Routes, RouterModule } from "@angular/router";

import { HomeComponent } from "../home/home.component";

const rootRouterCocnfig: Routes = [
    {
        path: "",
        pathMatch: 'full',
        redirectTo: "home"
    },
    // {
    //     path: "**",
    //     component: HomeComponent
    // },
    {
        path: "home",
        component: HomeComponent
    },
    {
        path: "list",
        loadChildren: "modules/list/list.module#ListModule"
    },
    {
        path: "news",
        loadChildren: "modules/news/news.module#NewsModule"
    },
    {
        path: "measure",
        loadChildren: "modules/measure/measure.module#MeasureModule"
    },
    {
        path: "viewer",
        loadChildren: "modules/viewer/viewer.module#ViewerModule"
    }
];

export const AppRoute = RouterModule.forRoot(rootRouterCocnfig, { useHash: true });