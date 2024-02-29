import { HttpErrorResponse } from '@angular/common/http';

export const HttpErrorDictionary = {
    400: 'Your request is invalid. Please try again.',
    401: 'You are not authorized to access this resource.',
    403: 'You do not have permission to access this resource.',
    404: 'The resource you are looking for does not exist.',
    429: 'Too many requests. Please try again later.',
    500: 'Something went wrong. Please try again later.',
    503: 'The service is currently unavailable. Please try again later.'
} as const;

export type HttpErrorCode = keyof typeof HttpErrorDictionary;

export const getHttpError = (error: unknown) => {
    if (error instanceof HttpErrorResponse) {
        const status = error.status as HttpErrorCode;
        return HttpErrorDictionary[status] ?? HttpErrorDictionary['500'];
    }

    return HttpErrorDictionary['500'];
};
