import { Routes, RouterModule } from "@angular/router";
import { ListComponent } from "./list.component";

const listRouterConfig: Routes = [
    {
        path: "",
        component: ListComponent
    }
];

export const ListRoute = RouterModule.forChild(listRouterConfig);