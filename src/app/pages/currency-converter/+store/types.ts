export type CurrencySymbol = {
    code: string;
    name: string;
};

export type ConversionPayload = {
    rate: number;
    amount: number;
    baseCurrency: string;
    destinationCurrency: string;
};
