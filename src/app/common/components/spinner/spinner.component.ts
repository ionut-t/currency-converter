import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
    selector: 'app-spinner',
    standalone: true,
    imports: [MatProgressSpinner],
    template: `<mat-spinner diameter="50" />`,
    styles: `
        :host {
            position: absolute;
            inset: 0;
            display: grid;
            place-items: center;
            background-color: rgba(255, 255, 255, 0.5);
            z-index: 100;
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SpinnerComponent {}
