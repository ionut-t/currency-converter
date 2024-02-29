import { debounceTime, map, Observable, startWith, switchMap } from 'rxjs';
import { CurrencySymbol } from './+store';

export const filterSymbols = (
    value$: Observable<CurrencySymbol | null | string>,
    symbols$: Observable<CurrencySymbol[]>
) =>
    value$.pipe(
        startWith(''),
        debounceTime(100),
        switchMap(filteredValue =>
            symbols$.pipe(
                map(symbols => {
                    if (filteredValue === null) return symbols;

                    if (typeof filteredValue === 'string') {
                        return symbols.filter(({ name }) =>
                            name
                                .toLowerCase()
                                .includes(filteredValue.toLowerCase())
                        );
                    }

                    return [filteredValue];
                })
            )
        )
    );

export const isSymbolCtrlValid = (symbol: CurrencySymbol | null | string) => {
    if (typeof symbol === 'string') return false;

    return symbol !== null;
};
