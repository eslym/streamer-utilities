export const positiveString = new Set<string | null | undefined>(['true', '1', 'yes', 'on']);
export const negativeString = new Set<string | null | undefined>(['false', '0', 'no', 'off']);

export function hcf(a: number, b: number) {
    while (a !== b) {
        if (a > b) a -= b;
        else b -= a;
    }
    return a;
}
