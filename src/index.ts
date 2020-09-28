import { DefinePlugin, Compiler } from 'webpack';
import path from 'path';
import fg from 'fast-glob'
import fs from 'fs-extra';

type DefinitionKeyValue = {[key: string]: DefinePlugin.CodeValueObject};

interface Options {
  baseDir: string;
  chunkPrefix?: string;
  importPrefix?: string;
  outputDir: string;
}

export default class Vue3AutoRouteRecord extends DefinePlugin {
  options: Options;

  /**
   *
   */
  constructor(options: Options) {
    super(options as unknown as DefinitionKeyValue);
    this.options = options;

    if (typeof options.baseDir !== 'string') throw new Error('baseDir parameter required')
    if (typeof options.outputDir !== 'string') throw new Error('outputDir parameter required')
  }

  apply(compiler: Compiler) {
    const chunkPrefix = this.options.chunkPrefix || ''
    const importPrefix = this.options.importPrefix || ''

    compiler.hooks.entryOption.tap('Vue3AutoRouteRecord', () => {
      const files = getRoutableFiles(this.options.baseDir);
      const obj = getRouteObjects(files);
      const routes = makeRouteString(obj, chunkPrefix, importPrefix);

      const outputDir = this.options.outputDir;
      fs.outputFileSync(path.join(outputDir, 'routes.ts'), routes);
    })
  }
}

export interface RouteObject {
  real: string;
  path: string;
  name: string;
}

export function getRoutableFiles(baseDir: string, ext: string = 'vue') {
  const relativePath = path.join(path.relative('.', baseDir), '/');
  return fg.sync(path.join(baseDir, '**', '*.' + ext), { unique: true })
    .filter(x => x.indexOf(relativePath) === 0)
    .map(x => x.replace(relativePath, ''));
}

export function getRouteObjects(files: string[]) {
  return files.map(file => {
    let path;

    let filename = file.substr(0, file.lastIndexOf('.'));
    const name = filename.replace(/\//g, '-');
    const real = file;

    if (/index$/.test(filename.toLowerCase())) {
      path = '/' + filename.substr(0, filename.lastIndexOf('/'));
    } else {
      path = '/' + filename;
    }

    path = path.toLowerCase()

    return { real, name, path }
  })
}

export function makeRouteString(routeObject: RouteObject[], chunkPrefix: string, importPrefix: string) {
  const routes = routeObject.map(x =>
`  {
    component: () => import(/* webpackChunkName: "${chunkPrefix}${x.name}" */ '${importPrefix}${x.real}'),
    name: '${x.name}',
    path: '${x.path}'
  }`).join(',\n')

  return `const routes = [\n${routes}\n]\nexport default routes`
}
