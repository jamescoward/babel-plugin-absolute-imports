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
        const localName = spec.get('local').node.name;
        const name = spec.get('imported').node.name;
        const identifier = t.identifier(localName);
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