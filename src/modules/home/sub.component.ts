import { Component, OnInit, OnChanges, SimpleChanges, Input } from "@angular/core";

@Component({
    selector: "sub",
    template: `<span style="display: inline-block; background: #ccc; border: solid 1px #333; height: 16px">{{subValue}}</span>`
})
export class SubComponent implements OnChanges {
    @Input() subValue: any;

    constructor() { }

    ngOnChanges(changes: SimpleChanges) {
        console.log("Change detected on sub component:", changes);
    }
}