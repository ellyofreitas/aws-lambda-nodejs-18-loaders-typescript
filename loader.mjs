import path from 'node:path';
import { cwd } from 'node:process';
import { pathToFileURL } from 'node:url';
import { readdir } from 'node:fs/promises';
import { isBuiltin, builtinModules } from 'node:module';

import { resolvePath } from 'mlly';
import { transform } from 'esbuild';

import tsconfig from './tsconfig.json' assert { type: 'json' };

const basePath = path.join(cwd(), '/');
const baseURL = pathToFileURL(basePath);

const tsExts = new Set(['.ts', '.mts', '.cts', '.tsx']);
const jsExts = new Set(['.js', '.mjs', '.cjs']);

const { paths = {} } = tsconfig?.compilerOptions;

const moduleAlias = new Map(
  Object.entries(paths).map(([key, value]) => [
    key.replace('/*', ''),
    value[0].replace('/*', ''),
  ])
);

const outDir = path.resolve(basePath, tsconfig.compilerOptions.baseUrl);

const isDir = (specifier) => path.extname(specifier) === '';

const resolvePathModule = async (specifier, options) => {
  const resolved = await resolvePath(specifier, options);
  if (!isDir(resolved)) return resolved;
  const files = await readdir(resolved);
  const indexName = files.find((file) => file.startsWith('index'));
  return path.join(resolved, indexName);
};

const replaceAlias = (specifier) =>
  Array.from(moduleAlias).reduce((customSpecifier, [alias, aliasRelative]) => {
    if (!customSpecifier.match(alias)) return customSpecifier;
    return customSpecifier.replace(alias, path.join(outDir, aliasRelative));
  }, specifier);

export async function resolve(specifier, context, nextResolve) {
  const { parentURL = baseURL } = context;
  if (isBuiltin(specifier)) return nextResolve(specifier, context);
  const customSpecifier = replaceAlias(specifier);
  let modulePath = await resolvePathModule(customSpecifier, {
    url: parentURL,
    extensions: [...Array.from(tsExts), ...Array.from(jsExts)],
  });
  const { url } = await nextResolve(pathToFileURL(modulePath).href, context);
  const format = tsExts.has(path.extname(url)) ? 'typescript' : undefined;
  return { format, shortCircuit: true, url };
}

export async function load(url, context, nextLoad) {
  if (context.format !== 'typescript') return nextLoad(url, context);
  const { source } = await nextLoad(url, { ...context, format: 'module' });
  const rawSource = source.toString('utf-8');
  const { code: transpiledSource } = await transform(rawSource, {
    format: 'esm',
    loader: 'ts',
    sourcemap: 'inline',
    target: 'esnext',
  });
  return {
    format: 'module',
    shortCircuit: true,
    source: transpiledSource,
  };
}
