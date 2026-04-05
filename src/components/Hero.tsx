export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Video background */}
      <video
        className="absolute inset-0 w-full h-full object-cover scale-105"
        src="/video/video-web.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      />

      {/* Dark overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-surface/70 via-surface/50 to-surface" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Tagline */}
        <p className="text-xs md:text-sm font-semibold tracking-ultra uppercase text-neon mb-6 animate-fade-up">
          Streetwear Headwear
        </p>

        {/* Main title */}
        <h1 className="font-display text-[5rem] md:text-[9rem] lg:text-[12rem] leading-[0.85] tracking-wider text-text-primary mb-6 animate-fade-up [animation-delay:100ms] [text-wrap:balance]">
          KROWM
        </h1>

        {/* Subtitle */}
        <p className="text-sm md:text-base text-text-secondary tracking-widest uppercase font-light mb-12 animate-fade-up [animation-delay:200ms]">
          Gorras premium &mdash; Colombia
        </p>

        {/* CTA */}
        <div className="animate-fade-up [animation-delay:350ms]">
          <a
            href="#catalogo"
            className="inline-block bg-neon text-surface text-xs font-bold tracking-widest uppercase px-12 py-4 hover:bg-neon-hover transition-[background-color,box-shadow] duration-300 neon-box-glow"
          >
            Ver catálogo
          </a>
        </div>
      </div>

      {/* Marquee ticker */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-border bg-surface/80 backdrop-blur-sm py-3 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap flex gap-8">
          {Array.from({ length: 2 }).map((_, i) => (
            <span key={i} className="flex gap-8 text-[10px] tracking-ultra uppercase text-text-muted font-semibold">
              <span>Envío a todo Colombia</span>
              <span className="text-neon">//</span>
              <span>Gorras Premium</span>
              <span className="text-neon">//</span>
              <span>Streetwear Auténtico</span>
              <span className="text-neon">//</span>
              <span>Pide por WhatsApp</span>
              <span className="text-neon">//</span>
              <span>Envío a todo Colombia</span>
              <span className="text-neon">//</span>
              <span>Gorras Premium</span>
              <span className="text-neon">//</span>
              <span>Streetwear Auténtico</span>
              <span className="text-neon">//</span>
              <span>Pide por WhatsApp</span>
              <span className="text-neon">//</span>
            </span>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-muted animate-pulse-neon">
        <span className="text-[10px] tracking-ultra uppercase">Scroll</span>
        <span className="w-px h-8 bg-neon/40" />
      </div>
    </section>
  )
}
