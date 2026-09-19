import {copyFile,mkdir,writeFile} from 'node:fs/promises';
import {referenceHtml,documentHtml,initialConfig} from '../demo/templates.ts';
await mkdir('public/lib',{recursive:true});
for (const name of ['index.js','index.d.ts','react.js','react.d.ts','README.md','LICENSE','package.json']) {
 try { await copyFile(`packages/imessage-html-recreation/${name}`,`public/lib/${name}`); }
 catch(e){if(e.code!=='ENOENT')throw e;}
}
await mkdir('public/examples',{recursive:true});
for (const kind of ['messages','conversation','keyboard'])await writeFile(`public/examples/${kind}.html`,referenceHtml(kind));
await writeFile('public/examples/two-messages.html',documentHtml({...initialConfig,header:false,statusBar:false,composer:false,thread:false,messages:[{id:'1',direction:'received',text:'How much do we owe you?'},{id:'2',direction:'sent',text:'$17.64 each!',status:'Read 12:53 PM'}]}));
console.log('Library and executable reference fixtures prepared.');
