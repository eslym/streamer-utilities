export const positiveString = new Set<string | null | undefined>(['true', '1', 'yes', 'on']);
export const negativeString = new Set<string | null | undefined>(['false', '0', 'no', 'off']);

export function hcf(a: number, b: number) {
    while (a !== b) {
        if (a > b) a -= b;
        else b -= a;
    }
    return a;
}

export type AlignmentNumber = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
export type Alignment = 'start' | 'center' | 'end';

export function mapAlign(n: AlignmentNumber) {
    const align: [Alignment, Alignment] = [] as any;
    switch (n) {
        case '1':
        case '4':
        case '7':
            align[0] = 'start';
            break;
        case '2':
        case '5':
        case '8':
            align[0] = 'center';
            break;
        case '3':
        case '6':
        case '9':
            align[0] = 'end';
            break;
    }
    switch (n) {
        case '1':
        case '2':
        case '3':
            align[1] = 'start';
            break;
        case '4':
        case '5':
        case '6':
            align[1] = 'center';
            break;
        case '7':
        case '8':
        case '9':
            align[1] = 'end';
            break;
    }
    return align;
}

export const numbers = Object.freeze(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']);

export function css(obj: Record<string, string | undefined | null | false>) {
    return Object.entries(obj)
        .filter(([_, v]) => v)
        .map(([key, value]) => `${key}:${value}`)
        .join(';');
}

export function parseBoolean(value: string | null | undefined, def: boolean = false): boolean {
    return def
        ? !negativeString.has(value?.toLowerCase())
        : positiveString.has(value?.toLowerCase());
}

export type Sides = { mode: 1 | 2 | 4; sides: number[] };

export function decodeSides(sides: string, fallback: number = 0): Sides {
    const parts = sides
        .split('|')
        .map(parseInt)
        .map((v) => (isNaN(v) ? fallback : v));
    if (parts.length === 0) return { mode: 1, sides: [0] };
    if (parts.length === 1) return { mode: 1, sides: parts.slice(0, 1) };
    if (parts.length < 4) return { mode: 2, sides: parts.slice(0, 2) };
    return { mode: 4, sides: parts.slice(0, 4) };
}
