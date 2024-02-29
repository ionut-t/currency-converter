import { FixerAPIErrorCode } from '@shared/errors';

export type CurrencyRatesSuccessResponse = {
    success: true;
    timestamp: number;
    base: string;
    date: string;
    rates: Record<string, number>;
};

export type CurrencyRatesErrorResponse = {
    success: false;
    error: {
        code: FixerAPIErrorCode;
        type: string;
    };
};

export type CurrencyRatesResponse =
    | CurrencyRatesSuccessResponse
    | CurrencyRatesErrorResponse;
