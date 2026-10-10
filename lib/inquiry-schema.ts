import {z} from 'zod';
export const formats=['Sponsored short-form video','YouTube integration','Content for brand channels','Multi-part campaign','Help me choose'] as const;
export const budgets=['Under NPR 10,000','NPR 10,000–25,000','NPR 25,000–50,000','NPR 50,000+','Open to a proposal'] as const;
export const inquirySchema=z.object({
 name:z.string().trim().min(2,'Please enter your name.').max(100),
 email:z.string().trim().email('Please enter a valid work email.').max(254).transform(v=>v.toLowerCase()),
 brand:z.string().trim().min(2,'Please enter your brand name.').max(150),
 website:z.string().trim().max(300).refine(v=>!v||/^https?:\/\/[^\s]+$/i.test(v),'Use a full website URL starting with https://.').default(''),
 objective:z.enum(['Brand awareness','Product launch','Leads or sign-ups','Content production','Other']),
 format:z.enum(formats),budget:z.enum(budgets),
 platforms:z.array(z.enum(['YouTube','TikTok','Instagram','Facebook','Brand channels'])).min(1,'Choose at least one platform.').max(5),
 timeline:z.string().trim().min(2,'Please share your ideal timeline.').max(150),
 usage:z.enum(['Organic use only','Paid advertising','Organic and paid advertising','Not sure yet']),
 details:z.string().trim().min(20,'Please add at least 20 characters about your campaign.').max(4000),
 consent:z.boolean().refine(v=>v===true,{message:'Please agree to the privacy notice.'}),
});
export type InquiryInput=z.infer<typeof inquirySchema>;
