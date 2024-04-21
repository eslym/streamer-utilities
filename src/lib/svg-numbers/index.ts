import { metadata } from 'virtual:svg-numbers';

const svgs: Record<string, { default: string }> = import.meta.glob('./*.svg', { eager: true });

export const fonts = Object.fromEntries(
    Object.entries(metadata).map(([name, meta]) => [
        name,
        {
            ...meta,
            name,
            url: svgs[`./${name}.svg`].default
        }
    ])
);
