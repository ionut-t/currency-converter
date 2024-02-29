import { CurrencySymbolPipe } from './currency-symbol.pipe';

describe('CurrencySymbolPipe', () => {
    const pipe = new CurrencySymbolPipe();

    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    it('should return the currency symbol', () => {
        expect(pipe.transform('GBP')).toBe('£');
    });

    it('should return null', () => {
        expect(pipe.transform(null)).toBeNull();
    });
});
