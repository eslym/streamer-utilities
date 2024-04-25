export type CharData = {
    w: number;
    h: number;
    mx?: number;
    my?: number;
    fg: string[];
    bg: string[];
};

export type FontData = {
    id: string;
    name: string;
    mx?: number;
    my?: number;
    chars: Record<string, CharData>;
};

const jsonData: Record<
    string,
    {
        default: FontData;
    }
> = import.meta.glob('./fonts/*.json', { eager: true });

export const fonts: Record<string, FontData> = Object.fromEntries(
    Object.entries(jsonData)
        .map(([path, { default: font }]) => [path.match(/([^/]+)\.json$/)![1], font])
        .sort(([_, f1], [__, f2]) => (f1 as FontData).name.localeCompare((f2 as FontData).name))
);
