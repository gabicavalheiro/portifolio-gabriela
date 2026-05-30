import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Github, Linkedin, Mail, Instagram, Sparkles, Lock } from "lucide-react";
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
  Github, Linkedin, Mail, Instagram,
};

const marqueeWords = [
  "React", "TypeScript", "Next.js", "Tailwind", "Python", "Pandas",
  "Scikit-Learn", "Figma", "Node.js", "MySQL", "Machine Learning", "Front-End",
];

type Profile = { name: string; headline: string; bio: string; email: string; about: string };
type Project = { id: string; title: string; description: string; tags: string[]; image_url: string | null; link_url: string | null };
type Skill = { id: string; category: string; items: string };
type Social = { id: string; label: string; url: string; icon: string };

function Annotation({ children }: { children: React.ReactNode }) {
  return <div className="font-mono text-xs text-muted-foreground tracking-wide">... /{children} ...</div>;
}

function Index() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [socials, setSocials] = useState<Social[]>([]);

  useEffect(() => {
    void (async () => {
      const [p, pr, sk, so] = await Promise.all([
        supabase.from("profile").select("name,headline,bio,email,about").eq("id", 1).single(),
        supabase.from("projects").select("*").order("sort_order"),
        supabase.from("skills").select("*").order("sort_order"),
        supabase.from("social_links").select("*").order("sort_order"),
      ]);
      if (p.data) setProfile(p.data);
      if (pr.data) setProjects(pr.data);
      if (sk.data) setSkills(sk.data);
      if (so.data) setSocials(so.data);
    })();
  }, []);

  const firstName = profile?.name?.split(" ")[0]?.toUpperCase() ?? "GABRIELA";

  return (
    <div className="min-h-screen bg-background text-foreground font-sans relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-30 blur-3xl animate-blob"
        style={{ background: "radial-gradient(circle, var(--primary) 0%, transparent 70%)" }} />
      <div aria-hidden className="pointer-events-none absolute top-[600px] -right-40 w-[500px] h-[500px] rounded-full opacity-20 blur-3xl animate-blob"
        style={{ background: "radial-gradient(circle, var(--primary-glow) 0%, transparent 70%)", animationDelay: "-5s" }} />
      <div aria-hidden className="pointer-events-none absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full border border-border opacity-40 animate-spin-slow" />

      <main className="max-w-6xl mx-auto px-6 pt-20 pb-32 relative">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24 animate-rise">
          <Annotation>About project</Annotation>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-md">
            Este é meu portfólio como{" "}
            <em className="text-foreground not-italic font-medium">desenvolvedora Front-End</em> e estudante de{" "}
            <em className="text-foreground not-italic font-medium">Machine Learning</em>. Aqui compartilho minha jornada, projetos e contato.
          </p>
        </section>

        <section className="relative rounded-[40px] border border-border bg-card/40 backdrop-blur-sm p-8 md:p-12 mb-32 overflow-hidden animate-rise" style={{ animationDelay: "0.1s" }}>
          <div aria-hidden className="absolute inset-x-0 top-0 h-px overflow-hidden">
            <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-foreground/60 to-transparent animate-shimmer" />
          </div>

          <div className="flex items-start justify-between mb-12">
            <img src={logo} alt={profile?.name ?? "gabriela/dev"} className="h-8 md:h-10 w-auto" />

            <nav className="hidden md:flex gap-8 text-sm text-muted-foreground">
              <a href="#sobre" className="hover:text-foreground transition-colors story-link">Sobre</a>
              <a href="#projetos" className="hover:text-foreground transition-colors story-link">Projetos</a>
              <a href="#stack" className="hover:text-foreground transition-colors story-link">Stack</a>
              <a href="#contato" className="hover:text-foreground transition-colors story-link">Contato</a>
            </nav>
            <Link to="/admin" className="font-mono text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
              <Lock className="w-3 h-3" /> admin
            </Link>
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

          <div className="flex flex-wrap gap-3 mb-12">
            {socials.map((s) => {
              const Icon = iconMap[s.icon] ?? Github;
              return (
                <a key={s.id} href={s.url} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border text-sm hover:border-foreground hover:-translate-y-0.5 transition">
                  <Icon className="w-4 h-4" />
                  {s.label}
                </a>
              );
            })}
          </div>

          <div id="projetos" className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {projects.map((p, i) => (
              <article key={p.id}
                className={`group relative rounded-2xl border border-border overflow-hidden bg-background/60 transition-all duration-500 hover:opacity-100 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 ${i !== 0 ? "md:opacity-60 hover:opacity-100" : ""}`}>
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={p.image_url || projectNeural} alt={p.title} loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-base mb-2 leading-tight">{p.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4">{p.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {p.tags.map((t) => (
                      <span key={t} className="px-2 py-0.5 text-[10px] font-mono border border-border rounded-full text-muted-foreground">{t}</span>
                    ))}
                  </div>
                  {p.link_url && (
                    <a href={p.link_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-foreground text-background text-xs font-medium group-hover:gap-3 transition-all">
                      Ver mais <ArrowRight className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section aria-hidden className="mb-32 -mx-6 overflow-hidden border-y border-border py-6 bg-card/20">
          <div className="flex gap-12 animate-marquee whitespace-nowrap font-mono text-2xl md:text-4xl text-muted-foreground">
            {[...marqueeWords, ...marqueeWords].map((w, i) => (
              <span key={i} className="flex items-center gap-12">{w}<Sparkles className="w-5 h-5 text-primary" /></span>
            ))}
          </div>
        </section>

        <section id="sobre" className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <Annotation>Sobre mim</Annotation>
          <p className="text-base md:text-lg leading-relaxed whitespace-pre-line">
            {profile?.about ?? ""}
          </p>
        </section>

        <section id="stack" className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-12 mb-32 items-start">
          <div className="space-y-4">
            {skills.map((s, i) => (
              <div key={s.id} className="group rounded-2xl border border-border px-6 py-5 bg-card/30 backdrop-blur-sm transition-all duration-500 hover:border-foreground/40 hover:-translate-y-1 hover:bg-card/60"
                style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="font-medium text-sm mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />{s.category}
                </div>
                <div className="font-mono text-xs text-muted-foreground leading-relaxed">{s.items}</div>
              </div>
            ))}
          </div>

          <div className="relative">
            <div className="rounded-3xl border border-border overflow-hidden bg-gradient-to-br from-card/60 to-background aspect-[3/4] relative flex items-center justify-center">
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

        <section id="contato" className="relative rounded-[40px] border border-border p-10 md:p-16 text-center bg-card/30 backdrop-blur-sm overflow-hidden">
          <div aria-hidden className="absolute -top-20 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full opacity-20 blur-3xl animate-blob"
            style={{ background: "radial-gradient(circle, var(--primary) 0%, transparent 70%)" }} />
          <div className="relative">
            <Annotation>Contato</Annotation>
            <h2 className="font-mono font-bold tracking-tighter text-4xl md:text-6xl mt-6 mb-4">Vamos conversar?</h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">Estou aberta para oportunidades, parcerias e projetos novos.</p>
            <a href={`mailto:${profile?.email ?? "hello@gabriela.dev"}`}
              className="group inline-flex items-center gap-3 px-6 py-3 rounded-full bg-foreground text-background font-medium hover:scale-105 transition-transform">
              <Mail className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              {profile?.email ?? "hello@gabriela.dev"}
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8 relative">
        <div className="max-w-6xl mx-auto px-6 font-mono text-xs text-muted-foreground flex justify-between">
          <span>© 2026 {profile?.name ?? "Gabriela Cavalheiro"}</span>
          <span>{profile?.headline ?? "Front-End + ML"}</span>
        </div>
      </footer>
    </div>
  );
}
