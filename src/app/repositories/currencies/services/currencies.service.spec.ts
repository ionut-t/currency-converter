import {
    HttpClientTestingModule,
    HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
    CurrencyRatesResponse,
    CurrencySymbolsResponse
} from '@repositories/currencies';
import Endpoints from '@repositories/currencies/services/endpoints';
import { CurrenciesService } from './currencies.service';

describe('CurrenciesService', () => {
    let service: CurrenciesService;

    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule]
        });
        service = TestBed.inject(CurrenciesService);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpTestingController.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('#getSymbols', () => {
        it('should get the currency symbols', () => {
            const expectedResponse: CurrencySymbolsResponse = {
                success: true,
                symbols: {
                    EUR: 'Euro',
                    USD: 'United States Dollar',
                    GBP: 'British Pound Sterling',
                    AUD: 'Australian Dollar',
                    CAD: 'Canadian Dollar',
                    JPY: 'Japanese Yen'
                }
            };

            service.getSymbols().subscribe({
                next: response => expect(response).toEqual(expectedResponse),
                error: fail
            });

            const req = httpTestingController.expectOne(Endpoints.symbols);
            expect(req.request.method).toEqual('GET');

            req.flush(expectedResponse);
        });
    });

    describe('#getLatestCurrencies', () => {
        it('should get the latest currency rates', () => {
            const expectedResponse: CurrencyRatesResponse = {
                success: true,
                timestamp: 1622728800,
                base: 'EUR',
                date: '2024-02-28',
                rates: {
                    USD: 1.221,
                    GBP: 0.862,
                    AUD: 1.576,
                    CAD: 1.482,
                    JPY: 133.2
                }
            };

            const baseCurrency = 'EUR';

            service.getLatestCurrencies(baseCurrency).subscribe({
                next: response => expect(response).toEqual(expectedResponse),
                error: fail
            });

            const req = httpTestingController.expectOne(
                `${Endpoints.latestCurrencies}?base=${baseCurrency}`
            );
            expect(req.request.method).toEqual('GET');

            req.flush(expectedResponse);
        });
    });
});
