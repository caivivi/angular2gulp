import { Component, OnInit, OnChanges, SimpleChanges, Input } from "@angular/core";

@Component({
    selector: "sub",
    template: `<output>{{subValue}}</output>`
})
export class SubComponent implements OnChanges {
    @Input() subValue: any;

    constructor() { }

    ngOnChanges(changes: SimpleChanges) { }
}