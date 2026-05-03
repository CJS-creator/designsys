
-- 1. Fix privilege escalation: only allow owner self-insert if no owner exists yet AND user created the design system
DROP POLICY IF EXISTS "Users can insert own owner role" ON public.user_roles;

CREATE POLICY "Users can insert own owner role"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND role = 'owner'::app_role
  AND EXISTS (
    SELECT 1 FROM public.design_systems ds
    WHERE ds.id = user_roles.design_system_id
      AND ds.user_id = auth.uid()
  )
  AND NOT EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.design_system_id = user_roles.design_system_id
      AND ur.role = 'owner'::app_role
  )
);

-- 2. Restrict audit log inserts to members of the referenced design system
DROP POLICY IF EXISTS "Authenticated can insert audit logs" ON public.audit_logs;

CREATE POLICY "Members can insert audit logs"
ON public.audit_logs
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND (
    design_system_id IS NULL
    OR public.is_member(auth.uid(), design_system_id)
  )
);

-- 3. Realtime authorization: restrict subscriptions to design system members
ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Members can receive design token broadcasts" ON realtime.messages;

CREATE POLICY "Members can receive design token broadcasts"
ON realtime.messages
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
      AND ur.design_system_id::text = (string_to_array(realtime.topic(), ':'))[2]
  )
  OR (string_to_array(realtime.topic(), ':'))[1] NOT IN ('design_system', 'design_tokens')
);
