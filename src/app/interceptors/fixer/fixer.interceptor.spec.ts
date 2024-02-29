import {
    HttpClient,
    HttpInterceptorFn,
    provideHttpClient,
    withInterceptors
} from '@angular/common/http';
import {
    HttpTestingController,
    provideHttpClientTesting
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { FIXER_API_KEY_TOKEN, fixerInterceptor } from './fixer.interceptor';

describe('fixerInterceptor', () => {
    const interceptor: HttpInterceptorFn = (req, next) =>
        TestBed.runInInjectionContext(() => fixerInterceptor(req, next));

    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                {
                    provide: FIXER_API_KEY_TOKEN,
                    useValue: 'test_api_key'
                },
                provideHttpClient(withInterceptors([interceptor])),
                provideHttpClientTesting()
            ]
        });

        httpTestingController = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpTestingController.verify();
    });

    it('should be created', () => {
        expect(interceptor).toBeTruthy();
    });

    it('should append the API key to a request without existing params', () => {
        const httpClient = TestBed.inject(HttpClient);

        httpClient.get('/test-api').subscribe();

        const req = httpTestingController.expectOne(
            '/test-api?access_key=test_api_key'
        );
        expect(req.request.params.get('access_key')).toBe('test_api_key');
    });

    it('should append the API key while preserving existing params', () => {
        const httpClient = TestBed.inject(HttpClient);

        httpClient
            .get('/test-api', { params: { existingParam: 'value' } })
            .subscribe();

        const req = httpTestingController.expectOne(
            '/test-api?existingParam=value&access_key=test_api_key'
        );
        expect(req.request.params.get('access_key')).toBe('test_api_key');
        expect(req.request.params.get('existingParam')).toBe('value');
    });
});
