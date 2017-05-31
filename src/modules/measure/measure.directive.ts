import { Directive, ElementRef, OnInit, Inject, Input } from "@angular/core";
import { ImageFilterType } from "./measure.model";

@Directive({
    selector: "input.image-filter"
})
export class FilterDirective implements OnInit {
    @Input("filter-type") filterType: ImageFilterType;

    constructor(@Inject(ElementRef) private el: ElementRef) { }

    ngOnInit() {
        let nativeEle = this.el.nativeElement;

        nativeEle.min = 0;
        nativeEle.max = 2;
        nativeEle.step = 0.01;
        
        switch (this.filterType) {
            case "saturation": break;
            case "hue": break;
            case "contrast": nativeEle.min = -1;
            case "brightness" || "contrast": nativeEle.max = 5; break;
            default: nativeEle.max = 1; break;
        }
    }
}