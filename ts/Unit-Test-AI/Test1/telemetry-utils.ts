import { Event } from '../telemetry';
export namespace TelemetryUtils {
    export function toUniqueKeys(code: string, event: Event): Event {
        const newEvent: Event = {};
        for (const [key, value] of Object.entries(event)) {
            const newKey = getUniqueId(code, key);
            newEvent[newKey] = value;
        }
        return newEvent;
    }

    export function getUniqueId(...parameters: string[]): string {
        return ['ai', ...parameters].join('_');
    }

}
