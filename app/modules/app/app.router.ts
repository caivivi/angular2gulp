import { Routes, RouterModule } from "@angular/router";

import { HomeComponent } from "../home/home.component";
import { DetailComponent } from "../detail/detail.component";

const rootRouterCocnfig: Routes = [
    {
        path: "",
        //redirectTo: "home",
        pathMatch: 'full',
        component: HomeComponent
    },
    // {
    //     path: "**",
    //     component: HomeComponent
    // },
    {
        path: "home",
        component: HomeComponent
        // children: [
        //     {
        //         path: "detail",
        //         component: DetailComponent
        //     }
        // ]
    },
    {
        path: "list",
        loadChildren: "modules/list/list.module#ListModule",
        canActivate: [],
        canDeactivate: []
    }
];

export const AppRoute = RouterModule.forRoot(rootRouterCocnfig);