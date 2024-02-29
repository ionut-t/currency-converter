import { filter } from 'rxjs';

/**
 *  Custom RxJS operator designed to filter out null and undefined values
 *  from an observable stream.
 */
export const notNil = <T>() =>
    filter(
        (value: T | null | undefined): value is T =>
            value !== null && value !== undefined
    );
