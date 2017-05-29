import { Directive, ElementRef, OnInit, Inject, Input } from "@angular/core";
import { ImageFilterType } from "./measure.model";

@Directive({
    selector: "input.image-filter"
})
export class FilterDirective implements OnInit {
    @Input("filter-type") filterType: ImageFilterType;

    constructor(@Inject(ElementRef) private el: ElementRef) { }

    ngOnInit() {
        this.el.nativeElement.min = -100;
    }
}