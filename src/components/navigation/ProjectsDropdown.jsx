import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

const GROUPS = [
  { label: "Current", statuses: ["active"], color: "text-amber-400" },
  { label: "Past", statuses: ["completed"], color: "text-white/50" },
  { label: "Future", statuses: ["planned"], color: "text-blue-400" },
];

export default function ProjectsDropdown() {
  const { data: projects = [] } = useQuery({
    queryKey: ["projects-nav"],
    queryFn: () => base44.entities.Project.list("sort_order"),
  });

  return (
    <div className="relative group">
      <button className="px-4 py-2 text-sm rounded-lg transition-all text-white/70 hover:text-white hover:bg-white/10">
        Projects
      </button>
      <div className="absolute left-0 mt-0 w-64 bg-black/95 border border-white/10 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
        {GROUPS.map((group, gi) => {
          const list = projects.filter((p) => group.statuses.includes(p.status));
          if (!list.length) return null;
          return (
            <div key={group.label} className={gi > 0 ? "mt-2 border-t border-white/10 pt-2" : ""}>
              <p className={`px-4 pt-1 pb-1 text-[10px] font-bold uppercase tracking-widest ${group.color}`}>
                {group.label}
              </p>
              {list.map((p) => (
                <Link
                  key={p.id}
                  to={`/project/${p.id}`}
                  className="block px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                >
                  {p.name}
                  <span className="ml-2 text-white/30 text-xs">{p.location}</span>
                </Link>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}