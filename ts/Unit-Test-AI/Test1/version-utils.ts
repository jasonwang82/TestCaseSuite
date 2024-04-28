import gte from 'semver/functions/gte';
import lte from 'semver/functions/lte';
import lt from 'semver/functions/lt';

export namespace VersionUtils {
    export function greaterThanOrEqualTo(v1: string, v2: string): boolean {
        return gte(v1, v2);
    }

    export function lessThanOrEqualTo(v1: string, v2: string): boolean {
        return lte(v1, v2);
    }

    export function lessThan(v1: string, v2: string): boolean {
        return lt(v1, v2);
    }
}
