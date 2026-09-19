/** imessage-html-recreation · MIT · No runtime dependencies. */
const Base = typeof HTMLElement === 'undefined' ? class {} : HTMLElement;
const font = `font-family:var(--im-font,-apple-system,BlinkMacSystemFont,"Helvetica Neue",Arial,sans-serif);font-size:var(--im-font-size,17px);font-weight:400;line-height:var(--im-line-height,20px);letter-spacing:var(--im-letter-spacing,-.05px);-webkit-font-smoothing:antialiased;`;
const reset = `:host{box-sizing:border-box;${font}}*{box-sizing:border-box}button,input{font:inherit}button{cursor:pointer}button:focus-visible,input:focus-visible{outline:2px solid #0a84ff;outline-offset:3px}svg{display:block}button{color:inherit}:host([hidden]){display:none!important}@supports(font:-apple-system-body){:host{letter-spacing:var(--im-letter-spacing,-.35px)}}`;
const svg = (body,view='0 0 24 24') => `<svg viewBox="${view}" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
const icons = {
 back:svg('<path d="m15 3-9 9 9 9"/>'),chevron:svg('<path d="m9 5 7 7-7 7"/>'),
 plus:svg('<path d="M12 4v16M4 12h16"/>'),
 mic:svg('<rect x="9" y="2" width="6" height="13" rx="3"/><path d="M5.5 10v2a6.5 6.5 0 0 0 13 0v-2M12 18.5V22M8 22h8"/>'),
 video:svg('<rect x="2" y="5" width="14" height="14" rx="2.5"/><path d="m16 10 6-4v12l-6-4"/>'),
 send:svg('<path d="M12 20V4m-6 6 6-6 6 6"/>'),
 shift:svg('<path d="m3 12 9-9 9 9h-5v9H8v-9Z"/>'),
 delete:svg('<path d="m3 12 6-8h12v16H9Z"/><path d="m11 8 7 8m0-8-7 8"/>'),
 enter:svg('<path d="M20 4v8H4m6-6-6 6 6 6"/>'),
 globe:svg('<circle cx="12" cy="12" r="10"/><ellipse cx="12" cy="12" rx="4" ry="10"/><path d="M2 12h20M4 6.5h16M4 17.5h16"/>'),
 wifi:svg('<path d="M2 8a15 15 0 0 1 20 0M5.5 11.5a10 10 0 0 1 13 0M9 15a5 5 0 0 1 6 0"/><circle cx="12" cy="18" r=".7" fill="currentColor"/>')
};
function emit(el,name,detail={}){el.dispatchEvent(new CustomEvent(`imessage:${name}`,{detail,bubbles:true,composed:true}));}
function setup(el,css,html){el.attachShadow({mode:'open'}).innerHTML=`<style>${reset}${css}</style>${html}`;}
function text(el,selector,value){el.shadowRoot.querySelector(selector).textContent=value;}
function on(el,name,fn){el.shadowRoot.addEventListener('click',e=>{if(e.target.closest(`[data-action="${name}"]`))fn(e)});}

/** Continuous bubble outline. Tail is part of the same path: no background-colored cutout. */
export function bubblePath(width,height,{tail=true,radius=22}={}){
 const w=Math.max(1,width),h=Math.max(1,height),r=Math.min(radius,w/2,h/2),k=.27;
 const top=`M ${r} 0 H ${w-r} C ${w-r*k} 0 ${w} ${r*k} ${w} ${r} V ${h-r}`;
 const end=tail
  ? `C ${w} ${h-10} ${w-5} ${h-7} ${w-9} ${h-3} C ${w-13} ${h+1} ${w-10} ${h+4} ${w-8.5} ${h+6} C ${w-5} ${h+8} ${w-12} ${h+6} ${w-16} ${h+4} L ${w-22} ${h} H ${r}`
  : `C ${w} ${h-r*k} ${w-r*k} ${h} ${w-r} ${h} H ${r}`;
 return `${top} ${end} C ${r*k} ${h} 0 ${h-r*k} 0 ${h-r} V ${r} C 0 ${r*k} ${r*k} 0 ${r} 0 Z`;
}

export class IMessageBubble extends Base {
 static observedAttributes=['direction','tail','status','width','group'];
 constructor(){super();setup(this,`
 :host{display:block;position:relative;width:fit-content;max-width:var(--im-max-width,78%);margin:0 auto var(--im-message-gap,10px) 0;color:var(--im-incoming-text,#fff)}
 :host([direction="sent"]){font-size:calc(var(--im-font-size,17px) * 1.029411765);letter-spacing:var(--im-sent-letter-spacing,-.35px);margin-left:auto;margin-right:0;color:var(--im-outgoing-text,#fff)}
 :host([group="middle"]),:host([group="first"]){margin-bottom:3px}
 .bubble{position:relative;padding:calc(var(--im-padding-y,10px) + 1px) var(--im-padding-x,14px) calc(var(--im-padding-y,10px) - 1px);min-height:40px;overflow-wrap:anywhere}
 .shape{position:absolute;inset:0;width:100%;height:100%;overflow:visible;pointer-events:none;z-index:0}
 .shape path{fill:var(--im-received,#262628)}
 :host([direction="received"]) .shape,:host(:not([direction])) .shape{transform:scaleX(-1)}
 :host([direction="sent"]) .shape path{fill:url(#sent)}
 .copy{position:relative;white-space:pre-wrap;z-index:1}
 ::slotted(a),::slotted(u){color:inherit;text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:3px;text-decoration-color:rgba(255,255,255,.48)}
 .status{color:var(--im-muted,#8e8e93);font-size:11px;line-height:14px;text-align:right;padding:6px 20px 0 0;letter-spacing:0;white-space:nowrap}.status strong{font-weight:600}.status:empty{display:none}@supports(font:-apple-system-body){:host([direction="sent"]){font-size:var(--im-font-size,17px);letter-spacing:var(--im-sent-letter-spacing,-.35px)}}
 `,`<div class="bubble" part="bubble"><svg class="shape" aria-hidden="true"><defs><linearGradient id="sent" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--im-sent-top,#2995ff)"/><stop offset="1" style="stop-color:var(--im-sent-bottom,#078fff)"/></linearGradient></defs><path/></svg><div class="copy" part="text"><slot></slot></div></div><div class="status" part="status"></div>`);
 this._resize=new ResizeObserver(()=>this.refresh());
 this.shadowRoot.querySelector('slot').addEventListener('slotchange',()=>this.refresh());}
 connectedCallback(){this._resize.observe(this.shadowRoot.querySelector('.bubble'));this.sync();if(this.hasAttribute('entrance')&&this.getAttribute('entrance')!=='false')this._entryFrame=requestAnimationFrame(()=>this.reveal());}
 disconnectedCallback(){this._resize.disconnect();cancelAnimationFrame(this._entryFrame);this._entryAnimations?.forEach(animation=>animation.cancel());}
 attributeChangedCallback(){if(this.shadowRoot)this.sync();}
 sync(){const w=this.getAttribute('width');this.style.width=w&&CSS.supports('width',w)?w:'';const status=this.shadowRoot.querySelector('.status');status.replaceChildren();const value=this.getAttribute('status')||'';if(value.startsWith('Read ')){const label=document.createElement('strong');label.textContent='Read';status.append(label,document.createTextNode(value.slice(4)));}else status.textContent=value;this.refresh();}
 /** Animate a newly inserted message without changing its final layout or text metrics. */
 reveal(){
  this._entryAnimations?.forEach(animation=>animation.cancel());
  if(!this.isConnected||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const bubble=this.shadowRoot.querySelector('.bubble'),status=this.shadowRoot.querySelector('.status');
  const sent=this.getAttribute('direction')==='sent',height=this.offsetHeight;
  if(!height)return;
  const timing={duration:420,easing:'cubic-bezier(.18,.78,.24,1)',fill:'none'};
  bubble.style.transformOrigin=sent?'right bottom':'left bottom';
  this._entryAnimations=[
   this.animate([{height:'0px',marginBottom:'0px'},{height:`${height}px`,marginBottom:getComputedStyle(this).marginBottom}],timing),
   bubble.animate([{transform:`translate(${sent?12:-6}px, ${sent?30:16}px) scale(${sent?.86:.9})`,opacity:0},{opacity:1,offset:.22},{transform:'translate(0, 0) scale(1)',opacity:1}],timing),
   status.animate([{opacity:0},{opacity:1}],{duration:180,delay:300,fill:'backwards'})
  ];
 }
 refresh(){const b=this.shadowRoot.querySelector('.bubble'),w=b.offsetWidth,h=b.offsetHeight;if(!w||!h)return;const tail=this.getAttribute('tail')!=='false'&&!['first','middle'].includes(this.getAttribute('group'));const radius=parseFloat(getComputedStyle(this).getPropertyValue('--im-radius'))||22;this.shadowRoot.querySelector('path').setAttribute('d',bubblePath(w,h,{tail,radius}));}
}

export class IMessageConversation extends Base {
 static observedAttributes=['theme','scrollable'];
 constructor(){super();setup(this,`
 :host{display:block;position:relative;isolation:isolate;background:var(--im-background,#000);color:#fff;width:100%;overflow:hidden;--im-received:#262628;--im-muted:#8e8e93}
 :host([theme="light"]){--im-background:#fff;--im-received:#e9e9eb;--im-incoming-text:#111;--im-muted:#8a8a8e;--im-glass:rgba(245,245,247,.78);--im-chrome-text:#111;--im-input:#f5f5f5;--im-input-border:#d1d1d6;color:#111}
 .messages{padding:var(--im-inset-top,12px) var(--im-inset-x,20px) var(--im-inset-bottom,12px);min-height:0}
 ::slotted(imessage-header),::slotted(imessage-status-bar),::slotted(imessage-composer),::slotted(imessage-keyboard){display:block;flex-shrink:0}
 :host([scrollable="true"]){display:flex;flex-direction:column;height:var(--im-height,844px)}
 :host([scrollable="true"]) .messages{flex:1;overflow-y:auto;overscroll-behavior:contain;scrollbar-width:thin}
 
 `,`<slot name="status-bar"></slot><slot name="header"></slot><div class="messages" part="messages"><slot></slot></div><slot name="composer"></slot><slot name="keyboard"></slot>`);
 this.shadowRoot.querySelector('.messages slot').addEventListener('slotchange',()=>{if(this.getAttribute('scrollable')==='true')requestAnimationFrame(()=>this.scrollToEnd());});
 this.addEventListener('imessage:key',e=>{const c=this.querySelector('imessage-composer');if(!c)return;const input=c.shadowRoot.querySelector('input');const key=e.detail.key;if(key==='Enter'){c.submit();return;}input.value=key==='Backspace'?input.value.slice(0,-1):input.value+key;c.update();});}
 scrollToEnd(){const messages=this.shadowRoot.querySelector('.messages');messages.scrollTop=messages.scrollHeight;}
}

export class IMessageHeader extends Base {
 static observedAttributes=['name','avatar','photo','back','video','unread'];
 constructor(){super();setup(this,`
 :host{display:block;height:100px;position:relative;color:var(--im-chrome-text,#fff)}:host([photo="false"]){height:48px}:host([photo="false"]) .avatar{display:none}:host([photo="false"]) .name{margin-top:3px}
 .row{height:100%;position:relative;padding:4px 20px;display:flex;justify-content:space-between;align-items:flex-start}
 button{border:1px solid rgba(255,255,255,.17);background:var(--im-glass,rgba(40,40,40,.76));backdrop-filter:blur(18px) saturate(1.4);box-shadow:inset 0 0 1px 1px rgba(255,255,255,.06);padding:0;display:flex;align-items:center;justify-content:center}
 .back{gap:3px;border-radius:24px;min-width:40px;height:44px;padding:0 9px 0 5px}.back svg{width:24px;height:24px;stroke-width:2.1}.badge{background:#f5f5f5;color:#252525;font-size:13px;font-weight:600;line-height:20px;border-radius:14px;padding:0 7px}
 .contact{position:absolute;left:50%;top:4px;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center}
 .avatar{width:60px;height:60px;border-radius:50%;overflow:hidden;display:grid;place-items:center;background:linear-gradient(#aaa,#777);font-size:25px;font-weight:500;color:#fff}.avatar img{width:100%;height:100%;object-fit:cover}.avatar ::slotted(img){width:60px;height:60px;object-fit:cover}
 .name{border-radius:20px;min-height:31px;margin-top:-4px;padding:2px 10px 3px 13px;font-size:17px;font-weight:600;letter-spacing:-.4px;white-space:nowrap}.name svg{width:12px;height:15px;margin-left:3px;opacity:.45;stroke-width:3}
 .video{margin-left:auto;width:44px;height:44px;border-radius:50%}.video svg{width:28px;height:28px}
 [hidden]{display:none!important}
 `,`<div class="row" part="header"><button class="back" data-action="back" aria-label="Back">${icons.back}<span class="badge"></span></button><div class="contact"><div class="avatar" part="avatar"><slot name="avatar"><span class="initials"></span><img hidden alt=""/></slot></div><button class="name" data-action="profile"><span></span>${icons.chevron}</button></div><button class="video" data-action="video" aria-label="Video call">${icons.video}</button></div>`);
 for(const action of ['back','video','profile'])on(this,action,()=>emit(this,action));}
 connectedCallback(){this.sync();}attributeChangedCallback(){if(this.shadowRoot)this.sync();}
 sync(){const name=this.getAttribute('name')||'Alex';text(this,'.name span',name);text(this,'.initials',name.split(/\s+/).map(s=>s[0]).slice(0,2).join(''));const img=this.shadowRoot.querySelector('img'),url=this.getAttribute('avatar');img.hidden=!url;this.shadowRoot.querySelector('.initials').hidden=!!url;if(url)img.src=url;else img.removeAttribute('src');for(const key of ['back','video'])this.shadowRoot.querySelector('.'+key).hidden=this.getAttribute(key)==='false';text(this,'.badge',this.getAttribute('unread')||'');this.shadowRoot.querySelector('.badge').hidden=!this.getAttribute('unread');this.shadowRoot.querySelector('.name').setAttribute('aria-label',`View ${name}`);}
}

export class IMessageComposer extends Base {
 static observedAttributes=['placeholder','plus','microphone','value'];
 constructor(){super();setup(this,`
 :host{display:block;color:var(--im-chrome-text,#f5f5f5)}
 form{display:flex;gap:12px;align-items:center;margin:0;padding:12px var(--im-composer-inset,20px) 13px}
 button{border:1px solid var(--im-input-border,#393939);background:var(--im-input,#181818);display:grid;place-items:center;padding:0;flex-shrink:0}
 .plus{width:40px;height:40px;border-radius:50%}.plus svg{height:27px;width:27px}
 .field{height:40px;flex:1;min-width:0;border-radius:24px;display:flex;align-items:center;border:1px solid var(--im-input-border,#393939);background:var(--im-input,#181818);padding:0 12px 0 15px}
 input{color:inherit;min-width:0;width:100%;background:none;border:0;outline:0;padding:0;font-size:17px;letter-spacing:-.35px;caret-color:#0a84ff}input::placeholder{color:#636366;opacity:1}
 .mic{border:0;background:none;color:#747477;width:20px;height:28px}.mic svg{width:17px;height:22px}
 .send{width:28px;height:28px;background:#0a84ff;color:#fff;border:0;border-radius:50%}.send svg{width:21px;height:21px}
 [hidden]{display:none!important}
 `,`<form part="composer"><button type="button" class="plus" data-action="add" aria-label="Add attachment">${icons.plus}</button><div class="field" part="input"><input aria-label="Message" placeholder="iMessage" autocomplete="off"/><button type="button" class="mic" data-action="microphone" aria-label="Audio message">${icons.mic}</button><button type="submit" class="send" aria-label="Send message" hidden>${icons.send}</button></div></form>`);
 this.shadowRoot.querySelector('form').addEventListener('submit',e=>{e.preventDefault();this.submit();});this.shadowRoot.querySelector('input').addEventListener('input',()=>this.update());on(this,'add',()=>emit(this,'add'));on(this,'microphone',()=>emit(this,'microphone'));}
 connectedCallback(){this.sync();}attributeChangedCallback(){if(this.shadowRoot)this.sync();}
 sync(){const input=this.shadowRoot.querySelector('input');input.placeholder=this.getAttribute('placeholder')||'iMessage';if(this.hasAttribute('value'))input.value=this.getAttribute('value');this.shadowRoot.querySelector('.plus').hidden=this.getAttribute('plus')==='false';this.update();}
 update(){const value=this.shadowRoot.querySelector('input').value;this.shadowRoot.querySelector('.send').hidden=!value.trim();this.shadowRoot.querySelector('.mic').hidden=!!value.trim()||this.getAttribute('microphone')==='false';}
 submit(){const input=this.shadowRoot.querySelector('input'),value=input.value.trim();if(!value)return;emit(this,'send',{text:value});input.value='';this.update();}
}

export class IMessageTimestamp extends Base {constructor(){super();setup(this,`:host{display:block;text-align:center;color:var(--im-muted,#8e8e93);font-size:11px;line-height:14px;letter-spacing:0;margin:12px 0 10px}`,`<slot></slot>`);}}
export class IMessageThread extends Base {constructor(){super();setup(this,`:host{display:block;position:relative}.line{position:absolute;top:0;left:14px;width:34px;height:var(--im-thread-height,234px);border-left:4px solid var(--im-thread-color,#292929);border-bottom:4px solid var(--im-thread-color,#292929);border-bottom-left-radius:25px;pointer-events:none}.line:before,.line:after{content:'';position:absolute;width:4px;height:4px;border-radius:50%;background:var(--im-thread-color,#292929);left:-4px;top:-2px}.line:after{left:auto;right:-2px;top:auto;bottom:-4px}`,`<div class="line" part="thread" aria-hidden="true"></div><slot></slot>`);}}
export class IMessageStatusBar extends Base {
 static observedAttributes=['time','clock','island','signal','wifi','battery'];
 constructor(){super();setup(this,`:host{display:block;height:58px;color:var(--im-chrome-text,#fff)}.bar{height:58px;position:relative;display:flex;align-items:center;justify-content:space-between;padding:0 30px 0 33px;font-size:17px;font-weight:600;letter-spacing:0}.island{position:absolute;top:14px;left:50%;transform:translateX(-50%);width:min(125px,calc(100% - 250px));height:35px;border-radius:30px;background:#000}.right{display:flex;gap:7px;align-items:center;margin-left:auto}.wifi svg{width:23px;height:23px;stroke-width:2.8}.battery{border:1.5px solid #888;width:28px;height:14px;border-radius:4px;position:relative}.battery:before{content:'';position:absolute;inset:2px 8px 2px 2px;background:currentColor;border-radius:2px}.battery:after{content:'';position:absolute;right:-4px;top:3px;height:5px;width:2px;border-radius:2px;background:#666}.signal{display:flex;align-items:flex-end;gap:2px;height:14px}.signal i{width:3px;background:currentColor;border-radius:1px}.signal i:nth-child(1){height:5px}.signal i:nth-child(2){height:8px}.signal i:nth-child(3){height:11px}.signal i:nth-child(4){height:14px;opacity:.3}[hidden]{display:none}`,`<div class="bar" part="status-bar"><span class="time"></span><div class="island"></div><div class="right"><span class="signal"><i></i><i></i><i></i><i></i></span><span class="wifi">${icons.wifi}</span><span class="battery"></span></div></div>`);}
 connectedCallback(){this.sync();}attributeChangedCallback(){if(this.shadowRoot)this.sync();}sync(){text(this,'.time',this.getAttribute('time')||'9:41');for(const key of ['island','signal','wifi','battery'])this.shadowRoot.querySelector('.'+key).hidden=this.getAttribute(key)==='false';this.shadowRoot.querySelector('.time').hidden=this.getAttribute('clock')==='false';}}

export class IMessageKeyboard extends Base {
 constructor(){super();setup(this,`
 :host{display:block;color:#fff;background:#161617;border:1px solid #333;border-radius:29px 29px 0 0;height:345px;letter-spacing:0}
 .suggestions{height:51px;display:flex;align-items:center;color:#aaa;font-size:17px}.suggestions span{flex:1;text-align:center;border-right:1px solid #383838}.suggestions span:last-child{border:0;flex:.36}
 .keys{padding:0 6px;display:flex;flex-direction:column;gap:11px}.row{display:flex;gap:6px;justify-content:center}.row:nth-child(2){padding:0 21px}.row:nth-child(3){gap:6px;justify-content:space-between}
 button{height:45px;border:0;border-radius:8px;background:#3c3c3c;color:#fff;flex:1;min-width:0;font-size:25px;display:grid;place-items:center;padding:0}.row:nth-child(3) button:first-child,.row:nth-child(3) button:last-child{flex:1.35}.row:nth-child(3) button:first-child{margin-right:9px}.row:nth-child(3) button:last-child{margin-left:9px}button svg{width:24px;height:24px}.bottom button{font-size:18px}.bottom .space{flex:4.4;position:relative}.space span{position:absolute;font-size:11px;color:#777;right:6px;bottom:3px}.bottom .enter{flex:2.2}.footer{display:flex;justify-content:space-between;padding:22px 26px}.footer button{background:none;flex:0 0 34px}.footer svg{width:29px;height:29px}
 `,`<div class="suggestions" aria-hidden="true"><span>i</span><span>the</span><span>Pay</span><span>≡A</span></div><div class="keys">${['qwertyuiop','asdfghjkl','zxcvbnm'].map((row,i)=>`<div class="row">${i===2?`<button data-key="Shift" aria-label="Shift">${icons.shift}</button>`:''}${[...row].map(k=>`<button data-key="${k}">${k}</button>`).join('')}${i===2?`<button data-key="Backspace" aria-label="Delete">${icons.delete}</button>`:''}</div>`).join('')}<div class="row bottom"><button data-key="123">123</button><button data-key="😊" aria-label="Emoji">☻</button><button class="space" data-key=" " aria-label="Space"><span>EN</span></button><button class="enter" data-key="Enter" aria-label="Return">${icons.enter}</button></div></div><div class="footer"><button data-key="Globe" aria-label="Change keyboard">${icons.globe}</button><button data-key="Microphone" aria-label="Dictate">${icons.mic}</button></div>`);
 this.shadowRoot.addEventListener('click',e=>{const key=e.target.closest('[data-key]')?.dataset.key;if(!key)return;if(['123','Shift','Globe','Microphone'].includes(key)){emit(this,'keyboard-action',{key});return;}emit(this,'key',{key});});}
}

/** Scales a fixed logical canvas without reflowing its content. */
export class IMessageViewport extends Base {
 static observedAttributes=['width','height'];
 constructor(){super();setup(this,`:host{display:block;position:relative;width:100%;overflow:hidden}.canvas{position:absolute;left:0;top:0;transform-origin:top left}slot{display:contents}`,`<div class="canvas" part="canvas"><slot></slot></div>`);this._resize=new ResizeObserver(()=>this.resize());}
 connectedCallback(){this._resize.observe(this);this.resize();}
 disconnectedCallback(){this._resize.disconnect();}
 attributeChangedCallback(){if(this.shadowRoot)this.resize();}
 resize(){const width=Math.max(1,Number(this.getAttribute('width'))||440),height=Math.max(1,Number(this.getAttribute('height'))||956);const scale=this.clientWidth/width;const canvas=this.shadowRoot.querySelector('.canvas');canvas.style.width=width+'px';canvas.style.height=height+'px';canvas.style.transform=`scale(${scale})`;this.style.height=height*scale+'px';}
}

export const elements={'imessage-viewport':IMessageViewport,'imessage-conversation':IMessageConversation,'imessage-bubble':IMessageBubble,'imessage-header':IMessageHeader,'imessage-composer':IMessageComposer,'imessage-timestamp':IMessageTimestamp,'imessage-thread':IMessageThread,'imessage-status-bar':IMessageStatusBar,'imessage-keyboard':IMessageKeyboard};
export function register(){if(typeof customElements==='undefined')return;for(const [name,element]of Object.entries(elements))if(!customElements.get(name))customElements.define(name,element);}
export async function ready(){if(typeof document==='undefined')return;await document.fonts.ready;await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));document.querySelectorAll('imessage-bubble').forEach(e=>e.refresh());}
/** Text-only convenience factory. It does not interpret HTML or send messages. */
export function createConversation({messages=[],name='Alex',avatar,header=false,back=true,video=true,composer=false,keyboard=false,statusBar=false,theme='dark',scrollable=false,height=844,timestamp}={}){
 register();const c=document.createElement('imessage-conversation');c.setAttribute('theme',theme);c.setAttribute('scrollable',String(scrollable));if(Number.isFinite(height)&&height>0)c.style.setProperty('--im-height',`${height}px`);
 function add(tag,slot,attrs){const e=document.createElement(tag);if(slot)e.slot=slot;for(const[k,v]of Object.entries(attrs||{}))if(v!==undefined)e.setAttribute(k,String(v));c.append(e);return e;}
 if(statusBar)add('imessage-status-bar','status-bar',typeof statusBar==='object'?statusBar:{});
 if(header)add('imessage-header','header',{name,avatar,back,video,...(typeof header==='object'?header:{})});
 if(timestamp)add('imessage-timestamp').textContent=timestamp;
 for(const m of messages){if(m.timestamp)add('imessage-timestamp').textContent=m.timestamp;const b=add('imessage-bubble',null,{direction:m.direction||'received',status:m.status,tail:m.tail,group:m.group,width:m.width});b.textContent=m.text;}
 if(composer)add('imessage-composer','composer',typeof composer==='object'?composer:{});if(keyboard)add('imessage-keyboard','keyboard');return c;
}
register();
