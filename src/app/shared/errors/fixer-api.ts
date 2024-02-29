export const FixerAPIErrors = {
    101: 'No API Key was specified or an invalid API Key was specified.',
    103: 'The requested API endpoint does not exist.',
    104: 'The maximum allowed API amount of monthly API requests has been reached.',
    105: 'The current subscription plan does not support this API endpoint.',
    106: 'The current request did not return any results.',
    102: 'The account this API request is coming from is inactive.',
    201: 'An invalid base currency has been entered.',
    202: 'One or more invalid symbols have been specified.'
} as const;

export type FixerAPIErrorCode = keyof typeof FixerAPIErrors;

export const getFixerAPIError = (error: FixerAPIErrorCode) =>
    FixerAPIErrors[error] ?? 'Something went wrong. Please try again later.';
