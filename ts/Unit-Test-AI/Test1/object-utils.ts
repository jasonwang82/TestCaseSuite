import clonedeep from 'lodash.clonedeep';
import isEqual from 'lodash.isequal';

export namespace ObjectUtils {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    export function clone<T>(obj: any): T {
        return clonedeep(obj) as T;
    }
    export function equal(value: any, other: any): boolean {
        return isEqual(value, other);
    }
}
