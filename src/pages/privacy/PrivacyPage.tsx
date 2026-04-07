import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
}

const listItemVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: 'easeOut' as const },
  },
}

const sections = [
  {
    num: '01',
    title: 'Información que recopilamos',
    content: 'A través de nuestro sitio web, recopilamos los siguientes datos personales mediante formularios:',
    list: [
      'Nombre completo',
      'Número de identificación (cédula)',
      'Número de teléfono / WhatsApp',
      'Dirección de envío',
      'Barrio',
      'Ciudad',
      'Notas adicionales (opcional)',
    ],
  },
  {
    num: '02',
    title: 'Finalidad del tratamiento de los datos',
    content: 'La información recopilada se utiliza para:',
    list: [
      'Procesar y gestionar pedidos',
      'Realizar envíos de productos',
      'Contactar al cliente en caso de ser necesario',
      'Mejorar nuestro servicio y atención',
    ],
  },
  {
    num: '03',
    title: 'Almacenamiento de la información',
    content: 'Los datos son almacenados de forma segura mediante servicios de terceros, específicamente Supabase (plataforma de base de datos y backend). Tomamos medidas razonables para proteger tu información contra accesos no autorizados, pérdida o alteración.',
  },
  {
    num: '04',
    title: 'Compartición de datos',
    content: 'No vendemos, alquilamos ni compartimos tu información personal con terceros, excepto en los siguientes casos:',
    list: [
      'Cuando sea necesario para completar un envío (por ejemplo, empresas de mensajería)',
      'Cuando sea requerido por ley',
    ],
  },
  {
    num: '05',
    title: 'Protección de datos',
    content: 'Implementamos medidas técnicas y organizativas para proteger tus datos personales. Sin embargo, ningún sistema es 100% seguro, por lo que no podemos garantizar seguridad absoluta.',
  },
  {
    num: '06',
    title: 'Derechos del usuario',
    content: 'Como usuario, tienes derecho a acceder a tus datos personales, solicitar la corrección de datos incorrectos, solicitar su eliminación, y retirar tu consentimiento en cualquier momento.',
    contact: 'sanchezdreik511@gmail.com',
  },
  {
    num: '07',
    title: 'Cookies',
    content: 'Nuestro sitio web puede utilizar cookies para mejorar la experiencia del usuario. Estas cookies no recopilan información personal sensible.',
  },
  {
    num: '08',
    title: 'Cambios en esta política',
    content: 'Nos reservamos el derecho de modificar esta Política de Privacidad en cualquier momento. Los cambios serán publicados en esta misma página.',
  },
  {
    num: '09',
    title: 'Contacto',
    content: 'Si tienes preguntas sobre esta Política de Privacidad, puedes contactarnos en:',
    contactLinks: true,
  },
]

export default function PrivacyPage() {
  return (
    <section className="min-h-screen pt-24 pb-24 px-6">
      <div className="max-w-3xl mx-auto">

        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <Link
            to="/"
            className="text-xs tracking-widest uppercase text-text-muted hover:text-neon inline-flex items-center gap-2 transition-colors duration-300 mb-12"
          >
            ← Volver al inicio
          </Link>
        </motion.div>

        {/* Header */}
        <div className="mb-16">
          <motion.p
            className="text-xs font-semibold tracking-ultra uppercase text-neon mb-3"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease, delay: 0.05 }}
          >
            Legal
          </motion.p>

          <motion.h1
            className="font-display text-5xl md:text-7xl tracking-wider text-text-primary uppercase leading-none"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease, delay: 0.1 }}
          >
            Política de<br />Privacidad
          </motion.h1>

          <motion.div
            className="mt-5 h-0.5 bg-neon"
            initial={{ width: 0 }}
            animate={{ width: 64 }}
            transition={{ delay: 0.4, duration: 0.55, ease: 'easeOut' }}
          />

          <motion.p
            className="mt-6 text-xs tracking-widest uppercase text-text-muted"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.55 }}
          >
            Última actualización: 06/04/2026
          </motion.p>
        </div>

        {/* Intro */}
        <motion.div
          className="mb-16 pb-16 border-b border-border"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease, delay: 0.25 }}
        >
          <p className="text-sm text-text-secondary leading-relaxed">
            En <span className="text-text-primary font-semibold">Krowm Gorras</span>, nos comprometemos a proteger la privacidad de nuestros usuarios. Esta Política de Privacidad explica cómo recopilamos, utilizamos y protegemos tu información personal.
          </p>
        </motion.div>

        {/* Sections */}
        <div className="flex flex-col gap-0">
          {sections.map((section) => (
            <motion.div
              key={section.num}
              className="group flex flex-col gap-5 py-10 border-b border-border last:border-0"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.55, ease }}
            >
              {/* Number + title */}
              <div className="flex items-baseline gap-5">
                <motion.span
                  className="font-display text-6xl leading-none select-none"
                  style={{ color: 'var(--color-border, #333)' }}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, ease }}
                >
                  {section.num}
                </motion.span>
                <h2 className="font-display text-2xl md:text-3xl tracking-wider text-text-primary uppercase leading-tight">
                  {section.title}
                </h2>
              </div>

              {/* Divider line that grows on scroll */}
              <motion.div
                className="h-px bg-neon/20"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
                style={{ originX: 0 }}
              />

              {/* Content text */}
              <motion.p
                className="text-sm text-text-secondary leading-relaxed"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.15 }}
              >
                {section.content}
                {section.contact && (
                  <>
                    {' '}Para ejercer estos derechos, contáctanos en{' '}
                    <a href={`mailto:${section.contact}`} className="text-neon hover:underline transition-colors">
                      {section.contact}
                    </a>
                  </>
                )}
              </motion.p>

              {/* List items with stagger */}
              {section.list && (
                <motion.ul
                  className="flex flex-col gap-2.5"
                  variants={listVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-20px' }}
                >
                  {section.list.map((item) => (
                    <motion.li
                      key={item}
                      variants={listItemVariants}
                      className="flex items-start gap-3 text-sm text-text-secondary"
                    >
                      <motion.span
                        className="mt-2 w-1.5 h-1.5 bg-neon rounded-full flex-shrink-0"
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                      />
                      {item}
                    </motion.li>
                  ))}
                </motion.ul>
              )}

              {/* Contact links */}
              {section.contactLinks && (
                <motion.div
                  className="flex flex-col gap-2"
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <a
                    href="mailto:sanchezdreik511@gmail.com"
                    className="text-neon text-sm hover:underline transition-colors w-fit"
                  >
                    sanchezdreik511@gmail.com
                  </a>
                  <a
                    href="tel:+573018100766"
                    className="text-text-secondary text-sm hover:text-neon transition-colors duration-300 w-fit"
                  >
                    +57 301 8100 766
                  </a>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Footer note */}
        <motion.div
          className="mt-16 pt-10 border-t border-border text-center"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease }}
        >
          <p className="text-xs text-text-muted tracking-widest uppercase">
            Al utilizar nuestro sitio web, aceptas esta Política de Privacidad.
          </p>
          <motion.div
            className="mt-6 h-px bg-neon/20 mx-auto"
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
          />
        </motion.div>

      </div>
    </section>
  )
}
