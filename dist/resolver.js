'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (lib, moduleName) {
  const map = getCache(lib);
  return map[moduleName];
};

var _dependencyTree = require('dependency-tree');

var _dependencyTree2 = _interopRequireDefault(_dependencyTree);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const cache = {};

function getCache(lib) {
  if (cache[lib]) return cache[lib];

  const dir = `${process.cwd()}/node_modules/${lib}`;
  const { main } = require(`${dir}/package.json`);

  const list = _dependencyTree2.default.toList({
    filename: `${dir}/${main}`,
    directory: 'node-modules',
    filter: path => path.indexOf(`node_modules/${lib}`) !== -1
  });

  const map = list.reduce((acc, item) => {
    const moduleName = item.substring(item.lastIndexOf('/') + 1, item.lastIndexOf('.js'));
    const path = item.substring(item.lastIndexOf(`/${lib}`) + 1, item.lastIndexOf('.js'));
    acc[moduleName] = path;
    return acc;
  }, {});

  cache[lib] = map;
  return map;
}