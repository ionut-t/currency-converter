import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { CurrenciesService } from '@repositories/currencies';
import { getFixerAPIError, getHttpError } from '@shared/errors';
import { notNil } from '@shared/utils';
import { distinctUntilChanged, switchMap, tap } from 'rxjs';
import { CurrencyConverterState, initialState } from './state';
import { CurrencySymbol } from './types';
import { generateConversionPayload, generateSymbols } from './utils';

@Injectable()
export class CurrencyConverterStore extends ComponentStore<CurrencyConverterState> {
    // SELECTORS
    readonly loading = this.selectSignal(({ loading }) => loading);
    readonly error = this.selectSignal(({ error }) => error);
    readonly symbols$ = this.select(({ symbols }) => symbols);

    private readonly _rates$ = this.select(({ rates }) => rates);
    private readonly _amount$ = this.select(({ amount }) => amount);
    private readonly _baseCurrency$ = this.select(
        ({ baseCurrency }) => baseCurrency
    ).pipe(notNil());
    private readonly _destinationCurrency$ = this.select(
        ({ destinationCurrency }) => destinationCurrency
    ).pipe(notNil());

    readonly conversionPayload$ = this.select(
        this._rates$,
        this._amount$,
        this._baseCurrency$,
        this._destinationCurrency$,
        generateConversionPayload
    );

    // UPDATERS
    readonly updateAmount = this.updater<number>((state, amount) => ({
        ...state,
        amount
    }));

    readonly updateDestinationCurrency = this.updater<string>(
        (state, destinationCurrency) => ({
            ...state,
            destinationCurrency
        })
    );

    private readonly _setError = this.updater<string>((state, error) => ({
        ...state,
        error,
        loading: false
    }));

    private readonly _setSymbols = this.updater<CurrencySymbol[]>(
        (state, symbols) => ({
            ...state,
            symbols,
            loading: false
        })
    );

    private readonly _setRates = this.updater<Record<string, number>>(
        (state, rates) => ({
            ...state,
            rates,
            loading: false
        })
    );

    // EFFECTS
    readonly loadSymbols = this.effect($ =>
        $.pipe(
            switchMap(() => this._currenciesService.getSymbols()),
            tapResponse(
                response => {
                    if (response.success) {
                        this._setSymbols(generateSymbols(response.symbols));
                    } else {
                        this._setError(getFixerAPIError(response.error.code));
                    }
                },
                error => this._setError(getHttpError(error))
            )
        )
    );

    readonly loadRates = this.effect<string>(baseCurrency$ =>
        baseCurrency$.pipe(
            distinctUntilChanged(),
            tap(baseCurrency =>
                this.patchState({ baseCurrency, loading: true })
            ),
            switchMap(baseCurrency =>
                this._currenciesService.getLatestCurrencies(baseCurrency)
            ),
            tapResponse(
                response => {
                    if (response.success) {
                        this._setRates(response.rates);
                    } else {
                        this._showError(getFixerAPIError(response.error.code));
                        this.patchState({ loading: false });
                    }
                },
                error => {
                    this._showError(getHttpError(error));
                    this.patchState({ loading: false });
                }
            )
        )
    );

    constructor(
        private readonly _currenciesService: CurrenciesService,
        private readonly _snackBar: MatSnackBar
    ) {
        super(initialState);
    }

    private _showError(error: string) {
        this._snackBar.open(error, 'Dismiss', {
            duration: 5000
        });
    }
}
