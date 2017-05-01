import { Routes } from "@angular/router";
import { ListComponent } from "../list/list.component";

export const rootRouterCocnfig: Routes = [
    {
        path: "",
        //redirectTo: "list",
        pathMatch: 'full',
        component: ListComponent
    },
    {
        path: "list",
        component: ListComponent
    }
];