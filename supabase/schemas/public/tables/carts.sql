CREATE TABLE "public"."carts" (
  "id"         uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "user_id"    uuid,
  "updated_at" timestamp with time zone DEFAULT now(),
  CONSTRAINT "carts_pkey" PRIMARY KEY (id),
  CONSTRAINT "carts_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."carts" TO "anon", "authenticated";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."carts" TO "service_role";

REVOKE ALL ON TABLE "public"."carts" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."carts" TO "postgres";
