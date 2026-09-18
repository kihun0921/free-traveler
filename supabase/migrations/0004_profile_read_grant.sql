-- The mate list (SCR-004) shows each post's author nickname/age_group/
-- gender/travel_style even to guests browsing without logging in
-- (src/app/mates/page.tsx calls POST /api/profiles unconditionally).
-- 0002_rls.sql already allows this via the permissive
-- "Admins can read all profiles" policy (USING (TRUE)), but 0003_grants.sql
-- only granted SELECT on user_profile to `authenticated`, so anon requests
-- still failed with 42501 permission denied. Add the missing anon grant.
GRANT SELECT ON public.user_profile TO anon;

-- Admin report moderation (PATCH /api/admin/reports) updates report.status,
-- but 0003_grants.sql only granted SELECT/INSERT on report to authenticated.
GRANT UPDATE ON public.report TO authenticated;

-- Admin outbound URL settings (POST /api/admin/settings/outbound) upserts
-- into app_setting, but 0003_grants.sql only granted SELECT.
GRANT INSERT, UPDATE ON public.app_setting TO authenticated;
