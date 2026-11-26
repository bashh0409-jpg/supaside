CREATE TABLE "public"."orders" (
  "id"               bigint                   GENERATED ALWAYS AS IDENTITY NOT NULL,
  "user_id"          uuid                     NOT NULL,
  "status"           text                     NOT NULL DEFAULT 'pending'::text,
  "subtotal_cents"   integer                  NOT NULL,
  "shipping_cents"   integer                  NOT NULL DEFAULT 0,
  "total_cents"      integer                  NOT NULL,
  "shipping_address" jsonb                    NOT NULL,
  "payment_ref"      text,
  "created_at"       timestamp with time zone DEFAULT now(),
  CONSTRAINT "orders_pkey" PRIMARY KEY (id),
  CONSTRAINT "orders_status_check"
    CHECK ((status = ANY (ARRAY['pending'::text, 'paid'::text, 'packed'::text, 'shipped'::text, 'delivered'::text, 'cancelled'::text, 'refunded'::text]))),
  CONSTRAINT "orders_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);

CREATE INDEX orders_user_id_created_at_idx ON public.orders USING btree (user_id, created_at DESC);

REVOKE ALL ON SEQUENCE "public"."orders_id_seq" FROM "anon";

GRANT SELECT, UPDATE, USAGE ON SEQUENCE "public"."orders_id_seq" TO "anon";

REVOKE ALL ON SEQUENCE "public"."orders_id_seq" FROM "authenticated";

GRANT SELECT, UPDATE, USAGE ON SEQUENCE "public"."orders_id_seq" TO "authenticated";

REVOKE ALL ON SEQUENCE "public"."orders_id_seq" FROM "postgres";

GRANT SELECT, UPDATE, USAGE ON SEQUENCE "public"."orders_id_seq" TO "postgres";

REVOKE ALL ON SEQUENCE "public"."orders_id_seq" FROM "service_role";

GRANT SELECT, UPDATE, USAGE ON SEQUENCE "public"."orders_id_seq" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."orders" TO "anon", "authenticated";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."orders" TO "service_role";

REVOKE ALL ON TABLE "public"."orders" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."orders" TO "postgres";
