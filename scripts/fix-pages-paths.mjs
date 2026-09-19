import {readdir,readFile,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
const root='out',prefix='/imessage-html-recreation';
const paths=['/editor','/downloads','/avatars','/verification','/references','/lib','/examples','/favicon.svg'];
async function visit(dir){for(const entry of await readdir(dir,{withFileTypes:true})){const file=join(dir,entry.name);if(entry.isDirectory())await visit(file);else if(/\.(?:html|js|css|json)$/.test(entry.name)){let source=await readFile(file,'utf8');source=source.replaceAll('href="/"',`href="${prefix}/"`);for(const path of paths)source=source.replaceAll(path,prefix+path);await writeFile(file,source);}}}
await visit(root);await writeFile(join(root,'.nojekyll'),'');
