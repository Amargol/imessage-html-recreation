'use client';
import {useEffect,useState,useRef} from 'react';
import {MessageCircle,ArrowUpRight,Code2,SlidersHorizontal,Download,RotateCcw,Pause,Play,Check} from 'lucide-react';
import {Conversation,Bubble,Header,StatusBar,Viewport,Composer,Timestamp} from '../packages/imessage-html-recreation/react';
import {Button} from '@/components/ui/button';

const script=[
 {direction:'received' as const,text:'Wait… this is a video, right?'},
 {direction:'sent' as const,text:'Nope. Every bubble is real HTML.'},
 {direction:'received' as const,text:'Even the little tails? 👀'},
 {direction:'sent' as const,text:'The tails. The spacing. The whole conversation.'},
 {direction:'received' as const,text:'Okay, I need this for my next post.'},
 {direction:'sent' as const,text:'Make it yours. It’s open source. 💙'}
];
const snippet=`<script type="module" src="./imessage/index.js"></script>

<imessage-viewport width="440" height="956">
<imessage-conversation scrollable="true"
  style="--im-height:956px">
  <imessage-bubble direction="received">
    This looks familiar.
  </imessage-bubble>
  <imessage-bubble direction="sent">
    It’s just HTML. 💙
  </imessage-bubble>
</imessage-conversation>
</imessage-viewport>`;
export default function Landing(){
 const demoRef=useRef<HTMLDivElement>(null);const[visible,setVisible]=useState(false);
 const[count,setCount]=useState(0),[playing,setPlaying]=useState(true),[ready,setReady]=useState(false),[copied,setCopied]=useState(false);
 useEffect(()=>{setReady(true);if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){setCount(script.length);setPlaying(false);}},[]);
 useEffect(()=>{const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{threshold:.4});if(demoRef.current)observer.observe(demoRef.current);return()=>observer.disconnect()},[]);
 useEffect(()=>{if(!ready||!visible||!playing||count>=script.length)return;const timer=setTimeout(()=>setCount(n=>n+1),count===0?700:1900);return()=>clearTimeout(timer)},[count,playing,ready,visible]);
 const restart=()=>{setCount(0);setPlaying(true)};
 return <main className="landing" data-ready={ready}>
 <nav className="landing-nav"><a href="/" className="landing-brand"><span className="brand-mark"><MessageCircle size={23} fill="white"/></span>iMessage <span>HTML</span></a><div><a href="#how-it-works" className="landing-nav-text">How it works</a><a href="/editor?tab=docs" className="landing-nav-text">Docs</a><a href="/editor" className="landing-nav-editor">Open editor <ArrowUpRight size={16}/></a></div></nav>
 <section className="landing-hero">
 <div className="hero-copy"><div className="landing-eyebrow">OPEN SOURCE · ZERO DEPENDENCIES</div><h1>Looks like iMessage.<br/><span>Made with HTML.</span></h1><p>Turn a few lines of code into a conversation that feels native. For organic content, product demos, and the stories you want to tell.</p><div className="hero-actions"><a href="/editor" className="landing-cta">Create a conversation <ArrowUpRight size={18}/></a><a href="/downloads/imessage-html-recreation.zip" download className="landing-source"><Download size={17}/> Get the source</a></div><div className="hero-details"><span><Check size={14}/> MIT licensed</span><span><Check size={14}/> Works with any framework</span></div></div>
 <div className="hero-demo"><div className="demo-caption"><span><Code2 size={16}/> LIVE HTML RENDER</span><div><Button variant="ghost" size="icon" aria-label={count===script.length?'Replay animation':playing?'Pause animation':'Play animation'} onClick={()=>count===script.length?restart():setPlaying(v=>!v)}>{playing&&count<script.length?<Pause size={15}/>:<Play size={15}/>}</Button><Button variant="ghost" size="icon" aria-label="Replay conversation" onClick={restart}><RotateCcw size={15}/></Button></div></div>
 <div className="landing-phone" ref={demoRef}><Viewport width={440} height={956}><Conversation theme="dark" scrollable={true} className="animated-conversation"><StatusBar slot="status-bar" time="9:41"/><Header slot="header" name="Alex" avatar="/avatars/alex.png" unread="3" video={false}/><Timestamp className="demo-date">Today 9:41 AM</Timestamp>{script.slice(0,count).map((m,i)=><Bubble entrance={true} className="animated-bubble" key={i} direction={m.direction} status={i===script.length-1?'Read 9:41 AM':undefined}>{m.text}</Bubble>)}{playing&&count<script.length&&<div className={'typing-bubble '+(script[count].direction==='sent'?'typing-sent':'')} aria-label="Typing"><i/><i/><i/></div>}<Composer slot="composer" className="landing-composer" plus={true} microphone={true} inert={true}/></Conversation></Viewport></div>
 <div className="html-callout"><span className="html-callout-icon"><Code2 size={19}/></span><p><strong>Not a video. Not a screenshot.</strong><br/>Fully built in HTML. You can even select the text.</p></div></div>
 </section>
 <section className="landing-features" id="details"><div><span className="feature-number">01 / FAMILIAR BY DESIGN</span><h2>The details make it feel real.</h2><p>Carefully shaped bubble tails, native system type, read receipts, and conversation spacing. Calibrated against real iMessage screenshots.</p><a href="/editor?tab=compare">See the reference overlay <ArrowUpRight size={15}/></a></div><div><span className="feature-number">02 / YOUR CONVERSATION</span><h2>Every part is optional.</h2><p>Start with two messages. Add a profile, a back button, a composer, or a keyboard. Change the text, colors, and entire message stack in the editor.</p><a href="/editor">Explore the editor <ArrowUpRight size={15}/></a></div><div><span className="feature-number">03 / READY FOR YOUR IDEAS</span><h2>Native-looking content. Your code.</h2><p>Create conversations for social posts, tell a story on your website, or build a product demo. Standard HTML elements with no runtime dependencies.</p><a href="/downloads/imessage-html-recreation.zip" download>Download the library <ArrowUpRight size={15}/></a></div></section>
 <section className="landing-code" id="how-it-works"><div><div className="landing-eyebrow">SMALL API. FAMILIAR RESULT.</div><h2>A conversation,<br/>in a few tags.</h2><p>Import once. Add your messages. Use plain HTML or the optional React components, and bring your own interaction logic.</p><a href="/editor?tab=docs" className="landing-source">Read the documentation <ArrowUpRight size={17}/></a></div><div className="landing-code-box"><div><span>conversation.html</span><Button variant="ghost" size="sm" onClick={async()=>{try{await navigator.clipboard.writeText(snippet);setCopied(true);setTimeout(()=>setCopied(false),1800)}catch{setCopied(false)}}}>{copied?'Copied':'Copy'}</Button></div><pre><code>{snippet}</code></pre></div></section>
 <section className="landing-end"><MessageCircle size={34}/><h2>Your next story starts<br/>with a message.</h2><a href="/editor" className="landing-cta">Open the full editor <ArrowUpRight size={18}/></a></section>
 <footer className="landing-footer"><span>imessage-html-recreation</span><p>Independent recreation. Not affiliated with Apple.<br/>System fonts and glass effects vary by platform.</p><a href="/downloads/imessage-html-recreation.zip" download>MIT licensed source <ArrowUpRight size={14}/></a></footer>
 </main>
}
