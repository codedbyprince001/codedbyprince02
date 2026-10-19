import { supporters } from '../../data/supporters'
import { Reveal } from '../ui/Reveal'

export function SupporterWall() {
  return (
    <div>
      <Reveal>
        <h3 className="display text-4xl text-cream sm:text-6xl">Wall of legends</h3>
      </Reveal>
      <ul className="mt-8 grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {supporters.map((supporter) => (
            <li key={`${supporter.name}-${supporter.message ?? ''}`} className="bg-ink p-6">
              <p className="font-sans text-xl font-semibold text-cream">{supporter.name}</p>
              {supporter.amountLabel && (
                <p className="mt-1 font-mono text-xs uppercase tracking-widest text-lime">{supporter.amountLabel}</p>
              )}
              {supporter.message && <p className="mt-3 text-bone">“{supporter.message}”</p>}
            </li>
          ))}
      </ul>
    </div>
  )
}
