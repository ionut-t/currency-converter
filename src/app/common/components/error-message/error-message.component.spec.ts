import { ComponentFixture, TestBed } from '@angular/core/testing';
import { detectChanges, findByCss } from '@shared/testing';
import { ErrorMessageComponent } from './error-message.component';

describe('ErrorMessageComponent', () => {
    let component: ErrorMessageComponent;
    let fixture: ComponentFixture<ErrorMessageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ErrorMessageComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(ErrorMessageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display an error message', () => {
        component.error = 'An error occurred';
        detectChanges(fixture);

        expect(findByCss(fixture, 'p').nativeElement.textContent).toContain(
            'An error occurred'
        );
    });
});
