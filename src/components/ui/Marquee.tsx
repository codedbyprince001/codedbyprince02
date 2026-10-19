interface MarqueeProps {
  items: string[]
}

export function Marquee({ items }: MarqueeProps) {
  const row = [...items, ...items]
  return (
    <div
      className="overflow-hidden border-y border-line bg-coal py-4"
      role="presentation"
      aria-hidden
    >
      <div className="marquee-track">
        {row.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex shrink-0 items-center gap-8 pr-8 font-display text-3xl italic text-bone sm:text-4xl"
          >
            {item}
            <span className="h-2 w-2 rotate-45 bg-lime" />
          </span>
        ))}
      </div>
    </div>
  )
}
