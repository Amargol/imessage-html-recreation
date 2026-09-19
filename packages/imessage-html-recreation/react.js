'use client';
import {createElement,forwardRef,useEffect,useRef} from 'react';
const eventMap={onSend:'send',onBack:'back',onProfile:'profile',onVideo:'video',onAdd:'add',onMicrophone:'microphone',onKey:'key',onKeyboardAction:'keyboard-action'};
function component(tag){return forwardRef(function IMessageComponent(props,ref){
 const local=useRef(null),attrs={};
 for(const[k,v]of Object.entries(props)){if(k==='children'||k in eventMap)continue;attrs[k]=typeof v==='boolean'?String(v):v;}
 useEffect(()=>{void import('./index.js');},[]);
 useEffect(()=>{const el=local.current;if(!el)return;const listeners=[];for(const[prop,event]of Object.entries(eventMap)){if(typeof props[prop]!=='function')continue;const handler=e=>props[prop](e.detail,e);el.addEventListener(`imessage:${event}`,handler);listeners.push([`imessage:${event}`,handler]);}return()=>listeners.forEach(([event,handler])=>el.removeEventListener(event,handler));},[props]);
 attrs.ref=node=>{local.current=node;if(typeof ref==='function')ref(node);else if(ref)ref.current=node;};
 return createElement(tag,attrs,props.children);
});}
export const Conversation=component('imessage-conversation');
export const Bubble=component('imessage-bubble');
export const Header=component('imessage-header');
export const Composer=component('imessage-composer');
export const Timestamp=component('imessage-timestamp');
export const Thread=component('imessage-thread');
export const StatusBar=component('imessage-status-bar');
export const Keyboard=component('imessage-keyboard');

export const Viewport=component('imessage-viewport');
