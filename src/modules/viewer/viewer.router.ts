import { Routes, RouterModule } from "@angular/router";
import { ViewerComponent } from "./viewer.component";

const viewerRouterConfig: Routes = [
    {
        path: "",
        component: ViewerComponent
    }
];

export const ViewerRoute = RouterModule.forChild(viewerRouterConfig);