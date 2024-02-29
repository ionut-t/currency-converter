import { FixerAPIErrorCode } from '@shared/errors/fixer-api';

export type CurrencySymbolsSuccessResponse = {
    success: true;
    symbols: Record<string, string>;
};

export type CurrencySymbolsErrorResponse = {
    success: false;
    error: {
        code: FixerAPIErrorCode;
        type: string;
        info: string;
    };
};

export type CurrencySymbolsResponse =
    | CurrencySymbolsSuccessResponse
    | CurrencySymbolsErrorResponse;
