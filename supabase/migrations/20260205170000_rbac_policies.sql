-- Update Design Systems Policies
DROP POLICY IF EXISTS "Users can view own design systems" ON public.design_systems;
CREATE POLICY "Users can view design systems"
ON public.design_systems FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.design_system_id = design_systems.id
    AND user_roles.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Users can update own design systems" ON public.design_systems;
CREATE POLICY "Users can update design systems"
ON public.design_systems FOR UPDATE
USING (
   public.has_role(auth.uid(), id, 'editor') 
   OR 
   public.has_role(auth.uid(), id, 'owner')
);

DROP POLICY IF EXISTS "Users can delete own design systems" ON public.design_systems;
CREATE POLICY "Users can delete design systems"
ON public.design_systems FOR DELETE
USING (
   public.has_role(auth.uid(), id, 'owner')
);

-- Update Design Tokens Policies
DROP POLICY IF EXISTS "Users can view own design tokens" ON public.design_tokens;
CREATE POLICY "Users can view tokens"
ON public.design_tokens FOR SELECT
USING (
  public.has_role(auth.uid(), design_system_id, 'viewer')
  OR public.has_role(auth.uid(), design_system_id, 'editor')
  OR public.has_role(auth.uid(), design_system_id, 'owner')
);

DROP POLICY IF EXISTS "Users can manage own design tokens" ON public.design_tokens;
CREATE POLICY "Users can manage tokens"
ON public.design_tokens FOR ALL
USING (
  public.has_role(auth.uid(), design_system_id, 'editor')
  OR public.has_role(auth.uid(), design_system_id, 'owner')
);

-- Update Token Groups Policies
DROP POLICY IF EXISTS "Users can view own token groups" ON public.token_groups;
CREATE POLICY "Users can view token groups"
ON public.token_groups FOR SELECT
USING (
  public.has_role(auth.uid(), design_system_id, 'viewer')
  OR public.has_role(auth.uid(), design_system_id, 'editor')
  OR public.has_role(auth.uid(), design_system_id, 'owner')
);

DROP POLICY IF EXISTS "Users can manage own token groups" ON public.token_groups;
CREATE POLICY "Users can manage token groups"
ON public.token_groups FOR ALL
USING (
  public.has_role(auth.uid(), design_system_id, 'editor')
  OR public.has_role(auth.uid(), design_system_id, 'owner')
);

-- Update Brand Themes Policies
DROP POLICY IF EXISTS "Users can view own brand themes" ON public.brand_themes;
CREATE POLICY "Users can view brand themes"
ON public.brand_themes FOR SELECT
USING (
  public.has_role(auth.uid(), design_system_id, 'viewer')
  OR public.has_role(auth.uid(), design_system_id, 'editor')
  OR public.has_role(auth.uid(), design_system_id, 'owner')
);

DROP POLICY IF EXISTS "Users can manage own brand themes" ON public.brand_themes;
CREATE POLICY "Users can manage brand themes"
ON public.brand_themes FOR ALL
USING (
  public.has_role(auth.uid(), design_system_id, 'editor')
  OR public.has_role(auth.uid(), design_system_id, 'owner')
);

-- Update API Keys Policies (Owner only for management?)
DROP POLICY IF EXISTS "Users can manage their own api keys" ON public.api_keys;
CREATE POLICY "Users can view api keys"
ON public.api_keys FOR SELECT
USING (
  public.has_role(auth.uid(), design_system_id, 'owner')
);

CREATE POLICY "Users can manage api keys"
ON public.api_keys FOR ALL
USING (
  public.has_role(auth.uid(), design_system_id, 'owner')
);
