import {forwardInquiry} from '@/lib/inquiry-proxy';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export async function GET(){return forwardInquiry('/api/inquiries/token');}
