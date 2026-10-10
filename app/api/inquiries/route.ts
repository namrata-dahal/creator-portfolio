import {inquirySchema} from '@/lib/inquiry-schema';
import {forwardInquiry,reply} from '@/lib/inquiry-proxy';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export async function POST(request:Request){
 if(request.headers.get('origin')!==new URL(request.url).origin)return reply({error:'Please submit the form from this website.'},403);
 if(!request.headers.get('content-type')?.includes('application/json'))return reply({error:'Unsupported request.'},415);
 if(Number(request.headers.get('content-length')||0)>20000)return reply({error:'The request is too large.'},413);
 const text=await request.text();if(text.length>20000)return reply({error:'The request is too large.'},413);
 let body;try{body=JSON.parse(text);}catch{return reply({error:'Invalid request.'},400);}
 if(!body||typeof body!=='object'||body.companyFax||typeof body.token!=='string'||body.token.length>150)return reply({error:'Invalid request.'},400);
 const result=inquirySchema.safeParse(body);if(!result.success)return reply({error:result.error.issues[0]?.message||'Please check the form.'},400);
 return forwardInquiry('/api/inquiries',JSON.stringify({...result.data,token:body.token,companyFax:''}));
}
export async function GET(){return reply({error:'Use the protected creator inbox.'},403);}
export async function PATCH(){return reply({error:'Owner access required.'},403);}
export async function DELETE(){return reply({error:'Owner access required.'},403);}
