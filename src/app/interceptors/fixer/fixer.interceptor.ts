import { HttpInterceptorFn, HttpParams } from '@angular/common/http';
import { inject, InjectionToken } from '@angular/core';
import { environment } from '../../../environments/environment';

/**
 * It is easier and safer to test the interceptor if an InjectionToken is used to provide the API key.
 */
export const FIXER_API_KEY_TOKEN = new InjectionToken('FIXER_API_KEY_TOKEN', {
    factory: () => environment.fixerAPIKey
});

export const fixerInterceptor: HttpInterceptorFn = (req, next) => {
    const accessKey = inject(FIXER_API_KEY_TOKEN);

    const params = (req.params || new HttpParams()).append(
        'access_key',
        accessKey
    );

    return next(req.clone({ params }));
};
