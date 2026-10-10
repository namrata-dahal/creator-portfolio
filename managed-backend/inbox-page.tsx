import {SiteShell} from '@/components/portfolio/shell';
import {Inbox} from '@/components/portfolio/inbox';
import {requireChatGPTUser} from '@/app/chatgpt-auth';
import {isInquiryOwner} from '@/lib/inquiry-server';
import {getDb} from '@/db';
import {inquiries} from '@/db/schema';
import {desc} from 'drizzle-orm';
export const dynamic='force-dynamic';
export const metadata={title:'Private Collaboration Inbox | Namrata Dahal',robots:{index:false,follow:false}};
export default async function InboxPage(){await requireChatGPTUser('/inbox');if(!await isInquiryOwner())return <SiteShell><main id="main" className="wrap section"><h1>Owner access required.</h1><p>This inbox is private to Namrata. <a href="/collaborate">Submit an inquiry instead.</a></p></main></SiteShell>;let rows;try{rows=await getDb().select().from(inquiries).orderBy(desc(inquiries.createdAt)).limit(200);}catch{return <SiteShell><main id="main" className="wrap section"><h1>Inbox temporarily unavailable.</h1><p>Please refresh in a moment. Your saved requests have not been changed.</p></main></SiteShell>}return <SiteShell><main id="main" className="wrap section"><p className="eyebrow">PRIVATE / CREATOR WORKSPACE</p><h1 className="inbox-heading">Your collaboration inbox.</h1><Inbox initial={rows}/></main></SiteShell>}
