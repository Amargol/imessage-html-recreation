export type Direction = 'sent' | 'received';
export type Group = 'first' | 'middle' | 'last';
export interface Message { text: string; direction?: Direction; status?: string; timestamp?: string; tail?: boolean; group?: Group; width?: string }
export interface HeaderOptions {name?:string;avatar?:string;photo?:boolean;back?:boolean;video?:boolean;unread?:string|number}
export interface StatusBarOptions {time?:string;clock?:boolean;island?:boolean;signal?:boolean;wifi?:boolean;battery?:boolean}
export interface ComposerOptions {placeholder?:string;plus?:boolean;microphone?:boolean;value?:string}
export interface ConversationOptions {messages?:Message[];name?:string;avatar?:string;header?:boolean|HeaderOptions;back?:boolean;video?:boolean;composer?:boolean|ComposerOptions;keyboard?:boolean;statusBar?:boolean|StatusBarOptions;theme?:'dark'|'light';scrollable?:boolean;height?:number;timestamp?:string}
export declare class IMessageViewport extends HTMLElement {resize():void}
export declare class IMessageBubble extends HTMLElement { refresh(): void; reveal(): void }
export declare class IMessageConversation extends HTMLElement {scrollToEnd():void}
export declare class IMessageHeader extends HTMLElement {}
export declare class IMessageComposer extends HTMLElement { update(): void; submit(): void }
export declare class IMessageTimestamp extends HTMLElement {}
export declare class IMessageThread extends HTMLElement {}
export declare class IMessageStatusBar extends HTMLElement {}
export declare class IMessageKeyboard extends HTMLElement {}
export declare function bubblePath(width:number,height:number,options?:{tail?:boolean;radius?:number}):string;
export declare function register():void;
export declare function ready():Promise<void>;
export declare function createConversation(options?:ConversationOptions):IMessageConversation;
export declare const elements: Record<string, CustomElementConstructor>;
declare global {
 interface HTMLElementTagNameMap {
  'imessage-viewport':IMessageViewport;
  'imessage-conversation':IMessageConversation;
  'imessage-bubble':IMessageBubble;
  'imessage-header':IMessageHeader;
  'imessage-composer':IMessageComposer;
  'imessage-timestamp':IMessageTimestamp;
  'imessage-thread':IMessageThread;
  'imessage-status-bar':IMessageStatusBar;
  'imessage-keyboard':IMessageKeyboard;
 }
 interface HTMLElementEventMap {
  'imessage:send':CustomEvent<{text:string}>;
  'imessage:key':CustomEvent<{key:string}>;
  'imessage:back':CustomEvent<Record<string,never>>;
  'imessage:profile':CustomEvent<Record<string,never>>;
  'imessage:video':CustomEvent<Record<string,never>>;
  'imessage:add':CustomEvent<Record<string,never>>;
  'imessage:microphone':CustomEvent<Record<string,never>>;
  'imessage:keyboard-action':CustomEvent<{key:string}>;
 }
}
