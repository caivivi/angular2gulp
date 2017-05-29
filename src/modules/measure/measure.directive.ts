import { Directive, ElementRef, OnInit, Inject } from "@angular/core";

@Directive({
    selector: "input.image-filter"
})
export class FilterDirective implements OnInit {
    constructor(@Inject(ElementRef) private el: ElementRef) { }

    ngOnInit() {
        this.el.nativeElement.min = -100;
    }
}