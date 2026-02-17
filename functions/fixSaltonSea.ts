import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        
        // Get the Salton Sea project
        const projects = await base44.entities.Project.filter({ name: "Salton Sea" });
        
        if (projects.length === 0) {
            return Response.json({ error: "Salton Sea project not found" }, { status: 404 });
        }
        
        const project = projects[0];
        
        // Update with correct coordinates for Salton Sea, California
        await base44.entities.Project.update(project.id, {
            lat: 33.3,
            lon: -115.8
        });
        
        return Response.json({ 
            success: true, 
            message: "Salton Sea coordinates updated",
            oldCoords: { lat: project.lat, lon: project.lon },
            newCoords: { lat: 33.3, lon: -115.8 }
        });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});