import { ComponentFixture, TestBed } from '@angular/core/testing';
import { findByCss } from '@shared/testing';
import { ConversionPayloadComponent } from './conversion-payload.component';

describe('ConversionPayloadComponent', () => {
    let component: ConversionPayloadComponent;
    let fixture: ComponentFixture<ConversionPayloadComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ConversionPayloadComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(ConversionPayloadComponent);
        component = fixture.componentInstance;
        component.payload = {
            rate: 0.855992,
            amount: 100,
            baseCurrency: 'EUR',
            destinationCurrency: 'GBP'
        };
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display the conversion details', () => {
        expect(findByCss(fixture, '.heading').nativeElement.textContent).toBe(
            '€100.00 = £85.5992'
        );
        expect(findByCss(fixture, 'p').nativeElement.textContent).toBe(
            '€1 = £0.855992'
        );
    });
});
