import { getCurrencySymbol } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'currencySymbol',
    standalone: true
})
export class CurrencySymbolPipe implements PipeTransform {
    transform(value: string | null, format: 'narrow' | 'wide' = 'narrow') {
        if (!value) return null;

        return getCurrencySymbol(value, format);
    }
}
