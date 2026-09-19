import type {ForwardRefExoticComponent,HTMLAttributes,RefAttributes} from 'react';
import type {IMessageViewport,IMessageBubble,IMessageConversation,IMessageHeader,IMessageComposer,IMessageTimestamp,IMessageThread,IMessageStatusBar,IMessageKeyboard,Direction,Group} from './index.js';
type Props<T extends HTMLElement> = HTMLAttributes<T> & RefAttributes<T>;
type EventHandler<T> = (detail:T,event:CustomEvent<T>)=>void;
export declare const Conversation:ForwardRefExoticComponent<Props<IMessageConversation>&{theme?:'dark'|'light';scrollable?:boolean}>;
export declare const Bubble:ForwardRefExoticComponent<Props<IMessageBubble>&{entrance?:boolean;direction?:Direction;tail?:boolean;status?:string;group?:Group;width?:string}>;
export declare const Header:ForwardRefExoticComponent<Props<IMessageHeader>&{name?:string;avatar?:string;photo?:boolean;back?:boolean;video?:boolean;unread?:string|number;onBack?:EventHandler<{}>;onProfile?:EventHandler<{}>;onVideo?:EventHandler<{}>}>;
export declare const Composer:ForwardRefExoticComponent<Props<IMessageComposer>&{placeholder?:string;plus?:boolean;microphone?:boolean;value?:string;onSend?:EventHandler<{text:string}>;onAdd?:EventHandler<{}>;onMicrophone?:EventHandler<{}>}>;
export declare const Timestamp:ForwardRefExoticComponent<Props<IMessageTimestamp>>;
export declare const Thread:ForwardRefExoticComponent<Props<IMessageThread>>;
export declare const StatusBar:ForwardRefExoticComponent<Props<IMessageStatusBar>&{time?:string;clock?:boolean;island?:boolean;signal?:boolean;wifi?:boolean;battery?:boolean}>;
export declare const Keyboard:ForwardRefExoticComponent<Props<IMessageKeyboard>&{onKey?:EventHandler<{key:string}>;onKeyboardAction?:EventHandler<{key:string}>}>;

export declare const Viewport:ForwardRefExoticComponent<Props<IMessageViewport>&{width?:number;height?:number}>;
