import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

const companies = new Set(['E2Eden', 'Seawater Greenhouse', 'Partner', 'Other']);

export default async function(req: Request): Promise<Response> {
  try {
    if (req.method !== 'POST') return Response.json({ error: 'Method not allowed' }, { status: 405 });
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(error => {
      if ([401, 403].includes(error.status ?? error.response?.status)) return null;
      throw error;
    });
    if (user?.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json().catch(() => null);
    if (typeof body?.id !== 'string' || !/^[a-zA-Z0-9_-]{1,128}$/.test(body.id) || !companies.has(body.company)) {
      return Response.json({ error: 'A valid user and company are required' }, { status: 400 });
    }

    await base44.asServiceRole.entities.User.update(body.id, { company: body.company });
    return Response.json({ success: true });
  } catch (error) {
    if ((error.status ?? error.response?.status) === 404) return Response.json({ error: 'User not found' }, { status: 404 });
    return Response.json({ error: 'Unable to assign company' }, { status: 500 });
  }
}