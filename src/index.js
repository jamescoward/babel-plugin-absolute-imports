import resolver from './resolver';

export default ({ types: t }) => {
  const importVisitors = {
    ImportDeclaration(path, state) {
      const lib = state.opts.lib;
      const libNode = path.node.source
      if(!(t.isStringLiteral(libNode) && libNode.value === lib)) {
        return;
      }
      path.get('specifiers').forEach((spec) => {
        // get the local binding incase it is a { foo as bar } import
        const name = spec.get('local').node.name;
        const identifier = t.identifier(name);
        const importDefaultSpecifier = t.importDefaultSpecifier(identifier);
        const pathToImport = resolver(lib, name);
        const importDeclaration = t.importDeclaration([importDefaultSpecifier], t.stringLiteral(pathToImport));
        path.insertBefore(importDeclaration);
      });

      path.remove();
    },
  };

  return {
    visitor: {
      Program: {
        exit(programPath, state) {
          programPath.traverse(importVisitors, state);
        },
      },
    },
  };
};