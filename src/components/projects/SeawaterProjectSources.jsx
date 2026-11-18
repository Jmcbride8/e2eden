import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const archive = ['Seawater Greenhouse project archive', 'https://www.seawatergreenhouse.com/projects'];
const impact = ['Aston University research impact case study (PDF)', 'https://results2021.ref.ac.uk/impact/c08ec50a-ac5c-4f76-b521-087856e2656e/pdf'];
const sourcesByProject = {
  '6995368b048fb0f30a98c37d': [
    ['Tenerife project archive and photographs', 'https://karl-fletcher-r8l3.squarespace.com/tenerife'],
    ['Paton & Davies: The Seawater Greenhouse for Arid Lands (1996)', 'https://www.researchgate.net/publication/272621549_The_Seawater_Greenhouse_for_Arid_Lands'],
  ],
  '69a8c1257424bd87cfa0274e': [
    ['Davies & Paton: Thermal modelling of the UAE prototype (2005)', 'https://doi.org/10.1016/j.desal.2004.06.211'],
    ['McCartney & Lefsrud: Protected Agriculture in Extreme Environments (2018)', 'https://elibrary.asabe.org/azdez.asp?AID=48745&T=2'],
    ['WIRED: The history of Seawater Greenhouse', 'https://www.wired.com/story/charlie-paton-seawater-greenhouse-desalination-abu-dhabi-oman-australia-somaliland/'],
  ],
  '6995368b048fb0f30a98c37b': [
    archive,
    ['Oman project archive and photographs', 'https://karl-fletcher-r8l3.squarespace.com/oman'],
    ['Al-Ismaili & Jayasuriya: Seawater Greenhouse in Oman (2016)', 'https://doi.org/10.1016/j.rser.2015.10.016'],
    ['Research on improving the Oman greenhouse condenser', 'https://www.sciencedirect.com/science/article/abs/pii/S1364032110000869'],
  ],
  '69953b473b519eab96715a6b': [
    archive, impact,
    ['ABC News: Sundrop Farms opens its commercial greenhouse (2016)', 'https://www.abc.net.au/news/2016-10-01/sundrop-farms-opens-solar-greenhouse-using-no-fresh-water/7892866'],
    ['Alfa Laval case study: Solar thermal desalination at Sundrop Farms', 'https://www.alfalaval.com/media/stories/fresh-water/how-to-grow-tomatoes-in-the-desert/'],
  ],
  '6995368b048fb0f30a98c37c': [
    archive, impact,
    ['Berbera pilot: Project team’s account of funding and construction', 'https://www.sgsomaliland.com/take-action'],
    ['Akinaga et al.: Brine cooling and salt production (2018)', 'https://doi.org/10.1016/j.desal.2017.10.025'],
    ['Freethink: Growing Crops in the Desert with Seawater', 'https://www.youtube.com/watch?v=PvV-iPdORLc'],
  ],
};

export default function SeawaterProjectSources({ projectId }) {
  const sources = sourcesByProject[projectId];
  if (!sources) return null;

  return (
    <section aria-labelledby="project-sources-heading">
      <p className="text-amber-400 text-xs font-semibold uppercase tracking-widest">Further Reading</p>
      <h2 id="project-sources-heading" className="mt-1 text-3xl font-bold">Sources</h2>
      <ul className="mt-5 divide-y divide-white/10 border-y border-white/10">
        {sources.map(([title, url]) => <li key={url}>
          <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-start justify-between gap-4 py-3 text-white/80 transition-colors hover:text-amber-400">
            {title}<ArrowUpRight aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-amber-400" />
          </a>
        </li>)}
      </ul>
    </section>
  );
}