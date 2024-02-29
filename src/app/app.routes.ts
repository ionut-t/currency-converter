import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import(
                './pages/currency-converter/currency-converter.component'
            ).then(c => c.CurrencyConverterComponent)
    }
];
