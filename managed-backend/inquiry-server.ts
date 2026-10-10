import {env} from 'cloudflare:workers';
import {getChatGPTUser} from '@/app/chatgpt-auth';
export async function isInquiryOwner(){const user=await getChatGPTUser();return Boolean(user&&env.INQUIRY_OWNER_EMAIL&&user.email.toLowerCase()===env.INQUIRY_OWNER_EMAIL.toLowerCase());}
function secret(){if(!env.INQUIRY_FORM_SECRET)throw new Error('Form secret not configured');return env.INQUIRY_FORM_SECRET;}
async function key(){return crypto.subtle.importKey('raw',new TextEncoder().encode(secret()),{name:'HMAC',hash:'SHA-256'},false,['sign','verify']);}
function hex(bytes:ArrayBuffer){return Array.from(new Uint8Array(bytes)).map(b=>b.toString(16).padStart(2,'0')).join('');}
export async function makeFormToken(){const payload=`${Date.now()}.${crypto.randomUUID()}`;const signature=await crypto.subtle.sign('HMAC',await key(),new TextEncoder().encode(payload));return `${payload}.${hex(signature)}`;}
export async function verifyFormToken(token:string){const [timestamp,id,sig,...rest]=token.split('.');if(rest.length||!/^\d{13}$/.test(timestamp)||!/^[a-f0-9-]{36}$/.test(id)||!/^[a-f0-9]{64}$/.test(sig))return null;const age=Date.now()-Number(timestamp);if(age<0||age>3600000)return null;const bytes=Uint8Array.from(sig.match(/.{2}/g)!,x=>parseInt(x,16));return await crypto.subtle.verify('HMAC',await key(),bytes,new TextEncoder().encode(`${timestamp}.${id}`))?id:null;}
export function sameOrigin(request:Request){const origin=request.headers.get('origin');return origin===new URL(request.url).origin;}
export const privateHeaders={'Cache-Control':'no-store'};
