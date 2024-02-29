import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatMiniFabButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ErrorMessageComponent, SpinnerComponent } from '@common/components';
import { CurrencySymbolPipe } from '@common/pipes';
import { notNil } from '@shared/utils';
import { startWith } from 'rxjs';
import { CurrencyConverterStore, CurrencySymbol } from './+store';
import { ConversionPayloadComponent } from './conversion-payload/conversion-payload.component';
import { filterSymbols, isSymbolCtrlValid } from './utils';

@Component({
    selector: 'app-currency-converter',
    standalone: true,
    imports: [
        AsyncPipe,
        ReactiveFormsModule,
        MatInputModule,
        MatAutocompleteModule,
        MatMiniFabButton,
        MatIconModule,
        SpinnerComponent,
        ErrorMessageComponent,
        ConversionPayloadComponent,
        CurrencySymbolPipe
    ],
    templateUrl: './currency-converter.component.html',
    styleUrl: './currency-converter.component.scss',
    providers: [CurrencyConverterStore],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurrencyConverterComponent implements OnInit {
    readonly form = new FormGroup({
        amount: new FormControl(1, [Validators.required, Validators.min(0.01)]),
        from: new FormControl<CurrencySymbol | null>(null, Validators.required),
        to: new FormControl<CurrencySymbol | null>(null, Validators.required)
    });

    readonly error = this._store.error;
    readonly loading = this._store.loading;

    readonly conversionPayload$ = this._store.conversionPayload$;

    readonly baseSymbols$ = filterSymbols(
        this.form.controls.from.valueChanges.pipe(startWith('')),
        this._store.symbols$
    );

    readonly destinationSymbols$ = filterSymbols(
        this.form.controls.to.valueChanges,
        this._store.symbols$
    );

    readonly displaySymbol = (symbol: CurrencySymbol | null) =>
        symbol?.name ?? '';

    constructor(private readonly _store: CurrencyConverterStore) {}

    ngOnInit() {
        this._store.loadSymbols();

        // Listen for the amount changes and update the store
        this._store.updateAmount(
            this.form.controls.amount.valueChanges.pipe(notNil())
        );
    }

    selectBaseCurrency(symbol: CurrencySymbol) {
        this._store.loadRates(symbol.code);
    }

    selectDestinationCurrency(symbol: CurrencySymbol) {
        this._store.updateDestinationCurrency(symbol.code);
    }

    swapCurrencies() {
        const from = this.form.controls.from.value;
        const to = this.form.controls.to.value;

        this.form.patchValue({ from: to, to: from });

        if (isSymbolCtrlValid(this.form.controls.from.value)) {
            this.selectBaseCurrency(this.form.controls.from.value!);
        }

        if (isSymbolCtrlValid(this.form.controls.to.value)) {
            this.selectDestinationCurrency(this.form.controls.to.value!);
        }
    }
}
