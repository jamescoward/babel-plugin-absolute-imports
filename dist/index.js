'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _resolver = require('./resolver');

var _resolver2 = _interopRequireDefault(_resolver);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = ({ types: t }) => {
  const importVisitors = {
    ImportDeclaration(path, state) {
      const lib = state.opts.lib;
      const libNode = path.node.source;
      if (!(t.isStringLiteral(libNode) && libNode.value === lib)) {
        return;
      }
      path.get('specifiers').forEach(spec => {
        // get the local binding incase it is a { foo as bar } import
        const name = spec.get('local').node.name;
        const identifier = t.identifier(name);
        const importDefaultSpecifier = t.importDefaultSpecifier(identifier);
        const pathToImport = (0, _resolver2.default)(lib, name);
        const importDeclaration = t.importDeclaration([importDefaultSpecifier], t.stringLiteral(pathToImport));
        path.insertBefore(importDeclaration);
      });

      path.remove();
    }
  };

  return {
    visitor: {
      Program: {
        exit(programPath, state) {
          programPath.traverse(importVisitors, state);
        }
      }
    }
  };
};