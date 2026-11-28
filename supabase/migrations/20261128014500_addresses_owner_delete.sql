GRANT DELETE ON TABLE public.addresses TO authenticated;

DROP POLICY IF EXISTS addresses_delete_own ON public.addresses;
CREATE POLICY addresses_delete_own
  ON public.addresses
  FOR DELETE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);
