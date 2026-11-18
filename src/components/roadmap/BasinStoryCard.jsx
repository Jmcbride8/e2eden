import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowUpRight, Heart } from 'lucide-react';
import dissolveBasinPhoto from '@/components/roadmap/dissolveBasinPhoto';
import '@/components/roadmap/basin-story-card.css';

export default function BasinStoryCard({ name, description, tags, image, href }) {
  const card = useRef(null);
  const body = useRef(null);
  const media = useRef(null);
  const photo = useRef(null);
  const key = `e2eden:basin-favourite:${name}`;
  const [saved, setSaved] = useState(() => localStorage.getItem(key) === 'true');

  useLayoutEffect(() => {
    const measure = () => {
      const height = [...body.current.children].reduce((sum, child) => sum + child.getBoundingClientRect().height, 40);
      card.current.style.setProperty('--cs5-photo', `${Math.ceil(height)}px`);
    };
    measure();
    const observer = new ResizeObserver(measure);
    for (const child of body.current.children) observer.observe(child);
    return () => observer.disconnect();
  }, []);

  useEffect(() => dissolveBasinPhoto(media.current, photo.current), []);

  return (
    <div className="cs5-section">
      <article ref={card} className="cs5-card">
        <div ref={media} className="cs5-media">
          <img ref={photo} className="cs5-photo" src={image} alt={`Satellite view of ${name}`} loading="lazy" decoding="async" />
          <button type="button" className="cs5-fav" title={saved ? 'Remove from favourites' : 'Save to favourites'} aria-pressed={saved} aria-label={`Favourite ${name}`} onClick={() => { localStorage.setItem(key, String(!saved)); setSaved(!saved); }}>
            <span className="cs5-fav-disc"><Heart size={17} aria-hidden="true" /></span>
          </button>
        </div>
        <div ref={body} className="cs5-body">
          <div className="cs5-text">
            <h3 className="cs5-title">{name}</h3>
            <p className="cs5-desc">{description}</p>
            <a className="cs5-link" href={href} target="_blank" rel="noopener noreferrer" aria-label={`Read the basin story: ${name} (opens in a new tab)`}>Read the basin story <ArrowUpRight size={14} aria-hidden="true" /></a>
          </div>
          <ul className="cs5-tags">
            {tags.map((tag, index) => <li key={tag} className="cs5-tag" style={{ '--cs5-delay': `${200 + 70 * Math.min(index, 7)}ms` }}>{tag}</li>)}
          </ul>
        </div>
      </article>
    </div>
  );
}