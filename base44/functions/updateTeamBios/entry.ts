import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

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
    if (body?.confirm !== true) return Response.json({ error: 'Explicit confirmation is required' }, { status: 400 });

    // Fetch LinkedIn data for the three team members
    const linkedInProfiles = [
      {
        name: 'Bobby Gonzales',
        url: 'https://www.linkedin.com/in/bobby-gonzalez-p-e-726bb09a/'
      },
      {
        name: 'Amy Cunha',
        url: 'https://www.linkedin.com/in/amycunha/'
      },
      {
        name: 'Guy Nadler',
        url: 'https://www.linkedin.com/in/guynadler/'
      }
    ];

    const bioData = {};

    for (const profile of linkedInProfiles) {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Visit and extract professional information from ${profile.url}. Provide a concise 2-3 sentence professional bio for ${profile.name} including their current role, key experience, and professional focus. Return only the bio text, no additional formatting.`,
        add_context_from_internet: true
      });

      bioData[profile.name] = result;
    }

    // Get all team members
    const teamMembers = await base44.entities.Team.list();

    // Update the three team members with their new bios
    for (const member of teamMembers) {
      if (bioData[member.name]) {
        await base44.entities.Team.update(member.id, {
          bio: bioData[member.name]
        });
      }
    }

    return Response.json({
      success: true,
      message: 'Team bios updated successfully',
      bios: bioData
    });
  } catch {
    return Response.json({ error: 'Unable to update team bios' }, { status: 500 });
  }
}