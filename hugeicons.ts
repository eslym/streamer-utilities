/*
 * Generate svelte components from hugeicons, hugeicons only have support for react,
 * so we generate the svelte components from the react components.
 *
 * https://hugeicons.com/
 */
///<reference types="bun-types" />

import { resolve } from 'path';
import { toKebabCase } from 'js-convert-case';
import { version } from 'hugeicons-react/package.json';

const destPath = resolve(import.meta.dir, 'node_modules/hugeicons-svelte');

await Bun.plugin({
    name: 'hijack-hugeicons',
    setup: async ({ onLoad }) => {
        onLoad(
            { filter: /node_modules\/hugeicons-react\/dist\/esm\/create-hugeicon-component.js$/ },
            async (_) => {
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
            }
        );
    }
});

const svelte = `<script>
export let icon;

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
>{#each icon as elements}
<svelte:element this={elements[0]} {...elements[1]} />
{/each}</svg>
`;

const dts = `import type { SVGAttributes } from 'svelte/elements';
import {SvelteComponent, ComponentType} from 'svelte';

export type IconDefinition = [string, Record<string, string>][];

type IconsProps = Omit<
    SVGAttributes<SVGElement>,
    \`on:\${string}\` | \`bind:\${string}\` | 'width' | 'height' | 'viewbox' | 'fill' | 'xmlns'
> & {
    icon: IconDefinition;
    size?: number | string;
};

export const Hugeicon: ComponentType<SvelteComponent<IconsProps, {}, {}>>;
`;

const icons: Record<string, any> = await import(
    resolve(import.meta.dir, 'node_modules/hugeicons-react/dist/esm/icons/index.js')
);

await Bun.$`rm -rf ${destPath}`;
await Bun.$`mkdir -p ${destPath}`;

const index = Object.entries(icons)
    .map(([name, data]) => {
        for (const child of data.definitions) {
            const attrs = {};
            for (const key in child[1]) {
                if (key === 'key') continue;
                attrs[toKebabCase(key)] = child[1][key];
            }
            child[1] = attrs;
        }
        return `export const ${name} = ${JSON.stringify(data.definitions)};`;
    })
    .concat('export { default as Hugeicon } from "./Hugeicon.svelte";')
    .join('\n');

await Bun.write(resolve(destPath, 'index.mjs'), index);

await Bun.write(resolve(destPath, 'Hugeicon.svelte'), svelte);

await Bun.write(
    resolve(destPath, 'index.d.ts'),
    dts +
        Object.keys(icons)
            .map((name) => `export const ${name}: IconDefinition;`)
            .join('\n')
);

await Bun.write(
    resolve(destPath, 'package.json'),
    JSON.stringify(
        {
            name: 'hugeicons-svelte',
            version,
            exports: {
                svelte: './index.mjs',
                types: './index.d.ts'
            }
        },
        null,
        4
    )
);
