import React, { useState } from 'react';
import { ArrowUpRight, Heart, MapPin } from 'lucide-react';

export default function BasinStoryCard({ name, description, tags, image, href }) {
  const key = `e2eden:basin-favourite:${name}`;
  const [saved, setSaved] = useState(() => localStorage.getItem(key) === 'true');
  const [location, ...topics] = tags;

  return (
    <article className="relative flex flex-col overflow-hidden rounded-xl border border-border/[0.15] bg-muted/5">
      <img src={image} alt={`Satellite view of ${name}`} loading="lazy" decoding="async" className="aspect-[16/10] w-full object-cover" />
      <button
        type="button"
        className="absolute right-3 top-3 grid size-10 place-items-center rounded-full bg-foreground/80 text-background hover:bg-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-background"
        title={saved ? 'Remove from favourites' : 'Save to favourites'}
        aria-pressed={saved}
        aria-label={`Favourite ${name}`}
        onClick={() => { localStorage.setItem(key, String(!saved)); setSaved(!saved); }}
      >
        <Heart size={16} className={saved ? 'fill-current' : undefined} aria-hidden="true" />
      </button>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="mb-2 text-lg font-semibold leading-snug text-background">{name}</h3>
        <p className="mb-3 flex items-center gap-1.5 text-xs text-secondary/60">
          <MapPin className="size-3.5 shrink-0" aria-hidden="true" />{location}
        </p>
        <p className="text-sm leading-relaxed text-secondary/75">{description}</p>
        <p className="mt-3 text-xs leading-relaxed text-secondary/60">{topics.join(' · ')}</p>
        <div className="mt-auto pt-4">
          <a className="inline-flex items-center gap-1.5 text-sm font-medium text-background underline underline-offset-4 hover:text-secondary/75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4" href={href} target="_blank" rel="noopener noreferrer" aria-label={`Read the basin story: ${name} (opens in a new tab)`}>
            Read the basin story <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        </div>
      </div>
    </article>
  );
}