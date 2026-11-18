import React from "react";

export default function ConsortiumGrid({ members }) {
  if (!members?.length) return null;

  return (
    <div className="mt-16">
      <div className="flex items-center gap-4 mb-8">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-amber-400 text-sm font-semibold uppercase tracking-widest">The Consortium</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>
      <p className="text-white/60 leading-relaxed mb-8 max-w-4xl">
        The proposal brings together principal investigators from each region, pairing E2Eden's field engineering with
        independent agronomic and hydrological research at every site.
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((member) => (
          <div key={`${member.name}-${member.organization}`} className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <p className="text-amber-400 text-xs font-semibold uppercase tracking-widest mb-3">{member.region}</p>
            <h4 className="text-lg font-bold text-white">{member.name}</h4>
            <p className="text-white/70 text-sm mt-1">{member.organization}</p>
            {member.focus && <p className="text-white/50 text-sm mt-3 leading-relaxed">{member.focus}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}