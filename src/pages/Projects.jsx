import React from "react";
import { Link } from "react-router-dom";
import { Wrench, Leaf, MapPin, Calendar, Users, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createPageUrl } from "../utils";

const ALL_PROJECTS = [
  {
    location: "Nairobi, Kenya",
    projects: [
      { name: "Solar Micro-Grid Network", type: "engineering", description: "Deploying modular solar micro-grids to power 12 rural communities.", year: "2025", team: "14 engineers", status: "active" },
      { name: "Precision Drip Irrigation", type: "farming", description: "AI-driven irrigation system reducing water usage by 60%.", year: "2024", team: "8 specialists", status: "active" },
      { name: "Vertical Farm Pilot", type: "farming", description: "Urban vertical farming facility producing leafy greens year-round.", year: "2024", team: "6 agronomists", status: "completed" },
    ],
  },
  {
    location: "São Paulo, Brazil",
    projects: [
      { name: "Rainforest Reforestation Drones", type: "engineering", description: "Autonomous drone fleet planting 50,000 native trees monthly.", year: "2025", team: "10 engineers", status: "active" },
      { name: "Cacao Agroforestry", type: "farming", description: "Shade-grown cacao integrated with native trees.", year: "2023", team: "22 farmers", status: "active" },
      { name: "Flood Barrier System", type: "engineering", description: "Smart flood management infrastructure protecting 3 communities.", year: "2024", team: "18 engineers", status: "completed" },
    ],
  },
  {
    location: "Rotterdam, Netherlands",
    projects: [
      { name: "Floating Farm Platform", type: "farming", description: "Self-sustaining floating dairy farm with zero land footprint.", year: "2024", team: "12 specialists", status: "active" },
      { name: "Tidal Energy Converter", type: "engineering", description: "Next-gen tidal turbines generating 5MW of clean energy.", year: "2025", team: "20 engineers", status: "active" },
    ],
  },
];

const typeConfig = {
  engineering: { icon: Wrench, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  farming: { icon: Leaf, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
};

export default function Projects() {
  return (
    <div className="min-h-screen p-6 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center gap-4">
          <Link to={createPageUrl("Home")}>
            <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/[0.08]">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Globe
            </Button>
          </Link>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6993b7c68cee7955d3266d09/aba199569_Brand_Yellow.png"
              alt="E2Eden"
              className="w-12 h-12 object-contain"
            />
            <div>
              <h1 className="text-2xl font-bold text-white">E2Eden</h1>
              <p className="text-sm text-white/40">The Next Green Revolution</p>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">All Projects</h2>
          <p className="text-white/40">Browse our complete portfolio of engineering and farming initiatives worldwide</p>
        </div>

        <div className="space-y-8">
          {ALL_PROJECTS.map((location) => (
            <Card key={location.location} className="bg-white/[0.04] border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-amber-400" />
                  {location.location}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {location.projects.map((project) => {
                    const config = typeConfig[project.type];
                    const Icon = config.icon;
                    return (
                      <div
                        key={project.name}
                        className={`p-4 rounded-xl border ${config.border} ${config.bg} backdrop-blur-sm`}
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <div className={`p-2 rounded-lg ${config.bg} border ${config.border}`}>
                            <Icon className={`w-4 h-4 ${config.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-white mb-1">{project.name}</h4>
                            <Badge className={`${config.bg} ${config.color} text-[10px] px-1.5 py-0 border-0`}>
                              {project.type}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-xs text-white/50 leading-relaxed mb-3">{project.description}</p>
                        <div className="flex items-center gap-3 text-[11px] text-white/35">
                          {project.year && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {project.year}
                            </span>
                          )}
                          {project.team && (
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {project.team}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}