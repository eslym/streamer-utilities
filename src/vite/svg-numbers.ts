import type { Plugin } from 'vite';
import { readFile } from 'fs/promises';
import { convert } from 'xmlbuilder2';
import { glob } from 'glob';
import { resolve, basename } from 'path';

import type { SVGNumberMetadata } from 'virtual:svg-numbers';

const svgdir = resolve(import.meta.dirname, '../lib/svg-numbers');

async function getMetadata(): Promise<Record<string, SVGNumberMetadata>> {
    const svgs = await glob('./*.svg', {
        cwd: svgdir,
        absolute: true
    });
    const records: Record<string, SVGNumberMetadata> = {};
    for (const path of svgs) {
        const contents = await readFile(path, 'utf-8');
        const xml = convert(contents, { format: 'object' }) as any;
        const name = basename(path, '.svg');
        const width = parseInt(xml.svg['@width']);
        const height = parseInt(xml.svg['@height']);
        if (typeof xml.svg.desc === 'string') {
            try {
                const data = JSON.parse(xml.svg.desc);
                records[name] = {
                    ...data,
                    width,
                    height
                };
                continue;
            } catch (e) {
                console.warn(`Failed to parse metadata in ${path}`, e);
            }
        }
        records[name] = { width, height };
    }
    return records;
}

export default function svgNumbers(): Plugin {
    const virtualModuleId = 'virtual:svg-numbers';
    const resolvedVirtualModuleId = '\0' + virtualModuleId;

    return {
        name: 'svg-numbers', // required, will show up in warnings and errors
        resolveId(id) {
            if (id === virtualModuleId) {
                return resolvedVirtualModuleId;
            }
        },
        async load(id) {
            if (id === resolvedVirtualModuleId) {
                return `export const metadata = ${JSON.stringify(await getMetadata())};`;
            }
        },
        configureServer(server) {
            server.watcher.on('change', async (path) => {
                if (!path.startsWith(svgdir) || !path.endsWith('.svg')) return;
                const mod = server.moduleGraph.getModuleById(resolvedVirtualModuleId);
                if (!mod) return;
                server.moduleGraph.invalidateModule(mod);
            });
        }
    };
}
