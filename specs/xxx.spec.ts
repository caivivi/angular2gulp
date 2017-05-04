/// <reference path="../node_modules/@types/mocha/index.d.ts" />

import { DebugElement, OnInit } from "@angular/core";
import { TestBed, ComponentFixture, async } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

import { HomeComponent } from "../app/modules/home/home.component";

describe('Test HomeComponent', () => {
    let comp: HomeComponent;
    let fixture: ComponentFixture<HomeComponent>;
    let de: DebugElement;
    let el: HTMLElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [HomeComponent]// declare the test component
        });

        fixture = TestBed.createComponent(HomeComponent);
        comp = fixture.componentInstance;
        // HomeComponent test instance
        // query for the title <input> by CSS element selector
        de = fixture.debugElement.query(By.css('input'));
        el = de.nativeElement;
    }));

    it("should write some testing code.", () => {
        //test code here...
    });
});