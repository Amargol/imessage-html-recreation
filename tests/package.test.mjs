import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {bubblePath,register,ready} from '../packages/imessage-html-recreation/index.js';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {Conversation,Bubble,Header,Composer} from '../packages/imessage-html-recreation/react.js';

test('package can be imported in Node without a DOM',async()=>{assert.doesNotThrow(register);await ready();});
test('bubble outline remains finite at small and large supported dimensions',()=>{for(const size of [[24,40],[246,460],[320,40],[2,2]]){const path=bubblePath(...size);assert.ok(path.startsWith('M '));assert.ok(path.endsWith(' Z'));assert.doesNotMatch(path,/NaN|Infinity/);}});
test('tail-free outline never extends below the body',()=>{const path=bubblePath(100,40,{tail:false});const coordinates=path.match(/-?\d+(?:\.\d+)?/g).map(Number);for(let i=1;i<coordinates.length;i+=2)assert.ok(Number.isFinite(coordinates[i]));assert.notEqual(path,bubblePath(100,40));});
test('React SSR preserves escaped text and explicit false attributes',()=>{const html=renderToStaticMarkup(createElement(Conversation,{theme:'light'},createElement(Header,{slot:'header',name:'Alex',back:false,video:false}),createElement(Bubble,{direction:'received',tail:false},'<script>alert(1)</script>'),createElement(Composer,{slot:'composer',plus:false,onSend:()=>{}})));assert.match(html,/back="false"/);assert.match(html,/tail="false"/);assert.match(html,/plus="false"/);assert.match(html,/&lt;script&gt;/);assert.doesNotMatch(html,/onSend=/);});
test('browser distribution matches the library source exactly',async()=>{assert.equal(await readFile('packages/imessage-html-recreation/index.js','utf8'),await readFile('public/lib/index.js','utf8'));});
