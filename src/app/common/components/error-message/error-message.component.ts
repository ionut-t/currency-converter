import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    Input
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
    selector: 'app-error-message',
    standalone: true,
    imports: [MatIcon],
    template: `
        <mat-icon color="warn">error</mat-icon>
        <p>{{ error }}</p>
    `,
    styles: `
        :host {
            display: grid;
            place-items: center;
            gap: 0.5rem;

            .mat-icon {
                $size: 36px;
                height: $size;
                width: $size;
                font-size: $size;
            }
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorMessageComponent {
    @HostBinding('class.error-message')
    @Input({ required: true })
    error = '';
}
