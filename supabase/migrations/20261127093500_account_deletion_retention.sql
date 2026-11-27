ALTER TABLE public.carts
  DROP CONSTRAINT IF EXISTS carts_user_id_fkey;
ALTER TABLE public.carts
  ADD CONSTRAINT carts_user_id_fkey
  FOREIGN KEY (user_id)
  REFERENCES public.profiles(id)
  ON DELETE CASCADE;

ALTER TABLE public.reviews
  ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE public.reviews
  DROP CONSTRAINT IF EXISTS reviews_user_id_fkey;
ALTER TABLE public.reviews
  ADD CONSTRAINT reviews_user_id_fkey
  FOREIGN KEY (user_id)
  REFERENCES public.profiles(id)
  ON DELETE SET NULL;

ALTER TABLE public.orders
  ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE public.orders
  DROP CONSTRAINT IF EXISTS orders_user_id_fkey;
ALTER TABLE public.orders
  ADD CONSTRAINT orders_user_id_fkey
  FOREIGN KEY (user_id)
  REFERENCES public.profiles(id)
  ON DELETE SET NULL;
