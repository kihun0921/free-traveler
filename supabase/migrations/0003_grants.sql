-- Table-level privileges (GRANT) for anon/authenticated roles.
-- RLS policies (0002_rls.sql) control row visibility, but Postgres still
-- requires a base table-level GRANT before any role may run SELECT/INSERT/
-- UPDATE/DELETE at all. Without these grants, every query fails with
-- "permission denied for table ..." (42501) even when RLS would allow it.

-- mate_post: publicly browsable (anon needs read access for the homepage
-- and mate list), authenticated users can additionally write their own.
GRANT SELECT ON public.mate_post TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.mate_post TO authenticated;

-- user_profile: only signed-in users interact with profiles.
GRANT SELECT, UPDATE ON public.user_profile TO authenticated;

-- mate_application: only signed-in users create/view applications.
GRANT SELECT, INSERT, UPDATE ON public.mate_application TO authenticated;

-- user_block: only signed-in users manage their own block list.
GRANT SELECT, INSERT, DELETE ON public.user_block TO authenticated;

-- report: only signed-in users file/view their own reports.
GRANT SELECT, INSERT ON public.report TO authenticated;

-- app_setting: read-only reference config, only for authenticated (admin) use.
GRANT SELECT ON public.app_setting TO authenticated;
