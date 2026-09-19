import {appendFileSync} from 'node:fs';
import pkg from '../packages/imessage-html-recreation/package.json' with {type:'json'};
if (!/^\d+\.\d+\.\d+$/.test(pkg.version)) throw new Error(`Stable semver required; received ${pkg.version}`);
const response=await fetch(`https://registry.npmjs.org/${encodeURIComponent(pkg.name)}/${encodeURIComponent(pkg.version)}`);
if (!response.ok && response.status!==404) throw new Error(`npm registry returned ${response.status}`);
const publish=response.status===404;
if(process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT,`publish=${publish}\nversion=${pkg.version}\n`);
console.log(publish?`${pkg.name}@${pkg.version} is new.`:`${pkg.name}@${pkg.version} already exists; publish skipped.`);
