ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.addresses FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public.addresses TO authenticated;
GRANT ALL ON TABLE public.addresses TO service_role;
REVOKE ALL ON SEQUENCE public.addresses_id_seq FROM anon;
GRANT USAGE, SELECT ON SEQUENCE public.addresses_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.addresses_id_seq TO service_role;

DROP POLICY IF EXISTS addresses_select_own ON public.addresses;
CREATE POLICY addresses_select_own
  ON public.addresses
  FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS addresses_insert_own ON public.addresses;
CREATE POLICY addresses_insert_own
  ON public.addresses
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS addresses_update_own ON public.addresses;
CREATE POLICY addresses_update_own
  ON public.addresses
  FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);
