const fs = require('fs');
const path = require('path');

const rootDir = process.env.PWD;
const extDir = path.join(rootDir, 'externals');

const nxSource = JSON.parse(
  fs.readFileSync(path.join(rootDir, 'nx.json'), 'utf-8')
);
const wsSource = JSON.parse(
  fs.readFileSync(path.join(rootDir, 'workspace.json'), 'utf-8')
);
const tsSource = JSON.parse(
  fs.readFileSync(path.join(rootDir, 'tsconfig.base.json'), 'utf-8')
);

const externals = process.argv.slice(2);
//const externals = nxSource.externals

if (externals.length && !fs.existsSync(extDir)) fs.mkdirSync(extDir);

externals.forEach((tag) => {
  const nx = { ...nxSource };
  const ws = { ...wsSource };
  const ts = { ...tsSource };
  const projects = {};

  // Determine projects to include
  Object.entries(nx.projects).forEach(([k, v]) => {
    if (v.tags.includes(tag)) projects[k] = '';
  });

  // Prepare nx.json
  nx.projects = Object.keys(nx.projects)
    .filter((key) => Object.keys(projects).includes(key))
    .reduce((obj, key) => {
      obj[key] = nx.projects[key];
      return obj;
    }, {});

  // Prepare workspace.json
  ws.projects = Object.keys(ws.projects)
    .filter((key) => Object.keys(projects).includes(key))
    .reduce((obj, key) => {
      obj[key] = ws.projects[key];
      projects[key] = ws.projects[key].root.replace(/\/$/, '').concat('/');
      return obj;
    }, {});

  // Prepare tsconfig.base.json
  const paths = new RegExp(`^(${Object.values(projects).join('|')})`);
  ts.compilerOptions.paths = Object.entries(ts.compilerOptions.paths)
    .filter(([k, v]) => v.filter((path) => paths.test(path)).length == v.length)
    .reduce((obj, [k, v]) => {
      obj[k] = ts.compilerOptions.paths[k];
      return obj;
    }, {});

  // Save files
  const dir = path.join(extDir, tag);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  fs.writeFileSync(path.join(dir, 'nx.json'), JSON.stringify(nx, null, 2));
  fs.writeFileSync(
    path.join(dir, 'workspace.json'),
    JSON.stringify(ws, null, 2)
  );
  fs.writeFileSync(
    path.join(dir, 'tsconfig.base.json'),
    JSON.stringify(ts, null, 2)
  );
});
