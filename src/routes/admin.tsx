import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Trash2, Plus, LogOut, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Portfólio" }] }),
  component: AdminPage,
});

type Project = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  image_url: string | null;
  link_url: string | null;
  sort_order: number;
};
type Skill = { id: string; category: string; items: string; sort_order: number };
type Social = { id: string; label: string; url: string; icon: string; sort_order: number };
type Profile = { id: number; name: string; headline: string; bio: string; email: string; about: string };

function AdminPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [socials, setSocials] = useState<Social[]>([]);

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) navigate({ to: "/login" });
    });
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) {
        navigate({ to: "/login" });
        return;
      }
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.session.user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (!roles) {
        setIsAdmin(false);
        setReady(true);
        return;
      }
      setIsAdmin(true);
      void loadAll();
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  async function loadAll() {
    const [p, pr, sk, so] = await Promise.all([
      supabase.from("profile").select("*").eq("id", 1).single(),
      supabase.from("projects").select("*").order("sort_order"),
      supabase.from("skills").select("*").order("sort_order"),
      supabase.from("social_links").select("*").order("sort_order"),
    ]);
    if (p.data) setProfile(p.data);
    if (pr.data) setProjects(pr.data);
    if (sk.data) setSkills(sk.data);
    if (so.data) setSocials(so.data);
    setReady(true);
  }

  async function logout() {
    await supabase.auth.signOut();
    navigate({ to: "/login" });
  }

  // Profile
  async function saveProfile() {
    if (!profile) return;
    const { error } = await supabase.from("profile").update({
      name: profile.name, headline: profile.headline, bio: profile.bio,
      email: profile.email, about: profile.about,
    }).eq("id", 1);
    if (error) return toast.error(error.message);
    toast.success("Perfil atualizado");
  }

  // Projects
  async function addProject() {
    const { data, error } = await supabase.from("projects").insert({
      title: "Novo projeto", description: "", tags: [], sort_order: projects.length + 1,
    }).select().single();
    if (error) return toast.error(error.message);
    setProjects([...projects, data]);
  }
  async function saveProject(p: Project) {
    const { error } = await supabase.from("projects").update({
      title: p.title, description: p.description, tags: p.tags,
      image_url: p.image_url, link_url: p.link_url, sort_order: p.sort_order,
    }).eq("id", p.id);
    if (error) return toast.error(error.message);
    toast.success("Projeto salvo");
  }
  async function deleteProject(id: string) {
    if (!confirm("Excluir projeto?")) return;
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setProjects(projects.filter((p) => p.id !== id));
  }

  // Skills
  async function addSkill() {
    const { data, error } = await supabase.from("skills").insert({
      category: "Nova categoria", items: "", sort_order: skills.length + 1,
    }).select().single();
    if (error) return toast.error(error.message);
    setSkills([...skills, data]);
  }
  async function saveSkill(s: Skill) {
    const { error } = await supabase.from("skills").update({
      category: s.category, items: s.items, sort_order: s.sort_order,
    }).eq("id", s.id);
    if (error) return toast.error(error.message);
    toast.success("Skill salva");
  }
  async function deleteSkill(id: string) {
    if (!confirm("Excluir?")) return;
    await supabase.from("skills").delete().eq("id", id);
    setSkills(skills.filter((s) => s.id !== id));
  }

  // Socials
  async function addSocial() {
    const { data, error } = await supabase.from("social_links").insert({
      label: "Novo", url: "https://", icon: "Github", sort_order: socials.length + 1,
    }).select().single();
    if (error) return toast.error(error.message);
    setSocials([...socials, data]);
  }
  async function saveSocial(s: Social) {
    const { error } = await supabase.from("social_links").update({
      label: s.label, url: s.url, icon: s.icon, sort_order: s.sort_order,
    }).eq("id", s.id);
    if (error) return toast.error(error.message);
    toast.success("Link salvo");
  }
  async function deleteSocial(id: string) {
    if (!confirm("Excluir?")) return;
    await supabase.from("social_links").delete().eq("id", id);
    setSocials(socials.filter((s) => s.id !== id));
  }

  if (!ready) return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">Carregando...</div>;
  if (!isAdmin) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="font-mono text-2xl font-bold">Sem permissão</h1>
      <p className="text-sm text-muted-foreground max-w-md">Sua conta não tem papel de admin. Peça para um administrador adicionar seu usuário à tabela <code>user_roles</code> com o papel <code>admin</code>.</p>
      <Button variant="outline" onClick={logout}>Sair</Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-muted-foreground hover:text-foreground"><ArrowLeft className="w-4 h-4" /></Link>
            <h1 className="font-mono font-bold">Admin</h1>
          </div>
          <Button variant="ghost" size="sm" onClick={logout}><LogOut className="w-4 h-4 mr-2" />Sair</Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <Tabs defaultValue="profile">
          <TabsList className="mb-6">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="projects">Projetos</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="social">Sociais</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            {profile && (
              <div className="space-y-4 rounded-2xl border border-border p-6 bg-card/30">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Nome</Label><Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} /></div>
                  <div className="space-y-2"><Label>Título</Label><Input value={profile.headline} onChange={(e) => setProfile({ ...profile, headline: e.target.value })} /></div>
                </div>
                <div className="space-y-2"><Label>Bio (hero)</Label><Textarea rows={3} value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} /></div>
                <div className="space-y-2"><Label>Sobre mim</Label><Textarea rows={5} value={profile.about} onChange={(e) => setProfile({ ...profile, about: e.target.value })} /></div>
                <div className="space-y-2"><Label>Email de contato</Label><Input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} /></div>
                <Button onClick={saveProfile}>Salvar perfil</Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="projects" className="space-y-4">
            <Button onClick={addProject}><Plus className="w-4 h-4 mr-2" />Novo projeto</Button>
            {projects.map((p, i) => (
              <div key={p.id} className="rounded-2xl border border-border p-6 bg-card/30 space-y-3">
                <div className="grid md:grid-cols-[1fr_120px] gap-3">
                  <div className="space-y-2"><Label>Título</Label><Input value={p.title} onChange={(e) => { const c = [...projects]; c[i].title = e.target.value; setProjects(c); }} /></div>
                  <div className="space-y-2"><Label>Ordem</Label><Input type="number" value={p.sort_order} onChange={(e) => { const c = [...projects]; c[i].sort_order = +e.target.value; setProjects(c); }} /></div>
                </div>
                <div className="space-y-2"><Label>Descrição</Label><Textarea rows={3} value={p.description} onChange={(e) => { const c = [...projects]; c[i].description = e.target.value; setProjects(c); }} /></div>
                <div className="space-y-2"><Label>Tags (separadas por vírgula)</Label><Input value={p.tags.join(", ")} onChange={(e) => { const c = [...projects]; c[i].tags = e.target.value.split(",").map((t) => t.trim()).filter(Boolean); setProjects(c); }} /></div>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="space-y-2"><Label>URL da imagem</Label><Input value={p.image_url ?? ""} onChange={(e) => { const c = [...projects]; c[i].image_url = e.target.value || null; setProjects(c); }} /></div>
                  <div className="space-y-2"><Label>Link do projeto</Label><Input value={p.link_url ?? ""} onChange={(e) => { const c = [...projects]; c[i].link_url = e.target.value || null; setProjects(c); }} /></div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => saveProject(p)}>Salvar</Button>
                  <Button size="sm" variant="destructive" onClick={() => deleteProject(p.id)}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="skills" className="space-y-4">
            <Button onClick={addSkill}><Plus className="w-4 h-4 mr-2" />Nova skill</Button>
            {skills.map((s, i) => (
              <div key={s.id} className="rounded-2xl border border-border p-6 bg-card/30 space-y-3">
                <div className="grid md:grid-cols-[1fr_120px] gap-3">
                  <div className="space-y-2"><Label>Categoria</Label><Input value={s.category} onChange={(e) => { const c = [...skills]; c[i].category = e.target.value; setSkills(c); }} /></div>
                  <div className="space-y-2"><Label>Ordem</Label><Input type="number" value={s.sort_order} onChange={(e) => { const c = [...skills]; c[i].sort_order = +e.target.value; setSkills(c); }} /></div>
                </div>
                <div className="space-y-2"><Label>Itens (texto livre)</Label><Input value={s.items} onChange={(e) => { const c = [...skills]; c[i].items = e.target.value; setSkills(c); }} /></div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => saveSkill(s)}>Salvar</Button>
                  <Button size="sm" variant="destructive" onClick={() => deleteSkill(s.id)}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="social" className="space-y-4">
            <Button onClick={addSocial}><Plus className="w-4 h-4 mr-2" />Novo link</Button>
            <p className="text-xs text-muted-foreground">Ícones disponíveis: Github, Linkedin, Mail, Instagram</p>
            {socials.map((s, i) => (
              <div key={s.id} className="rounded-2xl border border-border p-6 bg-card/30 space-y-3">
                <div className="grid md:grid-cols-3 gap-3">
                  <div className="space-y-2"><Label>Label</Label><Input value={s.label} onChange={(e) => { const c = [...socials]; c[i].label = e.target.value; setSocials(c); }} /></div>
                  <div className="space-y-2"><Label>Ícone</Label><Input value={s.icon} onChange={(e) => { const c = [...socials]; c[i].icon = e.target.value; setSocials(c); }} /></div>
                  <div className="space-y-2"><Label>Ordem</Label><Input type="number" value={s.sort_order} onChange={(e) => { const c = [...socials]; c[i].sort_order = +e.target.value; setSocials(c); }} /></div>
                </div>
                <div className="space-y-2"><Label>URL</Label><Input value={s.url} onChange={(e) => { const c = [...socials]; c[i].url = e.target.value; setSocials(c); }} /></div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => saveSocial(s)}>Salvar</Button>
                  <Button size="sm" variant="destructive" onClick={() => deleteSocial(s.id)}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
