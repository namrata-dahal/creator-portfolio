"use client";
import { useState, type FormEvent } from "react";
import { creatorTypes } from "@/lib/creator-website-schema";
export function CreatorWebsiteForm() {
 const [data,setData] = useState({name:"",email:"",handle:"",creatorType:"Content creator",workUrl:"",notes:"",consent:false,hpCheck:""});
 const [busy,setBusy]=useState(false),[error,setError]=useState(""),[receipt,setReceipt]=useState("");
 function change(k:keyof typeof data,v:string|boolean){setData(d=>({...d,[k]:v}));setError("");}
 async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();if(busy)return;setBusy(true);setError("");
 try {const r=await fetch("/api/creator-website-leads",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});
 const j=await r.json() as {id?:string;error?:string};if(!r.ok||!j.id)throw new Error(j.error||"Could not submit.");
 setReceipt(j.id);}catch(e){setError(e instanceof Error?e.message:"Could not submit.");}finally{setBusy(false);}}
 if(receipt)return <div className="cw-form cw-success" role="status"><p className="eyebrow">REQUEST RECEIVED</p><h3>Thank you, {data.name.split(" ")[0]}.</h3><p>I'll review your request and reply with the details. This inquiry does not confirm a booking or reserve a promotional slot.</p><small>Reference: {receipt}</small></div>;
 return <form className="cw-form" id="creator-inquiry" onSubmit={submit}>
 <p className="eyebrow">NO PAYMENT REQUIRED TO ENQUIRE</p><h3>Let's talk about your portfolio.</h3>
 <p>Share your details. I'll reply with available slots, the scope and the next steps.</p>
 <div className="cw-two"><label>Your name *<input required minLength={2} maxLength={100} autoComplete="name" placeholder="Full name" value={data.name} onChange={e=>change("name",e.target.value)}/></label>
 <label>Email *<input type="email" required maxLength={254} autoComplete="email" placeholder="you@example.com" value={data.email} onChange={e=>change("email",e.target.value)}/></label></div>
 <div className="cw-two"><label>Creator handle *<input required minLength={2} maxLength={120} placeholder="@handle" value={data.handle} onChange={e=>change("handle",e.target.value)}/></label>
 <label>Type of creator<select value={data.creatorType} onChange={e=>change("creatorType",e.target.value)}>{creatorTypes.map(t=><option key={t}>{t}</option>)}</select></label></div>
 <label>Link to your work (optional)<input type="url" maxLength={300} value={data.workUrl} placeholder="https://..." onChange={e=>change("workUrl",e.target.value)}/></label>
 <label>Anything specific? (optional)<textarea rows={3} maxLength={1500} value={data.notes} onChange={e=>change("notes",e.target.value)} placeholder="What you'd like to showcase..." /></label>
 <label className="cw-trap" aria-hidden="true">Leave blank<input tabIndex={-1} autoComplete="off" value={data.hpCheck} onChange={e=>change("hpCheck",e.target.value)}/></label>
 <label className="cw-consent"><input type="checkbox" required checked={data.consent} onChange={e=>change("consent",e.target.checked)}/><span>I agree to the <a href="/privacy">privacy notice</a> and understand this is only an inquiry—not a reserved booking.</span></label>
 {error&&<p role="alert" className="cw-error">{error}</p>}
 <button type="submit" className="button dark" disabled={busy}>{busy?"Sending...":"Request my portfolio website"} <span>↗</span></button>
 <small>We will agree on final price, third-party costs, scope and timelines before any payment.</small>
 </form>;
}
