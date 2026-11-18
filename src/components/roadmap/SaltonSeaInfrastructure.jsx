import React from "react";
import { Link } from "react-router-dom";

const components = [
  ["Pacific Seawater Intake", "A coastal intake would bring seawater into the tunnel. Siting and design would need to address marine life protection, allowable withdrawal volumes, and coastal permits."],
  ["Gravity-Fed Import Tunnels", "The proposal sketches a roughly 78-mile route with a 230-foot elevation drop to drive large-scale seawater import. The alignment and capacity are illustrative and would need geotechnical and hydraulic studies."],
  ["Salton Sea Receiving Works", "A controlled outlet and lake monitoring would help manage inflow, water level, and salinity. Shoreline habitat and dust mitigation would need to be designed and evaluated alongside the water and salt balance."],
  ["Brine Distribution & Farm Cooling", "A separate network would carry lake brine to evaporative walls serving farms and greenhouses. The walls would cool the air without using brine for irrigation; net freshwater savings would need to be measured in the field."],
  ["Inland Salt & Brine Management", "Evaporation concentrates salt; it doesn’t remove it from the basin. The revised concept would collect concentrated brine and provide for salt separation, storage, and permitted disposal or use rather than returning brine to the Pacific."],
  ["Optional Water & Mineral Recovery", "Condensers could recover some freshwater from humid air. Lithium recovery from suitable geothermal brines is a separate opportunity that would need its own testing and business case."],
];

const illustrations = {
  "Pacific Seawater Intake": ["366bc6ad1", "Concept illustration of a screened seawater intake on the Pacific coast"],
  "Gravity-Fed Import Tunnels": ["8717906a3", "Conceptual cutaway of a water tunnel beneath the coastal mountains"],
  "Salton Sea Receiving Works": ["957ea08d6", "Concept illustration of a gated outlet and shoreline habitat at the Salton Sea"],
  "Brine Distribution & Farm Cooling": ["86b6c1bad", "Concept illustration of an evaporative cooling wall beside crop rows"],
  "Inland Salt & Brine Management": ["2584098c5", "Concept illustration of lined brine basins and salt deposits in the desert"],
  "Optional Water & Mineral Recovery": ["3f8703428", "Concept illustration of a condenser and separate mineral recovery equipment"],
};

export default function SaltonSeaInfrastructure() {
  return (
    <section aria-labelledby="salton-sea-infrastructure" className="mt-9 border-t border-border/20 pt-8 sm:mt-12 sm:pt-10">
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-secondary/60">Long-term concept · E2Eden’s 2023 proposal</p>
      <h3 id="salton-sea-infrastructure" className="mb-3 text-2xl font-semibold tracking-tight text-background sm:text-3xl">Pacific-to-Salton Sea Tunnels</h3>
      <p className="mb-7 max-w-[68ch] text-base leading-relaxed text-secondary/75">
        Bring Pacific seawater to the Salton Sea at regional scale, then route lake brine inland to cool farms and manage the remaining salt. The import system is not a prerequisite for the earlier field trials or pilot.
      </p>
      <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {components.map(([title, description], index) => (
          <li key={title} className="overflow-hidden rounded-xl border border-border/[0.15] bg-muted/5">
            <img
              src={`https://media.base44.com/images/public/6993b7c68cee7955d3266d09/${illustrations[title][0]}_generated_image.png`}
              alt={illustrations[title][1]}
              loading="lazy"
              decoding="async"
              className="aspect-[16/10] w-full object-cover"
            />
            <div className="p-5 sm:p-6">
              <p className="mb-3 font-mono text-xs text-secondary/60" aria-hidden="true">{String(index + 1).padStart(2, "0")}</p>
              <h4 className="mb-2 text-lg font-semibold leading-snug text-background">{title}</h4>
              <p className="text-sm leading-relaxed text-secondary/75">{description}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="mt-6 max-w-[80ch] text-sm leading-relaxed text-secondary/75">
        The 2022 independent review raised regulatory barriers to Pacific import and brine discharge under the earlier design. The revised concept is not approved; it would require feasibility studies, environmental review, engagement with Tribal nations and local communities, permits, and financing.
      </p>
      <Link to="/project/69f38e5e28d2f63599a4a8ce" className="mt-4 inline-flex text-sm font-medium text-background underline underline-offset-4 hover:text-secondary/75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">
        Explore the Salton Sea restoration concept
      </Link>
    </section>
  );
}