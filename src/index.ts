import { DefinePlugin, Compiler } from 'webpack';

type DefinitionKeyValue = {[key: string]: DefinePlugin.CodeValueObject};

export default class DemoPlugin extends DefinePlugin  {
  /**
   *
   */
  constructor(definitions: DefinitionKeyValue) {
    super(definitions);
    this.options = definitions;
  }

  options: {};

  apply(compiler: Compiler) {
    compiler.hooks.done.tap('DemoPlugin', () => {
      console.log('\nHello world in typescript\n');
    });
  }
}
