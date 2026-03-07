import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

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
    const teamMembers = await base44.asServiceRole.entities.Team.list();

    // Update the three team members with their new bios
    for (const member of teamMembers) {
      if (bioData[member.name]) {
        await base44.asServiceRole.entities.Team.update(member.id, {
          bio: bioData[member.name]
        });
      }
    }

    return Response.json({
      success: true,
      message: 'Team bios updated successfully',
      bios: bioData
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});