import { ChangeDetectorRef, Type } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

export const findByCss = <T>(fixture: ComponentFixture<T>, selector: string) =>
    fixture.debugElement.query(By.css(selector));

export const findByDirective = <T, D>(
    fixture: ComponentFixture<T>,
    selector: Type<D>
) => fixture.debugElement.query(By.directive(selector));

export const findAllByDirective = <T, D>(
    fixture: ComponentFixture<T>,
    selector: Type<D>
) => fixture.debugElement.queryAll(By.directive(selector));

export const detectChanges = <T>(fixture: ComponentFixture<T>) => {
    const cdr =
        fixture.debugElement.injector.get<ChangeDetectorRef>(ChangeDetectorRef);
    cdr.detectChanges();
    fixture.detectChanges();
};
