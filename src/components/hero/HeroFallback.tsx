export function HeroFallback() {
  return (
    <div className="relative flex h-full w-full items-center justify-center" aria-hidden>
      <div className="absolute h-[62%] aspect-square rotate-12 border border-lime/50" />
      <div className="absolute h-[44%] aspect-square -rotate-6 border border-cream/20" />
      <div className="coin-fallback relative flex h-[42%] aspect-square items-center justify-center rounded-full font-sans text-[clamp(3rem,10vw,6rem)] font-extrabold text-ink">
        ₦
      </div>
    </div>
  )
}
