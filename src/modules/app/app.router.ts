import { Routes, RouterModule } from "@angular/router";

import { HomeComponent } from "../home/home.component";
//import { DetailComponent } from "../detail/detail.component";

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
    }
];

export const AppRoute = RouterModule.forRoot(rootRouterCocnfig, { useHash: true });