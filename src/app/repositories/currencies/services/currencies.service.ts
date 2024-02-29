import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
    CurrencyRatesResponse,
    CurrencySymbolsResponse
} from '@repositories/currencies';
import Endpoints from '@repositories/currencies/services/endpoints';

@Injectable({
    providedIn: 'root'
})
export class CurrenciesService {
    constructor(private readonly _http: HttpClient) {}

    getSymbols() {
        return this._http.get<CurrencySymbolsResponse>(Endpoints.symbols);
    }

    getLatestCurrencies(baseCurrency: string) {
        return this._http.get<CurrencyRatesResponse>(
            Endpoints.latestCurrencies,
            {
                params: { base: baseCurrency }
            }
        );
    }
}
