import { SiteShell } from '@/components/portfolio/shell';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Private Collaboration Inbox | Namrata Dahal', robots: { index: false, follow: false } };

export default async function InboxPage() {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    let inquiries;
    try {
        const { data, error } = await supabase
            .from('inquiries')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(200);

        if (error) throw error;
        inquiries = data;
    } catch (error) {
        console.error('Error fetching inquiries:', error);
        return (
            <SiteShell>
                <main id="main" className="wrap section">
                    <h1>Inbox temporarily unavailable.</h1>
                    <p>Please refresh in a moment. Your saved requests have not been changed.</p>
                </main>
            </SiteShell>
        );
    }

    return (
        <SiteShell>
            <main id="main" className="wrap section">
                <p className="eyebrow">PRIVATE / CREATOR WORKSPACE</p>
                <h1 className="inbox-heading">Your collaboration inbox.</h1>
                <div className="inbox-intro">
                    Requests are saved here. No automatic email notifications are configured. Open a contact link to draft a reply in your email app.
                </div>
                <div className="filters">
                    <button className="active">all {inquiries?.length || 0}</button>
                </div>
                {inquiries && inquiries.length === 0 ? (
                    <p className="empty-inbox">No inquiries yet.</p>
                ) : (
                    <div className="inbox-list">
                        {inquiries?.map((inquiry) => (
                            <article key={inquiry.id}>
                                <div className="inbox-title">
                                    <div>
                                        <p className="eyebrow">
                                            {new Date(inquiry.created_at).toISOString().slice(0, 10)} · {inquiry.status || 'new'}
                                        </p>
                                        <h2>{inquiry.brand}</h2>
                                        <a href={`mailto:${inquiry.email}?subject=${encodeURIComponent('Your collaboration inquiry — Namrata Dahal')}`}>
                                            {inquiry.name} · {inquiry.email} ↗
                                        </a>
                                    </div>
                                </div>
                                <div className="inbox-meta">
                                    <span>{inquiry.format}</span>
                                    <span>{inquiry.budget}</span>
                                    <span>{Array.isArray(inquiry.platforms) ? inquiry.platforms.join(', ') : inquiry.platforms}</span>
                                    <span>{inquiry.timeline}</span>
                                    <span>{inquiry.usage}</span>
                                </div>
                                <p><strong>Goal:</strong> {inquiry.objective}</p>
                                <p className="preserve-lines">{inquiry.details}</p>
                                {inquiry.website ? (
                                    <a href={inquiry.website} target="_blank" rel="noopener noreferrer">
                                        Brand website ↗
                                    </a>
                                ) : null}
                                <div className="inbox-bottom">
                                    <small>Reference: {inquiry.id}</small>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </main>
        </SiteShell>
    );
}
