import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { ArrowRight, Github, Linkedin, Mail, Instagram, Sparkles, ChevronLeft, ChevronRight, GraduationCap, ExternalLink, Clock, Calendar, CheckCircle2 } from "lucide-react";
import projectNeural from "@/assets/project-neural.jpg";
import logo from "@/assets/logo.png";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Gabriela Cavalheiro — Front-End & Machine Learning" },
      { name: "description", content: "Portfólio de Gabriela Cavalheiro: desenvolvedora Front-End e estudante de Machine Learning." },
    ],
  }),
  component: Index,
});

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Github, Linkedin, Instagram,
};

const marqueeWords = [
  "React", "TypeScript", "Next.js", "Tailwind", "Python", "Pandas",
  "Scikit-Learn", "Figma", "Node.js", "MySQL", "Machine Learning", "Front-End",
];

type Profile    = { name: string; headline: string; bio: string; email: string; about: string };
type Project    = { id: string; title: string; description: string; tags: string[]; image_url: string | null; link_url: string | null; features: string[] | null };
type Skill      = { id: string; category: string; items: string; sort_order: number };
type SkillItem  = { id: string; skill_id: string; name: string; level: number; sort_order: number };
type Social     = { id: string; label: string; url: string; icon: string };
type Course     = { id: string; title: string; institution: string; hours: number | null; year: number | null; category: string | null; certificate_url: string | null; sort_order: number };

function Annotation({ children }: { children: React.ReactNode }) {
  return <div className="font-mono text-xs text-muted-foreground tracking-wide">... /{children} ...</div>;
}

function ProjectCard({ p }: { p: Project }) {
  const [showFeatures, setShowFeatures] = useState(false);
  const hasFeatures = p.features && p.features.length > 0;

  return (
    <article className="group relative rounded-2xl border border-border overflow-hidden bg-background/60 transition-all duration-500 hover:opacity-100 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10">
      <div className="aspect-[4/3] overflow-hidden relative">
        <img src={p.image_url || projectNeural} alt={p.title} loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        {hasFeatures && (
          <button onClick={() => setShowFeatures((v) => !v)} aria-label="Ver características"
            className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-primary hover:text-background hover:border-primary transition-all z-10">
            <Sparkles className="w-3.5 h-3.5" />
          </button>
        )}
        {hasFeatures && showFeatures && (
          <div className="absolute inset-0 bg-background/95 backdrop-blur-sm p-4 flex flex-col justify-center z-20 animate-rise">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-xs text-primary">Características</span>
              <button onClick={() => setShowFeatures(false)} className="text-muted-foreground hover:text-foreground text-xs">✕</button>
            </div>
            <ul className="space-y-2">
              {p.features!.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-foreground">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-semibold text-base mb-2 leading-tight">{p.title}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed mb-4">{p.description}</p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {p.tags.map((t) => (
            <span key={t} className="px-2 py-0.5 text-[10px] font-mono border border-border rounded-full text-muted-foreground">{t}</span>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {p.link_url && (
            <a href={p.link_url} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-foreground text-background text-xs font-medium group-hover:gap-3 transition-all">
              Ver mais <ArrowRight className="w-3 h-3" />
            </a>
          )}
          {hasFeatures && (
            <button onClick={() => setShowFeatures((v) => !v)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-xs text-muted-foreground hover:border-primary hover:text-primary transition-all">
              <Sparkles className="w-3 h-3" />Features
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

function ProjectsCarousel({ projects }: { projects: Project[] }) {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const prev = () => setCurrent((c) => (c - 1 + projects.length) % projects.length);
  const next = () => setCurrent((c) => (c + 1) % projects.length);
  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 40) next(); else if (diff < -40) prev();
    touchStartX.current = null;
  };
  if (projects.length === 0) return null;
  return (
    <div className="relative" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <ProjectCard p={projects[current]} />
      {projects.length > 1 && (
        <div className="flex items-center justify-between mt-4">
          <button onClick={prev} aria-label="Projeto anterior"
            className="flex items-center justify-center w-9 h-9 rounded-full border border-border bg-background/60 hover:border-foreground transition">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex gap-2">
            {projects.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all ${i === current ? "bg-primary w-5" : "bg-border w-2"}`} />
            ))}
          </div>
          <button onClick={next} aria-label="Próximo projeto"
            className="flex items-center justify-center w-9 h-9 rounded-full border border-border bg-background/60 hover:border-foreground transition">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

// Barra de progresso animada
function SkillBar({ name, level }: { name: string; level: number }) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-foreground">{name}</span>
        <span className="text-[10px] font-mono text-muted-foreground">{level}%</span>
      </div>
      <div className="h-1 rounded-full bg-border overflow-hidden">
        <div
          className="h-full rounded-full relative overflow-hidden transition-all duration-1000 ease-out"
          style={{
            width: animated ? `${level}%` : "0%",
            background: level === 100
              ? "linear-gradient(90deg, var(--primary), var(--primary-glow))"
              : level >= 90
              ? "linear-gradient(90deg, var(--primary), var(--primary-glow))"
              : "var(--primary)",
          }}
        >
          <span className="absolute inset-0 animate-shimmer"
            style={{ background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)" }} />
        </div>
      </div>
    </div>
  );
}

function Index() {
  const [profile,    setProfile]    = useState<Profile | null>(null);
  const [projects,   setProjects]   = useState<Project[]>([]);
  const [skills,     setSkills]     = useState<Skill[]>([]);
  const [skillItems, setSkillItems] = useState<SkillItem[]>([]);
  const [socials,    setSocials]    = useState<Social[]>([]);
  const [courses,    setCourses]    = useState<Course[]>([]);

  useEffect(() => {
    void (async () => {
      const [p, pr, sk, si, so, co] = await Promise.all([
        supabase.from("profile").select("name,headline,bio,email,about").eq("id", 1).single(),
        supabase.from("projects").select("*").order("sort_order"),
        supabase.from("skills").select("*").order("sort_order"),
        supabase.from("skill_items").select("*").order("sort_order"),
        supabase.from("social_links").select("*").order("sort_order"),
        supabase.from("courses").select("*").order("sort_order"),
      ]);
      if (p.data)  setProfile(p.data);
      if (pr.data) setProjects(pr.data);
      if (sk.data) setSkills(sk.data);
      if (si.data) setSkillItems(si.data);
      if (so.data) setSocials(so.data);
      if (co.data) setCourses(co.data);
    })();
  }, []);

  const firstName = profile?.name?.split(" ")[0]?.toUpperCase() ?? "GABRIELA";

  const coursesByCategory = courses.reduce<Record<string, Course[]>>((acc, c) => {
    const cat = c.category ?? "Outros";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(c);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-background text-foreground font-sans relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-30 blur-3xl animate-blob"
        style={{ background: "radial-gradient(circle, var(--primary) 0%, transparent 70%)" }} />
      <div aria-hidden className="pointer-events-none absolute top-[600px] -right-40 w-[500px] h-[500px] rounded-full opacity-20 blur-3xl animate-blob"
        style={{ background: "radial-gradient(circle, var(--primary-glow) 0%, transparent 70%)", animationDelay: "-5s" }} />
      <div aria-hidden className="pointer-events-none absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full border border-border opacity-40 animate-spin-slow" />

      {/* ── Hero ── */}
      <main className="max-w-6xl mx-auto px-6 pt-20 pb-32 relative">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24 animate-rise">
          <Annotation>About project</Annotation>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-md">
            Este é meu portfólio como{" "}
            <em className="text-foreground not-italic font-medium">desenvolvedora Front-End</em> e estudante de{" "}
            <em className="text-foreground not-italic font-medium">Machine Learning</em>. Aqui compartilho minha jornada, projetos e contato.
          </p>
        </section>

        <section className="relative rounded-[40px] border border-border bg-card/40 backdrop-blur-sm p-8 md:p-12 mb-0 overflow-hidden animate-rise" style={{ animationDelay: "0.1s" }}>
          <div aria-hidden className="absolute inset-x-0 top-0 h-px overflow-hidden">
            <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-foreground/60 to-transparent animate-shimmer" />
          </div>
          <div className="flex items-start justify-between mb-12">
            <img src={logo} alt={profile?.name ?? "gabriela/dev"} className="h-8 md:h-10 w-auto" />
            <nav className="hidden md:flex gap-8 text-sm text-muted-foreground">
              <a href="#sobre"    className="hover:text-foreground transition-colors">Sobre</a>
              <a href="#projetos" className="hover:text-foreground transition-colors">Projetos</a>
              <a href="#cursos"   className="hover:text-foreground transition-colors">Cursos</a>
              <a href="#stack"    className="hover:text-foreground transition-colors">Stack</a>
              <a href="#contato"  className="hover:text-foreground transition-colors">Contato</a>
            </nav>
          </div>

          <p className="font-mono text-sm text-muted-foreground mb-2">prazer,</p>
          <h1 className="font-mono font-bold tracking-tighter leading-[0.95] text-[14vw] md:text-[7.5rem] mb-2 bg-clip-text text-transparent animate-gradient"
            style={{ backgroundImage: "linear-gradient(90deg, var(--foreground), var(--primary), var(--primary-glow), var(--foreground))" }}>
            <span className="block">{firstName}!</span>
          </h1>
          <p className="font-mono text-sm text-muted-foreground mb-2">Desenvolvedora,</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-8">
            <h2 className="font-mono font-bold tracking-tighter leading-[0.95] text-[10vw] md:text-[5.5rem]">FRONT-END</h2>
            <a href="#projetos" className="group relative inline-flex items-center justify-between gap-6 px-6 md:px-8 py-3 md:py-4 rounded-full bg-foreground text-background font-sans text-base md:text-xl font-medium hover:scale-[1.04] transition-transform">
              <span className="absolute inset-0 rounded-full border border-foreground/40 animate-pulse-ring" aria-hidden />
              <span>Projetos</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <span className="font-mono font-bold tracking-tighter text-[10vw] md:text-[5.5rem]">+ ML</span>
          </div>
          <p className="text-sm md:text-base text-muted-foreground max-w-md leading-relaxed mb-8">
            {profile?.bio ?? "Carregando..."}
          </p>
          <div className="flex flex-wrap gap-3">
            {socials.map((s) => {
              const Icon = iconMap[s.icon] ?? Github;
              return (
                <a key={s.id} href={s.url} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border text-sm hover:border-foreground hover:-translate-y-0.5 transition">
                  <Icon className="w-4 h-4" />{s.label}
                </a>
              );
            })}
          </div>
        </section>
      </main>

      {/* ── Marquee ── */}
      <div aria-hidden className="my-20 overflow-hidden border-y border-border py-6 bg-card/20 w-screen">
        <div className="flex gap-12 animate-marquee whitespace-nowrap font-mono text-2xl md:text-4xl text-muted-foreground w-max">
          {[...marqueeWords, ...marqueeWords, ...marqueeWords, ...marqueeWords].map((w, i) => (
            <span key={i} className="flex items-center gap-12">{w}<Sparkles className="w-5 h-5 text-primary" /></span>
          ))}
        </div>
      </div>

      {/* ── Bloco 2 ── */}
      <div className="max-w-6xl mx-auto px-6 pb-32 relative">

        {/* Sobre mim */}
        <section id="sobre" className="flex flex-col md:flex-row gap-12 mb-32 items-stretch">
          <div className="flex-1 flex flex-col justify-center">
            <Annotation>Sobre mim</Annotation>
            <p className="text-base md:text-lg leading-relaxed whitespace-pre-line mt-4">{profile?.about ?? ""}</p>
          </div>
          <div className="w-full md:w-[320px] shrink-0">
            <div className="rounded-3xl border border-border bg-gradient-to-br from-card/60 to-background w-full h-full min-h-[300px] relative flex items-center justify-center overflow-hidden">
              <div className="absolute inset-6 rounded-full border border-border/60 animate-spin-slow" />
              <div className="absolute inset-12 rounded-full border border-border/40 animate-spin-reverse" />
              <div className="absolute inset-20 rounded-full border border-border/30 animate-spin-slow" style={{ animationDuration: "40s" }} />
              <div className="absolute inset-6 animate-spin-slow">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_20px_var(--primary)]" />
              </div>
              <div className="absolute inset-12 animate-spin-reverse">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary-glow shadow-[0_0_15px_var(--primary-glow)]" />
              </div>
              <div className="relative w-40 h-40 animate-blob animate-float"
                style={{ background: "radial-gradient(circle at 30% 30%, var(--primary-glow), var(--primary) 60%, transparent 100%)", filter: "blur(2px)" }} />
              <div className="absolute font-mono text-xs text-foreground/80 tracking-widest animate-float">{"</> + AI"}</div>
            </div>
          </div>
        </section>

        {/* Projetos */}
        <section id="projetos" className="mb-32">
          <Annotation>Projetos</Annotation>
          <div className="mt-6">
            <div className="md:hidden"><ProjectsCarousel projects={projects} /></div>
            <div className="hidden md:grid md:grid-cols-3 gap-4">
              {projects.map((p, i) => (
                <div key={p.id} className={i !== 0 ? "opacity-60 hover:opacity-100 transition-opacity duration-300" : ""}>
                  <ProjectCard p={p} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Cursos */}
        <section id="cursos" className="mb-32">
          <Annotation>Cursos</Annotation>
          <div className="mt-6 space-y-8">
            {Object.keys(coursesByCategory).length === 0 ? (
              <p className="text-sm text-muted-foreground font-mono">Nenhum curso cadastrado ainda.</p>
            ) : (
              Object.entries(coursesByCategory).map(([category, items]) => (
                <div key={category}>
                  <div className="flex items-center gap-2 mb-4">
                    <GraduationCap className="w-4 h-4 text-primary" />
                    <span className="font-mono text-sm font-medium text-foreground">{category}</span>
                    <div className="flex-1 h-px bg-border ml-2" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {items.map((c) => (
                      <div key={c.id}
                        className="group rounded-2xl border border-border px-5 py-4 bg-card/30 backdrop-blur-sm hover:border-foreground/30 hover:bg-card/60 transition-all duration-300">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm leading-tight mb-1">{c.title}</h4>
                            <p className="font-mono text-xs text-primary truncate">{c.institution}</p>
                          </div>
                          {c.certificate_url && (
                            <a href={c.certificate_url} target="_blank" rel="noreferrer" aria-label="Ver certificado"
                              className="shrink-0 w-7 h-7 rounded-full border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors">
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                        <div className="flex items-center gap-4 mt-3">
                          {c.hours && (
                            <span className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground">
                              <Clock className="w-3 h-3" />{c.hours}h
                            </span>
                          )}
                          {c.year && (
                            <span className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground">
                              <Calendar className="w-3 h-3" />{c.year}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Stack */}
        <section id="stack" className="mb-32">
          <Annotation>Stack</Annotation>
          <div className="space-y-6 mt-6">
            {skills.map((s) => {
              const items = skillItems
                .filter((si) => si.skill_id === s.id)
                .sort((a, b) => a.sort_order - b.sort_order);

              return (
                <div key={s.id}
                  className="rounded-2xl border border-border px-6 py-5 bg-card/30 backdrop-blur-sm transition-all duration-500 hover:border-foreground/40 hover:bg-card/60">
                  <div className="font-medium text-sm mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    {s.category}
                  </div>
                  {items.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                      {items.map((item) => (
                        <SkillBar key={item.id} name={item.name} level={item.level} />
                      ))}
                    </div>
                  ) : (
                    <div className="font-mono text-xs text-muted-foreground leading-relaxed">{s.items}</div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Contato */}
        <section id="contato" className="relative rounded-[40px] border border-border p-10 md:p-16 text-center bg-card/30 backdrop-blur-sm overflow-hidden">
          <div aria-hidden className="absolute -top-20 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full opacity-20 blur-3xl animate-blob"
            style={{ background: "radial-gradient(circle, var(--primary) 0%, transparent 70%)" }} />
          <div className="relative">
            <Annotation>Contato</Annotation>
            <h2 className="font-mono font-bold tracking-tighter text-4xl md:text-6xl mt-6 mb-4">Vamos conversar?</h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">Estou aberta para oportunidades, parcerias e projetos novos.</p>
            <a href="mailto:gabriela.franca.cavalheiro@gmail.com" aria-label="Enviar email"
              className="group inline-flex items-center justify-center w-12 h-12 rounded-full bg-foreground text-background hover:scale-110 transition-transform animate-bounce">
              <Mail className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            </a>
          </div>
        </section>

      </div>

      <footer className="border-t border-border py-8 relative">
        <div className="max-w-6xl mx-auto px-6 font-mono text-xs text-muted-foreground flex justify-between">
          <span>© 2026 {profile?.name ?? "Gabriela Cavalheiro"}</span>
          <span>{profile?.headline ?? "Front-End + ML"}</span>
        </div>
      </footer>
    </div>
  );
}