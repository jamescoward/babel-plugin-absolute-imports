import dependencyTree from 'dependency-tree';

const cache = {};

function getCache(lib) {
  if(cache[lib]) return cache[lib];

  const dir = `${process.cwd()}/node_modules/${lib}`;
  const { main } = require(`${dir}/package.json`);
  
  const list = dependencyTree.toList({
    filename: `${dir}/${main}`,
    directory: 'node-modules',
    filter: path => path.indexOf(`node_modules/${lib}`) !== -1,
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

export default function (lib, moduleName) {
  const map = getCache(lib);
  return map[moduleName];
}
