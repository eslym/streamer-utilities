/*
 * Generate svelte components from hugeicons, hugeicons only have support for react,
 * so we generate the svelte components from the react components.
 *
 * https://hugeicons.com/
 */
///<reference types="bun-types" />

import { resolve } from 'path';
import { toKebabCase } from 'js-convert-case';

const destPath = resolve(import.meta.dir, 'src/lib/hugeicons');

await Bun.plugin({
    name: 'hijack-hugeicons',
    setup: async ({ onLoad }) => {
        onLoad({ filter: /node_modules\/hugeicons-react\/dist\/esm\/create-hugeicon-component.js$/ }, async (_) => {
            return {
                exports: {
                    default(name: string, definitions: any) {
                        return {
                            name,
                            definitions
                        };
                    }
                },
                loader: 'object'
            };
        });
    }
});

function createSvelte(children: string) {
    return `<script lang="ts">
    import type { SVGAttributes } from 'svelte/elements';
    type $$Props = Omit<
        SVGAttributes<SVGElement>,
        \`on:\${string}\` | \`bind:\${string}\` | 'width' | 'height' | 'viewbox' | 'fill' | 'xmlns'
    > & {
        size?: number | string;
    };

    $: size = $$restProps.size || 24;
    $: strokeWidth = $$restProps['stroke-width'] || 1.5;
    $: strokeLinecap = $$restProps['stroke-linecap'] || 'round';
    $: strokeLinejoin = $$restProps['stroke-linejoin'] || 'round';
    $: color = $$restProps.color || 'currentColor';
</script>

<svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    width={size}
    height={size}
    stroke-width={strokeWidth}
    stroke-linecap={strokeLinecap}
    stroke-linejoin={strokeLinejoin}
    {color}
    {...$$restProps}
>
${children}</svg>
`;
}

const icons: Record<string, any> = await import(
    resolve(import.meta.dir, 'node_modules/hugeicons-react/dist/esm/icons/index.js')
);

for (const [name, data] of Object.entries(icons)) {
    let children = '';
    for (const child of data.definitions) {
        children += `    <${child[0]} `;
        for (const [key, value] of Object.entries(child[1])) {
            if (key === 'key') continue;
            children += `${toKebabCase(key)}="${value}" `;
        }
        children += '/>\n';
    }
    await Bun.write(resolve(destPath, `${name}.svelte`), createSvelte(children));
}
