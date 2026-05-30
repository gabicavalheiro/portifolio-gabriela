
-- Generic updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- profile (singleton)
CREATE TABLE public.profile (
  id INT PRIMARY KEY DEFAULT 1,
  name TEXT NOT NULL DEFAULT 'Gabriela Cavalheiro',
  headline TEXT NOT NULL DEFAULT 'Front-End + ML',
  bio TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT 'hello@gabriela.dev',
  about TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT profile_singleton CHECK (id = 1)
);

INSERT INTO public.profile (id) VALUES (1);

CREATE TRIGGER profile_set_updated_at
BEFORE UPDATE ON public.profile
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profile public read" ON public.profile FOR SELECT USING (true);
CREATE POLICY "profile auth update" ON public.profile FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "profile auth insert" ON public.profile FOR INSERT TO authenticated WITH CHECK (true);

-- projects
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  tags TEXT[] NOT NULL DEFAULT '{}',
  image_url TEXT,
  link_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TRIGGER projects_set_updated_at BEFORE UPDATE ON public.projects
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "projects public read" ON public.projects FOR SELECT USING (true);
CREATE POLICY "projects auth all" ON public.projects FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- skills
CREATE TABLE public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  items TEXT NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TRIGGER skills_set_updated_at BEFORE UPDATE ON public.skills
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "skills public read" ON public.skills FOR SELECT USING (true);
CREATE POLICY "skills auth all" ON public.skills FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- social_links
CREATE TABLE public.social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'Github',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TRIGGER social_links_set_updated_at BEFORE UPDATE ON public.social_links
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "social public read" ON public.social_links FOR SELECT USING (true);
CREATE POLICY "social auth all" ON public.social_links FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Seed initial data
INSERT INTO public.projects (title, description, tags, sort_order) VALUES
('Dash Store', 'Dashboard de e-commerce em React com integração ao Sanity CMS, design responsivo e métricas em tempo real.', ARRAY['React','Sanity','CSS','Figma'], 1),
('Latent Space Explorer', 'Estudo pessoal de visualização de embeddings vetoriais com React + Python, explorando ML aplicado.', ARRAY['React','Python','ML'], 2),
('Portfolio Engine', 'Site portfólio construído com Next.js, Tailwind e animações suaves — foco em performance e SEO.', ARRAY['Next.js','Tailwind','TypeScript'], 3);

INSERT INTO public.skills (category, items, sort_order) VALUES
('Front-end', 'HTML5 / CSS3 / JavaScript / TypeScript / React / Next.js / Axios', 1),
('Styles & Design', 'Tailwind CSS / Bootstrap / Figma / shadcn', 2),
('Back-end & ML', 'Node.js / Express / Python / Pandas / Scikit-Learn', 3),
('Data & Tools', 'MySQL / SQLite / DBeaver / Git / GitHub / GitLab', 4);

INSERT INTO public.social_links (label, url, icon, sort_order) VALUES
('Github', 'https://github.com', 'Github', 1),
('LinkedIn', 'https://linkedin.com', 'Linkedin', 2),
('Email', 'mailto:hello@gabriela.dev', 'Mail', 3),
('Instagram', 'https://instagram.com', 'Instagram', 4);

UPDATE public.profile SET
  bio = 'Graduanda em Análise e Desenvolvimento de Sistemas no uniSenac Pelotas, apaixonada por construir interfaces que pensam com IA aplicada.',
  about = 'Olá! Eu sou Gabriela Cavalheiro, graduanda em Análise e Desenvolvimento de Sistemas no uniSenac Pelotas, estudante de desenvolvimento Front-End e Machine Learning, apaixonada por tecnologia.'
WHERE id = 1;
