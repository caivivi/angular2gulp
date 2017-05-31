import { Directive, ElementRef, OnInit, Inject, Input } from "@angular/core";
import { ImageFilterType } from "./measure.model";

@Directive({
    selector: "input.image-filter, image-channel"
})
export class FilterDirective implements OnInit {
    @Input("filter-type") filterType: ImageFilterType;

    constructor(@Inject(ElementRef) private el: ElementRef) { }

    ngOnInit() {
        this.el.nativeElement.min = 0;
        this.el.nativeElement.max = 1;
        this.el.nativeElement.step = 0.01;
        
        switch (this.filterType) {
            case "saturation": break;
            case "hue": break;
            case "contrast": break;
            case "brightness": this.el.nativeElement.max = 3; break;
            default: break;
        }
    }
}