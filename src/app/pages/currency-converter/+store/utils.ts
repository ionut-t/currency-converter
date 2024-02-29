import { ConversionPayload } from './types';

export const generateSymbols = (symbols: Record<string, string>) =>
    Object.entries(symbols).map(([code, name]) => ({
        code,
        name: `${code} - ${name}`
    }));

export const generateConversionPayload = (
    rates: Record<string, number> | null,
    amount: number,
    baseCurrency: string,
    destinationCurrency: string
): ConversionPayload | null => {
    if (!rates) return null;

    const rate = rates[destinationCurrency];

    return {
        rate,
        amount,
        baseCurrency,
        destinationCurrency
    };
};
