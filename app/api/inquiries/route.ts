import { inquirySchema } from '@/lib/inquiry-schema';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    if (request.headers.get('origin') !== new URL(request.url).origin) return Response.json({ error: 'Please submit the form from this website.' }, { status: 403, headers: { 'Cache-Control': 'no-store' } });
    if (!request.headers.get('content-type')?.includes('application/json')) return Response.json({ error: 'Unsupported request.' }, { status: 415, headers: { 'Cache-Control': 'no-store' } });
    if (Number(request.headers.get('content-length') || 0) > 20000) return Response.json({ error: 'The request is too large.' }, { status: 413, headers: { 'Cache-Control': 'no-store' } });
    const text = await request.text(); if (text.length > 20000) return Response.json({ error: 'The request is too large.' }, { status: 413, headers: { 'Cache-Control': 'no-store' } });
    let body; try { body = JSON.parse(text); } catch { return Response.json({ error: 'Invalid request.' }, { status: 400, headers: { 'Cache-Control': 'no-store' } }); }
    if (!body || typeof body !== 'object' || body.companyFax || typeof body.token !== 'string' || body.token.length > 150) return Response.json({ error: 'Invalid request.' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
    const result = inquirySchema.safeParse(body); if (!result.success) return Response.json({ error: result.error.issues[0]?.message || 'Please check the form.' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });

    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
        .from('inquiries')
        .insert({
            name: result.data.name,
            email: result.data.email,
            brand: result.data.brand,
            website: result.data.website,
            objective: result.data.objective,
            format: result.data.format,
            budget: result.data.budget,
            platforms: result.data.platforms,
            timeline: result.data.timeline,
            usage: result.data.usage,
            details: result.data.details,
            consent: result.data.consent,
        })
        .select('id')
        .single();

    if (error) {
        console.error('Supabase error:', error);
        return Response.json({ error: 'Could not save your request. Please try again.' }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
    }

    return Response.json({ id: data.id }, { status: 200, headers: { 'Cache-Control': 'no-store' } });
}
export async function GET() { return Response.json({ error: 'Use the protected creator inbox.' }, { status: 403, headers: { 'Cache-Control': 'no-store' } }); }
export async function PATCH() { return Response.json({ error: 'Owner access required.' }, { status: 403, headers: { 'Cache-Control': 'no-store' } }); }
export async function DELETE() { return Response.json({ error: 'Owner access required.' }, { status: 403, headers: { 'Cache-Control': 'no-store' } }); }
