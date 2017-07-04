import { Directive, ElementRef, OnInit, Inject, Input } from "@angular/core";
import { ImageFilterType } from "./measure.model";

@Directive({
    selector: "input[type='range'].operator-filter"
})
export class FilterDirective implements OnInit {
    @Input("filter-type") filterType: ImageFilterType;

    constructor(@Inject(ElementRef) private el: ElementRef) { }

    ngOnInit() {
        let ele = this.el.nativeElement;
        ele.min = 0;
        ele.max = 1;
        ele.step = 0.01;
        
        switch (this.filterType) {
            case "sharpness": ele.max = 2; break;
            case "gamma": ele.max = 3; break;
            case "saturation": ele.min = -2; break;
            case "contrast": ele.min = -1;
            case "exposure" || "contrast": ele.max = 5; break;
            default: break;
        }
    }
}