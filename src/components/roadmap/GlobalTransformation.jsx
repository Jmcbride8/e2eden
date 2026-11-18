import React from 'react';
import BasinStoryCard from '@/components/roadmap/BasinStoryCard';

const IMAGES = 'https://cdn.prod.website-files.com/61fcb39f40aa4c2166e85c08/';
const SITE = 'https://www.engineeringtoeden.com/about/';
const basins = [
  ['Salton Sea', 'about-salton-sea', '62002f2161292b7ca034e907_Salton_Sea_space_7.PNG',
    'The California starting point. As the lake shrinks, exposed lakebed can release dust and rising salinity puts habitat under pressure. Phase 3 asks whether farm cooling, seawater conveyance and inland salt management could work together here.',
    ['California, USA', 'Regional concept', 'Brine management', 'Habitat'], 'center 20%'],
  ['Dead Sea', 'the-dead-sea', '62002f9df698eaff48932a3e_Dead_Sea_space_6.PNG',
    'Diversions reduced the Jordan River’s inflow, and the shoreline has receded. Past Red Sea and Mediterranean conveyance proposals show why water chemistry and cross-border coordination matter as much as engineering.',
    ['Jordan Rift Valley', 'Receding lake', 'Water chemistry', 'Shared basin'], 'center 20%'],
  ['Great Salt Lake', 'the-great-salt-lake', '6456c35b53f1ecb700e967d0_Salt%20Lake.JPG',
    'This shallow, closed basin depends on freshwater inflows and supports migratory birds. It poses a different question: could verified agricultural water savings help restore inflows under local water agreements, without importing seawater?',
    ['Utah, USA', 'Freshwater inflow', 'Conservation', 'Bird habitat'], 'center center'],
  ['Kati Thanda–Lake Eyre', 'lake-eyre', '62002deaf698ea4990932286_Lake_Eyre_space_3.png',
    'This inland salt lake naturally alternates between dry periods and floods that sustain bursts of wildlife. Historic ocean-import ideas are a starting point for study, not a restoration plan: permanent water could alter the ecosystem’s flood-and-dry cycle.',
    ['South Australia', 'Ephemeral lake', 'Flood cycles', 'Concept only'], 'center 20%'],
  ['Qattara Depression', 'the-qattara-depression', '61fea90f25351edcadd98bc9_Qattara_space_2.png',
    'In Egypt’s Western Desert, this below-sea-level basin inspired proposals to bring in Mediterranean water and generate hydropower. Unlike the shrinking lakes, this is a basin-creation concept, with open questions about conveyance, salinity and ecological impacts.',
    ['Egypt', 'Desert basin', 'Hydropower concept', 'Concept only'], 'center 20%'],
];

export default function GlobalTransformation() {
  return (
    <section id="global-transformation" aria-labelledby="roadmap-global" className="scroll-mt-28">
      <header className="mb-7 max-w-3xl sm:mb-9">
        <p className="mb-3 text-xs font-semibold tracking-[0.16em] text-secondary/[0.85]">ACT III <span className="ml-2 font-normal tracking-normal text-secondary/60">Going Global</span></p>
        <h2 id="roadmap-global" className="mb-3 text-2xl font-semibold leading-tight tracking-tight text-background sm:text-4xl">Global Transformation</h2>
        <p className="max-w-[68ch] text-base leading-relaxed text-secondary/75">Start with farms. Prove net freshwater savings in the field, then scale what works with growers across the Southwest. The Salton Sea is the first basin-scale concept. From there, the ambition goes global: apply what we learn where local water, ecology and communities make a case for it.</p>
      </header>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {basins.map(([name, slug, image, description, tags, imagePosition]) => (
          <BasinStoryCard key={slug} name={name} description={description} tags={tags} image={IMAGES + image} imagePosition={imagePosition} href={`${SITE}seas/${slug}`} />
        ))}
      </div>
      <p className="mt-7 max-w-[75ch] text-sm leading-relaxed text-secondary/75">These are places to study, not committed projects. Each basin would need its own water and salt balance, ecological review, and local agreement. <a href={`${SITE}going-global`} target="_blank" rel="noopener noreferrer" className="text-background underline underline-offset-4">Explore the full Going Global vision</a>.</p>
    </section>
  );
}