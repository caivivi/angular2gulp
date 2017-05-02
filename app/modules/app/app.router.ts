import { Routes, RouterModule } from "@angular/router";

import { ListComponent } from "../list/list.component";
import { HomeComponent } from "../home/home.component";
import { DetailComponent } from "../detail/detail.component";

const rootRouterCocnfig: Routes = [
    {
        path: "",
        //redirectTo: "home",
        pathMatch: 'full',
        component: HomeComponent
    },
    {
        path: "home",
        component: HomeComponent
    },
    {
        path: "list",
        component: ListComponent
    }
];

export const AppRoute = RouterModule.forRoot(rootRouterCocnfig);