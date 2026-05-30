
-- Roles enum + table
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users read own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Security definer role check
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Replace permissive policies on content tables with admin-only writes

-- profile
DROP POLICY IF EXISTS "profile auth insert" ON public.profile;
DROP POLICY IF EXISTS "profile auth update" ON public.profile;

CREATE POLICY "profile admin insert" ON public.profile
FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "profile admin update" ON public.profile
FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "profile admin delete" ON public.profile
FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- projects
DROP POLICY IF EXISTS "projects auth all" ON public.projects;

CREATE POLICY "projects admin insert" ON public.projects
FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "projects admin update" ON public.projects
FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "projects admin delete" ON public.projects
FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- skills
DROP POLICY IF EXISTS "skills auth all" ON public.skills;

CREATE POLICY "skills admin insert" ON public.skills
FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "skills admin update" ON public.skills
FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "skills admin delete" ON public.skills
FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- social_links
DROP POLICY IF EXISTS "social auth all" ON public.social_links;

CREATE POLICY "social admin insert" ON public.social_links
FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "social admin update" ON public.social_links
FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "social admin delete" ON public.social_links
FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
