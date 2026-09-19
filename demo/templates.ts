export type Message = { id:string; direction:'received'|'sent'; text:string; status?:string; timestamp?:string; width?:string; tail?:boolean; group?:'first'|'middle'|'last' };
export type Config = { clock:boolean;signal:boolean;wifi:boolean;battery:boolean;timestamp:boolean;dateLabel:string;scrollable:boolean;viewportHeight:number;name:string; unread:string; showUnread:boolean; time:string; island:boolean; microphone:boolean; avatarUrl:string; avatar:boolean; header:boolean; back:boolean; video:boolean; composer:boolean; plus:boolean; keyboard:boolean; statusBar:boolean; tails:boolean; receipt:boolean; thread:boolean; theme:'dark'|'light'; background:string; sent:string; received:string; fontSize:number; maxWidth:number; messages:Message[] };
export const receiptText=`ID Cafe - Berkeley

⭐ Arul:
Karaikudi Goat Keema
Dosa (Halal) - $17.00
Plain Idly - $9.50
99.25 Buttermilk - $5.00
Tax (10.25%) - $3.23
Total - $34.73

⭐ Shreyas:
Vijayawada Chicken
Keema Dosa (Halal) - $16.00
Tax (10.25%) - $1.64
Total - $17.64

✨ Summary:
Subtotal: $47.50
Tax (10.25%): $4.87
Total Bill: $52.37

📱 TallySplit App`;
export const initialConfig:Config={clock:true,signal:true,wifi:true,battery:true,timestamp:false,dateLabel:'Today 12:53 PM',scrollable:false,viewportHeight:956,name:'Alex',unread:'477',showUnread:true,time:'12:56',island:true,microphone:true,avatarUrl:'',avatar:true,header:true,back:true,video:true,composer:true,plus:true,keyboard:false,statusBar:true,tails:true,receipt:true,thread:true,theme:'dark',background:'#000000',sent:'#2995ff',received:'#262628',fontSize:17,maxWidth:78,messages:[{id:'one',direction:'received',text:'How much do we owe you?'},{id:'two',direction:'sent',text:receiptText,status:'Read 12:53 PM'}]};
export const escapeHtml=(s:string)=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
export function content(s:string){return escapeHtml(s).replace(/(\$\d+(?:\.\d{2})?)/g,'<u>$1</u>').replace(/(⭐|✨|📱)/gu,'<span class="emoji">$1</span>');}
const avatar=`<div slot="avatar" class="reference-avatar" aria-label="Fictional contact portrait"></div>`;
export function markup(c:Config,{reference=false}:{reference?:boolean}={}){
 const attrs=`theme="${c.theme}" scrollable="${c.scrollable}" style="--im-height:${c.viewportHeight}px;--im-background:${c.background};--im-sent-top:${c.sent};--im-sent-bottom:${c.sent==='#2995ff'?'#078fff':c.sent};--im-received:${c.received};--im-font-size:${c.fontSize}px;--im-line-height:${(c.fontSize*20/17).toFixed(2)}px;--im-max-width:${c.maxWidth}%"`;
 const bubbles=c.messages.map((m,i)=>` ${m.timestamp?`<imessage-timestamp>${escapeHtml(m.timestamp)}</imessage-timestamp>`:''}<imessage-bubble direction="${m.direction}"${m.width?` width="${escapeHtml(m.width)}"`:reference&&m.direction==='sent'&&m.text===receiptText?' width="246px"':''}${c.receipt&&m.status?` status="${escapeHtml(m.status)}"`:''} tail="${c.tails&&(m.tail!==false)}"${m.group?` group="${m.group}"`:''}>${content(m.text)}</imessage-bubble>`);
 const messages=c.thread&&bubbles.length>1?`${bubbles[0]}\n<imessage-thread>${bubbles.slice(1).join('\n')}</imessage-thread>`:bubbles.join('\n');
 return `<imessage-conversation ${attrs}>
${c.statusBar?`<imessage-status-bar slot="status-bar" time="${escapeHtml(c.time)}" island="${c.island}" clock="${c.clock}" signal="${c.signal}" wifi="${c.wifi}" battery="${c.battery}"></imessage-status-bar>`:''}
${c.header?`<imessage-header slot="header" name="${escapeHtml(c.name)}" photo="${c.avatar}" back="${c.back}" video="${c.video}" unread="${c.showUnread?escapeHtml(c.unread):''}"${c.avatar&&c.avatarUrl?` avatar="${escapeHtml(c.avatarUrl)}"`:''}>${c.avatar&&!c.avatarUrl?avatar:''}</imessage-header>`:''}
${c.timestamp?`<imessage-timestamp>${escapeHtml(c.dateLabel)}</imessage-timestamp>`:''}
${messages}
${c.composer?`<imessage-composer slot="composer" plus="${c.plus}" microphone="${c.microphone}"></imessage-composer>`:''}
${c.keyboard?'<imessage-keyboard slot="keyboard"></imessage-keyboard>':''}
</imessage-conversation>`;
}
export const frameStyle=`html,body{margin:0;padding:0;background:#000}body{width:440px;color:white;position:relative}*{box-sizing:border-box}.reference-avatar{width:60px;height:60px;border-radius:50%;background-image:url('/avatars/alex.png');background-size:cover;background-position:center}imessage-bubble .emoji{font-size:21px;line-height:0;vertical-align:-1px}imessage-bubble u{text-decoration-color:#ffffff70;text-decoration-thickness:1px;text-underline-offset:3px}imessage-header[slot=header]{z-index:4}#local-feedback{position:fixed;bottom:12px;left:50%;transform:translateX(-50%);background:#333e;color:#fff;border:1px solid #7775;border-radius:20px;padding:9px 15px;font:13px -apple-system,Arial;z-index:20;white-space:nowrap}#local-feedback:empty{display:none}`;
export const frameScript=`const c=document.querySelector('imessage-conversation');c?.addEventListener('imessage:send',e=>{const b=document.createElement('imessage-bubble');b.setAttribute('direction','sent');b.setAttribute('status','Delivered');b.textContent=e.detail.text;c.append(b);});for(const action of ['back','video','profile','add','microphone','keyboard-action'])c?.addEventListener('imessage:'+action,()=>{const f=document.getElementById('local-feedback');f.textContent=action==='back'?'Back button clicked':action==='profile'?'Profile button clicked':action==='add'?'Attachment button clicked':action==='video'?'Video button clicked':'Audio / keyboard action';clearTimeout(window.feedbackTimer);window.feedbackTimer=setTimeout(()=>f.textContent='',1800);});`;
export function documentHtml(c:Config,libraryUrl='/lib/index.js'){return `<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>iMessage conversation</title><style>${frameStyle}${!c.avatar?'imessage-header::part(avatar){display:none}imessage-header{height:48px}':''}</style><script type="module" src="${libraryUrl}"></script></head><body style="background:${c.background}">${markup(c)}<output id="local-feedback" aria-live="polite"></output><script>${frameScript}</script></body></html>`;}
export function referenceHtml(kind:string,override?:Config){
 const status=kind!=='messages',keyboard=kind==='keyboard';
 const c=override||{...initialConfig,header:status,statusBar:status,composer:status,keyboard};
 let body=markup(c,{reference:true});if(keyboard)body=body.replace('time="12:56"','time="12:57"');
 if(status){const previous=`<imessage-bubble class="previous" direction="sent" width="246px">${content(receiptText)}</imessage-bubble>`;
 body=body.replace('<imessage-conversation ',previous+'<imessage-conversation ');
 if(!keyboard)body=body.replace('<imessage-bubble direction="received"','<imessage-timestamp>Today 12:53 PM</imessage-timestamp><imessage-bubble direction="received"');}
 // A single scrim spans both chrome rows so the status/header boundary never forms a band.
 const chrome= status&&(c.header||c.statusBar)?`imessage-conversation::before{content:"";position:absolute;inset:0 0 auto;height:${c.header?190:88}px;z-index:3;pointer-events:none;background:linear-gradient(to bottom,${c.background}e8 0%,${c.background}c4 30%,${c.background}80 61%,${c.background}00 100%)}`:'';
 const css=kind==='messages'?`body{height:554.333px;overflow:hidden}imessage-conversation{--im-inset-top:10px;--im-inset-bottom:0px}`:keyboard?`body{height:956px;overflow:hidden}.previous{display:none}imessage-conversation{height:956px;--im-inset-top:8px;--im-inset-bottom:0px}imessage-status-bar{position:absolute;top:0;width:100%;z-index:5}imessage-header{position:absolute;top:58px;width:100%}imessage-composer{position:absolute;top:543px;width:100%;--im-composer-inset:20px}imessage-keyboard{position:absolute;top:611px;width:100%;height:345px}imessage-thread{position:relative}imessage-bubble[direction=received]{opacity:.38}`:`body{height:956px;overflow:hidden}.previous{position:absolute;top:-152.7px;right:20px;width:246px;max-width:none;z-index:0}imessage-conversation{height:956px;--im-inset-top:307.333px;--im-inset-bottom:0px;background:transparent;z-index:1}imessage-timestamp{margin-top:12px;margin-bottom:8px}imessage-status-bar{position:absolute;top:0;width:100%;z-index:5}imessage-header{position:absolute;top:58px;width:100%}imessage-composer{position:absolute;top:875px;width:100%;--im-composer-inset:28px}`;
 return `<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${kind} reference recreation</title><style>${frameStyle}${css}${chrome}${!c.avatar?'imessage-header::part(avatar){display:none}':''}</style><script type="module" src="/lib/index.js"></script></head><body>${body}</body></html>`;
}
