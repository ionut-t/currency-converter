import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { CurrenciesService } from '@repositories/currencies';
import { of, throwError } from 'rxjs';
import { CurrencyConverterStore } from './currency-converter.store';

describe('CurrencyConverterStore', () => {
    let store: CurrencyConverterStore;
    let currenciesService: jasmine.SpyObj<CurrenciesService>;
    let snackBar: jasmine.SpyObj<MatSnackBar>;

    beforeEach(() => {
        currenciesService = jasmine.createSpyObj('CurrenciesService', [
            'getSymbols',
            'getLatestCurrencies'
        ]);

        snackBar = jasmine.createSpyObj('MatSnackBar', ['open']);

        TestBed.configureTestingModule({
            imports: [NoopAnimationsModule],
            providers: [
                CurrencyConverterStore,
                { provide: CurrenciesService, useValue: currenciesService },
                { provide: MatSnackBar, useValue: snackBar }
            ]
        });
        store = TestBed.inject(CurrencyConverterStore);
    });

    it('should be created', () => {
        expect(store).toBeTruthy();
    });

    describe('#loadSymbols', () => {
        it('should load symbols', () => {
            currenciesService.getSymbols.and.returnValue(
                of({
                    success: true,
                    symbols: {
                        EUR: 'Euro',
                        USD: 'United States Dollar'
                    }
                })
            );

            expect(store.loading()).toBeTrue();

            const symbolsSpy = subscribeSpyTo(store.symbols$);

            store.loadSymbols();
            expect(currenciesService.getSymbols).toHaveBeenCalledTimes(1);

            expect(symbolsSpy.getFirstValue()).toEqual([]);
            expect(symbolsSpy.getLastValue()).toEqual([
                { code: 'EUR', name: 'EUR - Euro' },
                { code: 'USD', name: 'USD - United States Dollar' }
            ]);
            expect(store.loading()).toBeFalse();
        });

        it('should display an error message', () => {
            currenciesService.getSymbols.and.returnValue(
                throwError(() => new HttpErrorResponse({ status: 404 }))
            );

            const errorSpy = subscribeSpyTo(store.select(({ error }) => error));

            store.loadSymbols();
            expect(currenciesService.getSymbols).toHaveBeenCalledTimes(1);

            expect(errorSpy.getFirstValue()).toBeNull();
            expect(errorSpy.getLastValue()).toEqual(
                'The resource you are looking for does not exist.'
            );
            expect(store.loading()).toBeFalse();
        });

        it('should display an error message from the Fixer API', () => {
            currenciesService.getSymbols.and.returnValue(
                of({
                    success: false,
                    error: {
                        code: 101,
                        info: 'error',
                        type: 'type'
                    }
                })
            );

            const errorSpy = subscribeSpyTo(store.select(({ error }) => error));

            store.loadSymbols();
            expect(currenciesService.getSymbols).toHaveBeenCalledTimes(1);

            expect(errorSpy.getFirstValue()).toBeNull();
            expect(errorSpy.getLastValue()).toEqual(
                'No API Key was specified or an invalid API Key was specified.'
            );
        });
    });

    describe('#loadRates', () => {
        it('should load currency rates', () => {
            const rates = {
                EUR: 1,
                USD: 1.1
            };
            const baseCurrency = 'EUR';

            currenciesService.getLatestCurrencies.and.returnValue(
                of({
                    success: true,
                    base: baseCurrency,
                    timestamp: Date.now(),
                    date: new Date().toISOString(),
                    rates
                })
            );

            const ratesSpy = subscribeSpyTo(store.select(({ rates }) => rates));
            const baseCurrencySpy = subscribeSpyTo(
                store.select(({ baseCurrency }) => baseCurrency)
            );

            store.loadRates(baseCurrency);
            expect(currenciesService.getLatestCurrencies).toHaveBeenCalledWith(
                baseCurrency
            );

            expect(ratesSpy.getFirstValue()).toEqual({});
            expect(ratesSpy.getLastValue()).toEqual(rates);
            expect(baseCurrencySpy.getLastValue()).toBe(baseCurrency);
        });

        it('should display an error message', () => {
            currenciesService.getLatestCurrencies.and.returnValue(
                throwError(() => new HttpErrorResponse({ status: 404 }))
            );

            store.loadRates('EUR');
            expect(currenciesService.getLatestCurrencies).toHaveBeenCalledTimes(
                1
            );

            expect(snackBar.open).toHaveBeenCalledWith(
                'The resource you are looking for does not exist.',
                'Dismiss',
                { duration: 5000 }
            );
            expect(store.loading()).toBeFalse();
        });

        it('should display an error message from the Fixer API', () => {
            currenciesService.getLatestCurrencies.and.returnValue(
                of({
                    success: false,
                    error: {
                        code: 101,
                        info: 'error',
                        type: 'type'
                    }
                })
            );

            store.loadRates('EUR');
            expect(currenciesService.getLatestCurrencies).toHaveBeenCalledTimes(
                1
            );

            expect(snackBar.open).toHaveBeenCalledWith(
                'No API Key was specified or an invalid API Key was specified.',
                'Dismiss',
                { duration: 5000 }
            );
            expect(store.loading()).toBeFalse();
        });
    });

    describe('#updateDestinationCurrency', () => {
        it('should update the base currency', () => {
            const destinationCurrency = 'EUR';

            const destinationCurrencySpy = subscribeSpyTo(
                store.select(({ destinationCurrency }) => destinationCurrency)
            );

            store.updateDestinationCurrency(destinationCurrency);

            expect(destinationCurrencySpy.getLastValue()).toBe(
                destinationCurrency
            );
        });
    });

    describe('#updateAmount', () => {
        it('should update the amount', () => {
            const amount = 100;

            const amountSpy = subscribeSpyTo(
                store.select(({ amount }) => amount)
            );

            store.updateAmount(amount);

            expect(amountSpy.getLastValue()).toBe(amount);
        });
    });

    describe('#conversionPayload', () => {
        it('should return the conversion payload', () => {
            const amount = 100;
            const baseCurrency = 'EUR';
            const destinationCurrency = 'USD';
            const rate = 1.1;

            store.patchState({
                amount,
                baseCurrency,
                destinationCurrency,
                rates: {
                    EUR: 1,
                    USD: rate
                }
            });

            const conversionPayloadSpy = subscribeSpyTo(
                store.conversionPayload$
            );

            expect(conversionPayloadSpy.getLastValue()).toEqual({
                amount,
                baseCurrency,
                destinationCurrency,
                rate
            });
        });
    });
});
