import { useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Hls from 'hls.js'
import { ArrowDownRight, ArrowUpRight, ChevronRight, X } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const VIDEO_URL = 'https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8'

const projects = [
  { title: 'Automotive Motion', category: 'Digital Experience', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=85' },
  { title: 'Urban Architecture', category: 'Editorial Web', image: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1400&q=85' },
  { title: 'Human Perspective', category: 'Culture & Editorial', image: 'https://images.unsplash.com/photo-1496449903678-68ddcb189a24?auto=format&fit=crop&w=1400&q=85' },
  { title: 'Brand Identity', category: 'Strategy & Identity', image: 'https://images.unsplash.com/photo-1523726491678-bf852e717f6a?auto=format&fit=crop&w=1400&q=85' },
]

const thoughts = [
  ['Designing beyond the brief', '06 min read', 'SEP 18, 2026', 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1000&q=80'],
  ['A slower approach to digital', '04 min read', 'AUG 29, 2026', 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1000&q=80'],
  ['Why systems need personality', '05 min read', 'JUL 14, 2026', 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1000&q=80'],
  ['The internet after the noise', '07 min read', 'JUN 22, 2026', 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1000&q=80'],
]

const explorations = [
  ['Signal', '01', 'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=900&q=80'],
  ['Stillness', '02', 'https://images.unsplash.com/photo-1530533718754-001d2668365a?auto=format&fit=crop&w=900&q=80'],
  ['Velocity', '03', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80'],
  ['Texture', '04', 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=900&q=80'],
  ['Contrast', '05', 'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=900&q=80&sat=-100'],
  ['Atmosphere', '06', 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=80'],
]

function VideoBackground({ flipped = false, heavy = false }: { flipped?: boolean; heavy?: boolean }) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = ref.current
    if (!video) return
    let hls: Hls | null = null

    if (Hls.isSupported()) {
      hls = new Hls({ enableWorker: true, lowLatencyMode: false })
      hls.loadSource(VIDEO_URL)
      hls.attachMedia(video)
      hls.on(Hls.Events.MANIFEST_PARSED, () => void video.play().catch(() => undefined))
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = VIDEO_URL
      void video.play().catch(() => undefined)
    }

    return () => hls?.destroy()
  }, [])

  return (
    <div className={`absolute inset-0 overflow-hidden ${flipped ? 'scale-y-[-1]' : ''}`} aria-hidden="true">
      <video ref={ref} autoPlay muted loop playsInline className="absolute left-1/2 top-1/2 min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 object-cover opacity-80" />
      <div className={`absolute inset-0 bg-black/${heavy ? '65' : '30'}`} />
    </div>
  )
}

function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [count, setCount] = useState(0)
  const words = ['Design', 'Create', 'Inspire']
  const [wordIndex, setWordIndex] = useState(0)

  useEffect(() => {
    const started = performance.now()
    let frame = 0
    const tick = (now: number) => {
      const next = Math.min(100, Math.floor(((now - started) / 2700) * 100))
      setCount(next)
      if (next < 100) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    const wordTimer = window.setInterval(() => setWordIndex((i) => (i + 1) % words.length), 900)
    const complete = window.setTimeout(onComplete, 3100)
    return () => {
      cancelAnimationFrame(frame)
      window.clearInterval(wordTimer)
      window.clearTimeout(complete)
    }
  }, [])

  return (
    <motion.div initial={{ opacity: 1 }} animate={{ opacity: count === 100 ? 0 : 1 }} transition={{ delay: count === 100 ? 0.35 : 0, duration: 0.55 }} className="fixed inset-0 z-[9999] bg-bg px-6 py-6">
      <motion.p initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-xs uppercase tracking-[0.3em] text-muted">Portfolio</motion.p>
      <div className="absolute inset-0 grid place-items-center">
        <AnimatePresence mode="wait">
          <motion.h1 key={wordIndex} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} transition={{ duration: 0.4 }} className="font-display text-5xl italic text-text-primary/80 md:text-7xl lg:text-8xl">
            {words[wordIndex]}
          </motion.h1>
        </AnimatePresence>
      </div>
      <div className="absolute bottom-8 right-6">
        <span className="font-display text-7xl tabular-nums text-text-primary md:text-9xl">{String(count).padStart(3, '0')}</span>
      </div>
      <div className="absolute bottom-0 left-0 h-[3px] w-full bg-stroke/50">
        <div className="accent-gradient h-full origin-left transition-transform duration-75" style={{ transform: `scaleX(${count / 100})`, boxShadow: '0 0 8px rgba(137,170,204,.35)' }} />
      </div>
    </motion.div>
  )
}

function App() {
  const [loading, setLoading] = useState(true)
  const [roleIndex, setRoleIndex] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const [lightbox, setLightbox] = useState<(typeof explorations)[number] | null>(null)
  const roles = useMemo(() => ['Creative', 'Fullstack', 'Founder', 'Scholar'], [])
  const explorationRef = useRef<HTMLElement>(null)
  const parallaxRefs = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100)
    window.addEventListener('scroll', onScroll, { passive: true })
    const roleTimer = window.setInterval(() => setRoleIndex((i) => (i + 1) % roles.length), 2000)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.clearInterval(roleTimer)
    }
  }, [roles])

  useEffect(() => {
    if (loading) return
    const ctx = gsap.context(() => {
      gsap.from('.name-reveal', { opacity: 0, y: 50, duration: 1.2, delay: 0.1, ease: 'power3.out' })
      gsap.from('.blur-in', { opacity: 0, filter: 'blur(10px)', y: 20, duration: 1, delay: 0.3, stagger: 0.1, ease: 'power3.out' })
      gsap.utils.toArray<HTMLElement>('.reveal-on-scroll').forEach((el) => {
        gsap.from(el, { opacity: 0, y: 30, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 82%', once: true, margin: '-100px' } })
      })

      if (explorationRef.current) {
        ScrollTrigger.create({ trigger: explorationRef.current, start: 'top top', end: 'bottom bottom', pin: '.exploration-copy', pinSpacing: false })
      }
      parallaxRefs.current.forEach((el, index) => {
        const direction = index % 2 === 0 ? -160 : 180
        gsap.to(el, { y: direction, rotate: index % 2 === 0 ? 5 : -5, ease: 'none', scrollTrigger: { trigger: explorationRef.current, start: 'top bottom', end: 'bottom top', scrub: true } })
      })

      gsap.to('.marquee-track', { xPercent: -50, duration: 40, ease: 'none', repeat: -1 })
    })
    return () => ctx.revert()
  }, [loading])

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <div className="min-h-screen bg-bg text-text-primary">
      <AnimatePresence>{loading && <LoadingScreen onComplete={() => setLoading(false)} />}</AnimatePresence>

      <main>
        <section id="home" className="relative isolate flex min-h-screen items-center justify-center overflow-hidden">
          <VideoBackground />
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-bg to-transparent" />

          <nav className={`fixed left-0 right-0 top-0 z-50 flex justify-center px-4 pt-4 transition-all md:pt-6`}>
            <div className={`inline-flex items-center rounded-full border border-white/10 bg-surface/90 p-2 backdrop-blur-md transition-shadow ${scrolled ? 'shadow-xl shadow-black/20' : ''}`}>
              <button onClick={() => scrollTo('home')} className="group flex items-center gap-2 px-2" aria-label="Home">
                <span className="accent-ring grid h-9 w-9 place-items-center rounded-full bg-bg text-sm italic">
                  <span className="font-display text-[13px]">BR</span>
                </span>
              </button>
              <span className="mx-1 hidden h-5 w-px bg-stroke sm:block" />
              <div className="hidden items-center sm:flex">
                {['Home', 'Work', 'Resume'].map((item) => (
                  <button key={item} onClick={() => scrollTo(item === 'Home' ? 'home' : item === 'Work' ? 'work' : 'about')} className={`rounded-full px-3 py-2 text-xs transition sm:px-4 sm:text-sm ${item === 'Home' ? 'bg-stroke/50 text-text-primary' : 'text-muted hover:bg-stroke/50 hover:text-text-primary'}`}>
                    {item}
                  </button>
                ))}
              </div>
              <span className="mx-1 hidden h-5 w-px bg-stroke sm:block" />
              <button onClick={() => scrollTo('contact')} className="group relative rounded-full p-[1px] text-xs sm:text-sm">
                <span className="absolute inset-[-1px] rounded-full bg-gradient-to-r from-[#89AACC] to-[#4E85BF] opacity-0 transition-opacity group-hover:opacity-100" />
                <span className="relative flex items-center gap-2 rounded-full bg-surface px-4 py-2 text-text-primary">Say hi <ArrowUpRight size={14} /></span>
              </button>
            </div>
          </nav>

          <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
            <p className="blur-in mb-8 text-xs uppercase tracking-[0.3em] text-white/60">COLLECTION '26</p>
            <h1 className="name-reveal font-display text-7xl italic leading-[0.9] tracking-tight text-white sm:text-8xl lg:text-9xl">Bimarsh Rai</h1>
            <p className="mt-8 text-sm text-white/75 md:text-base">A <AnimatePresence mode="wait"><motion.span key={roleIndex} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.4 }} className="inline-block font-display text-xl italic text-white md:text-2xl">{roles[roleIndex]}</motion.span></AnimatePresence> lives in India.</p>
            <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-white/55 md:text-base">Designing seamless digital interactions by focusing on the unique nuances which bring systems to life.</p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <button onClick={() => scrollTo('work')} className="group rounded-full bg-white px-7 py-3.5 text-sm text-bg transition hover:scale-105 hover:bg-bg hover:text-white">
                See Works <ChevronRight className="ml-1 inline" size={15} />
              </button>
              <button onClick={() => scrollTo('contact')} className="rounded-full border-2 border-white/20 bg-bg/40 px-7 py-3.5 text-sm text-white transition hover:scale-105 hover:border-white/50">Reach out...</button>
            </div>
          </div>

          <div className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2 text-center">
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/50">Scroll</span>
            <div className="mx-auto mt-3 h-10 w-px overflow-hidden bg-white/20"><span className="block h-1/2 w-full bg-white/70 animate-scroll-down" /></div>
          </div>
        </section>

        <section id="work" className="bg-bg py-20 md:py-28">
          <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
            <SectionHeader eyebrow="Selected Work" title={<>Featured <em>projects</em></>} subtext="A selection of digital experiences, systems and visual directions built from concept to launch." />
            <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-12 md:gap-6">
              {projects.map((project, i) => (
                <a key={project.title} href="#contact" className={`group relative overflow-hidden rounded-[28px] border border-stroke bg-surface ${i % 4 === 0 ? 'md:col-span-7' : i % 4 === 1 ? 'md:col-span-5' : i % 4 === 2 ? 'md:col-span-5' : 'md:col-span-7'} aspect-[1.18] md:aspect-auto md:h-[430px]`}>
                  <img src={project.image} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 opacity-20 mix-blend-multiply" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '4px 4px' }} />
                  <div className="absolute inset-0 bg-bg/70 opacity-0 backdrop-blur-lg transition duration-500 group-hover:opacity-100" />
                  <div className="absolute inset-0 flex items-end justify-between p-6 opacity-0 transition duration-500 group-hover:opacity-100 md:p-8">
                    <div>
                      <p className="text-xs uppercase tracking-[0.25em] text-white/50">{project.category}</p>
                      <h3 className="mt-2 font-display text-4xl italic">{project.title}</h3>
                    </div>
                    <span className="rounded-full border border-white/20 bg-white/90 px-4 py-2 text-xs text-bg">View — <em className="font-display text-base">{project.title}</em></span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-bg py-20 md:py-28">
          <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
            <SectionHeader eyebrow="Journal" title={<>Recent <em>thoughts</em></>} subtext="Notes on design, systems, technology and the details that make digital work feel human." />
            <div className="mt-10 space-y-3">
              {thoughts.map(([title, read, date, image], i) => (
                <article key={title} className="group flex items-center gap-5 rounded-[40px] border border-stroke bg-surface/30 p-3 transition hover:bg-surface sm:p-4">
                  <img src={image} alt="" className="h-16 w-24 rounded-3xl object-cover grayscale transition group-hover:grayscale-0 sm:h-20 sm:w-28" />
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-display text-2xl italic sm:text-3xl">{title}</h3>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted">{read} · {date}</p>
                  </div>
                  <ArrowUpRight className="mr-3 shrink-0 text-muted transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-white" size={20} />
                </article>
              ))}
            </div>
          </div>
        </section>

        <section ref={explorationRef} className="relative min-h-[270vh] bg-bg overflow-hidden">
          <div className="exploration-copy relative z-10 flex h-screen items-center justify-center px-6 text-center">
            <div className="max-w-xl">
              <p className="text-xs uppercase tracking-[0.3em] text-muted">Explorations</p>
              <h2 className="mt-5 font-display text-6xl italic leading-none md:text-8xl">Visual <em>playground</em></h2>
              <p className="mx-auto mt-6 max-w-md text-sm leading-7 text-muted">Loose experiments, visual studies and the strange little ideas that don't fit inside a project brief.</p>
              <button onClick={() => scrollTo('contact')} className="mt-8 inline-flex items-center gap-2 rounded-full border border-stroke px-5 py-3 text-sm transition hover:border-white/30">Open playground <ArrowUpRight size={16} /></button>
            </div>
          </div>
          <div className="pointer-events-none absolute inset-0 z-20 mx-auto grid max-w-[1400px] grid-cols-2 gap-10 px-6 md:gap-40 md:px-12">
            {explorations.map((item, i) => (
              <button key={item[0]} ref={(el) => { if (el) parallaxRefs.current[i] = el }} onClick={() => setLightbox(item)} className={`pointer-events-auto group ${i % 2 === 0 ? 'mt-24' : 'mt-72'} aspect-square w-full max-w-[320px] self-start overflow-hidden rounded-[32px] border border-white/10 bg-surface text-left ${i % 2 === 0 ? 'justify-self-start' : 'justify-self-end'}`}>
                <img src={item[2]} alt={item[0]} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute bottom-5 left-5 text-xs uppercase tracking-[0.25em] text-white/70">{item[1]} · {item[0]}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="bg-bg py-20 md:py-28">
          <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-10 px-6 md:grid-cols-3 md:px-10 lg:px-16">
            {[
              ['04+', 'years creating digital work'],
              ['35+', 'projects shipped'],
              ['100%', 'curious about the next thing'],
            ].map(([num, label]) => (
              <div key={num} className="reveal-on-scroll border-t border-stroke pt-6">
                <p className="font-display text-6xl italic md:text-8xl">{num}</p>
                <p className="mt-4 text-xs uppercase tracking-[0.22em] text-muted">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className="relative overflow-hidden bg-bg pb-10 pt-20 md:pb-14 md:pt-28">
          <VideoBackground flipped heavy />
          <div className="absolute inset-0 bg-bg/45" />
          <div className="relative z-10">
            <div className="overflow-hidden whitespace-nowrap border-y border-white/10 py-3">
              <div className="marquee-track flex w-max font-display text-5xl italic text-white/90 md:text-8xl">
                {Array.from({ length: 10 }, (_, i) => <span key={i} className="px-4">BUILDING THE FUTURE •</span>)}
              </div>
            </div>
            <div className="mx-auto flex max-w-[1200px] flex-col items-start gap-8 px-6 py-24 md:px-10 lg:px-16">
              <p className="text-xs uppercase tracking-[0.3em] text-white/45">Have something in mind?</p>
              <h2 className="max-w-4xl font-display text-6xl italic leading-[0.92] md:text-8xl">Let's make the next <em>thing</em> memorable.</h2>
              <a href="mailto:bimarshwebsite@gmail.com" className="group inline-flex items-center gap-3 rounded-full border border-white/20 bg-white px-6 py-4 text-sm text-bg transition hover:scale-105">
                bimarshwebsite@gmail.com <ArrowUpRight size={17} />
              </a>
            </div>
            <footer className="mx-auto flex max-w-[1200px] flex-col gap-5 border-t border-white/10 px-6 pt-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between md:px-10 lg:px-16">
              <div className="flex flex-wrap gap-5"><a href="https://github.com/bimarshrai" target="_blank" rel="noreferrer" className="hover:text-white">GitHub</a><a href="#" className="hover:text-white">Instagram</a><a href="#" className="hover:text-white">Dribbble</a></div>
              <div className="flex items-center gap-2"><span className="h-2 w-2 animate-pulse rounded-full bg-[#a7e48a]" /> Available for projects</div>
              <span>© 2026 Bimarsh Rai</span>
            </footer>
          </div>
        </section>
      </main>

      <AnimatePresence>
        {lightbox && (
          <motion.div className="fixed inset-0 z-[9998] grid place-items-center bg-black/85 p-6 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setLightbox(null)}>
            <motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.96, opacity: 0 }} className="relative max-h-[90vh] max-w-4xl overflow-hidden rounded-3xl border border-white/10" onClick={(e) => e.stopPropagation()}>
              <img src={lightbox[2]} alt={lightbox[0]} className="max-h-[85vh] w-full object-contain" />
              <button onClick={() => setLightbox(null)} className="absolute right-4 top-4 rounded-full bg-black/60 p-3 text-white"><X size={18} /></button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function SectionHeader({ eyebrow, title, subtext }: { eyebrow: string; title: ReactNode; subtext: string }) {
  return (
    <div className="reveal-on-scroll flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <div>
        <div className="mb-6 flex items-center gap-3"><span className="h-px w-8 bg-stroke" /><span className="text-xs uppercase tracking-[0.3em] text-muted">{eyebrow}</span></div>
        <h2 className="font-display text-5xl italic leading-none md:text-7xl">{title}</h2>
        <p className="mt-5 max-w-xl text-sm leading-7 text-muted md:text-base">{subtext}</p>
      </div>
      <button className="hidden shrink-0 items-center gap-2 rounded-full border border-stroke px-5 py-3 text-sm transition hover:border-white/30 md:inline-flex">View all work <ArrowUpRight size={16} /></button>
    </div>
  )
}

export default App
