import { Routes, RouterModule } from "@angular/router";
import { MeasureComponent } from "./measure.component";

export const measureRouterConfig: Routes = [
    {
        path: "",
        component: MeasureComponent
    }
]

export const  MeasureRoute = RouterModule.forChild(measureRouterConfig);