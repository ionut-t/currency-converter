import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { MatAutocompleteHarness } from '@angular/material/autocomplete/testing';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorMessageComponent } from '@common/components/error-message/error-message.component';
import {
    findAllByDirective,
    findByCss,
    findByDirective
} from '@shared/testing';
import { of } from 'rxjs';
import { ConversionPayload, CurrencyConverterStore } from './+store';
import { ConversionPayloadComponent } from './conversion-payload/conversion-payload.component';
import { CurrencyConverterComponent } from './currency-converter.component';

describe('CurrencyConverterComponent', () => {
    let component: CurrencyConverterComponent;
    let fixture: ComponentFixture<CurrencyConverterComponent>;

    let store: jasmine.SpyObj<CurrencyConverterStore>;
    let loader: HarnessLoader;

    const mountComponent = async ({
        loading = false,
        error = null,
        conversionPayload = null
    }: {
        loading?: boolean;
        error?: string | null;
        conversionPayload?: ConversionPayload | null;
    } = {}) => {
        store = jasmine.createSpyObj(
            'CurrencyConverterStore',
            [
                'loadSymbols',
                'updateAmount',
                'loadRates',
                'updateDestinationCurrency'
            ],
            {
                loading: signal(loading),
                error: signal(error),
                symbols$: of([
                    {
                        code: 'USD',
                        name: 'USD - United States Dollar'
                    },
                    {
                        code: 'GBP',
                        name: 'GBP - British Pound'
                    },
                    {
                        code: 'EUR',
                        name: 'EUR - Euro'
                    }
                ]),
                conversionPayload$: of(conversionPayload)
            }
        );

        await TestBed.configureTestingModule({
            imports: [CurrencyConverterComponent, NoopAnimationsModule]
        }).compileComponents();

        TestBed.overrideProvider(CurrencyConverterStore, { useValue: store });

        fixture = TestBed.createComponent(CurrencyConverterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        loader = TestbedHarnessEnvironment.loader(fixture);
    };

    it('should create', async () => {
        await mountComponent();
        expect(component).toBeTruthy();
    });

    it('should load symbols on init', async () => {
        await mountComponent();
        expect(store.loadSymbols).toHaveBeenCalled();
    });

    it('should track the amount changes', async () => {
        await mountComponent();

        expect(store.updateAmount).toHaveBeenCalled();
    });

    it('should display a loading spinner', async () => {
        await mountComponent({ loading: true });
        expect(findByDirective(fixture, MatProgressSpinner)).toBeTruthy();
    });

    it('should display an error message', async () => {
        await mountComponent({ error: 'An error occurred' });

        const errorElement = findByDirective(fixture, ErrorMessageComponent);
        expect(errorElement).toBeTruthy();
    });

    it('should be able to get filtered options', async () => {
        await mountComponent();

        const [input] = await loader.getAllHarnesses(MatAutocompleteHarness);

        await input.focus();

        await input.enterText('pound');
        await fixture.whenStable();

        const options = await input.getOptions();

        expect(options).toHaveSize(1);
        expect(await options[0].getText()).toBe('GBP - British Pound');
    });

    it('should load currency rates when the base currency changes', async () => {
        await mountComponent();

        const [autocomplete] = findAllByDirective(fixture, MatAutocomplete);

        autocomplete.triggerEventHandler('optionSelected', {
            option: {
                value: {
                    code: 'GBP',
                    name: 'GBP - British Pound'
                }
            }
        });

        expect(store.loadRates).toHaveBeenCalledWith('GBP');
    });

    it('should update the destination currency', async () => {
        await mountComponent();

        const [, autocomplete] = findAllByDirective(fixture, MatAutocomplete);

        autocomplete.triggerEventHandler('optionSelected', {
            option: {
                value: {
                    code: 'GBP',
                    name: 'GBP - British Pound'
                }
            }
        });

        expect(store.updateDestinationCurrency).toHaveBeenCalledWith('GBP');
    });

    describe('#swapCurrencies', () => {
        it('should swap currencies', async () => {
            await mountComponent();

            component.form.patchValue({
                from: {
                    code: 'USD',
                    name: 'USD - United States Dollar'
                },
                to: {
                    code: 'GBP',
                    name: 'GBP - British Pound'
                }
            });

            const swapButton = findByCss(fixture, '.swap-button');

            swapButton.triggerEventHandler('click');

            expect(component.form.value).toEqual({
                from: {
                    code: 'GBP',
                    name: 'GBP - British Pound'
                },
                to: {
                    code: 'USD',
                    name: 'USD - United States Dollar'
                },
                amount: 1
            });
            expect(store.loadRates).toHaveBeenCalledWith('GBP');
        });

        it('should not load rates if the form is invalid', async () => {
            await mountComponent();

            const swapButton = findByCss(fixture, '.swap-button');

            swapButton.triggerEventHandler('click');

            expect(store.loadRates).not.toHaveBeenCalled();
        });
    });

    it('should display the conversion payload', async () => {
        await mountComponent({
            conversionPayload: {
                rate: 0.855992,
                amount: 100,
                baseCurrency: 'EUR',
                destinationCurrency: 'GBP'
            }
        });

        component.form.setValue({
            amount: 100,
            from: {
                code: 'EUR',
                name: 'EUR - Euro'
            },
            to: {
                code: 'GBP',
                name: 'GBP - British Pound'
            }
        });

        fixture.detectChanges();

        const payload = findByDirective(fixture, ConversionPayloadComponent);

        expect(payload).toBeTruthy();
    });
});
