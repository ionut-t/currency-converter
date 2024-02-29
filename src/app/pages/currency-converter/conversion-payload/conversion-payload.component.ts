import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ConversionPayload } from '../+store';

@Component({
    selector: 'app-conversion-payload',
    standalone: true,
    imports: [CurrencyPipe],
    templateUrl: './conversion-payload.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConversionPayloadComponent {
    @Input({ required: true }) payload!: ConversionPayload;
}
