import { metadata, type SVGNumberMetadata } from 'virtual:svg-numbers';

type Font = SVGNumberMetadata & {
    name: string;
    url: string;
};

const svgs: Record<string, { default: string }> = import.meta.glob('./*.svg', { eager: true });

export const fonts: Record<string, Font> = Object.fromEntries(
    Object.entries(metadata)
        .map(([name, meta]) => [
            name,
            {
                ...meta,
                name,
                url: svgs[`./${name}.svg`].default
            }
        ])
        .sort(([a], [b]) => (a as string).localeCompare(b as string))
);
