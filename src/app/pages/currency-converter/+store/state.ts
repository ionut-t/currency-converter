import { CurrencySymbol } from './types';

export type CurrencyConverterState = {
    loading: boolean;
    error: string | null;
    symbols: CurrencySymbol[];
    rates: Record<string, number>;
    amount: number;
    baseCurrency: string | null;
    destinationCurrency: string | null;
};

export const initialState: CurrencyConverterState = {
    loading: true,
    error: null,
    symbols: [],
    rates: {},
    amount: 1,
    baseCurrency: null,
    destinationCurrency: null
};
