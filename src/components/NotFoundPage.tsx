import { useNavigate } from 'react-router-dom'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <p className="text-xs font-semibold tracking-ultra uppercase text-neon mb-4">Error 404</p>
      <h1 className="font-display text-[12rem] leading-none tracking-wider text-surface-lighter select-none">
        404
      </h1>
      <p className="font-display text-3xl md:text-5xl tracking-wider text-text-primary mt-2 uppercase">
        Página no encontrada
      </p>
      <div className="mt-4 w-12 h-0.5 bg-neon mx-auto" />
      <p className="mt-6 text-sm text-text-muted tracking-wide max-w-sm">
        La página que buscas no existe o fue movida.
      </p>
      <button
        type="button"
        onClick={() => navigate('/')}
        className="mt-10 inline-flex items-center gap-3 bg-neon hover:bg-neon-hover text-surface text-xs font-bold tracking-widest uppercase px-8 py-4 transition-[background-color,box-shadow] duration-300 neon-box-glow"
      >
        ← Volver al catálogo
      </button>
    </section>
  )
}
