CREATE TABLE "public"."products" (
  "id"          bigint                   GENERATED ALWAYS AS IDENTITY NOT NULL,
  "category_id" bigint                   NOT NULL,
  "brand_id"    bigint,
  "name"        text                     NOT NULL,
  "slug"        text                     NOT NULL,
  "description" text,
  "attributes"  jsonb                    DEFAULT '{}'::jsonb,
  "is_active"   boolean                  DEFAULT true,
  "created_at"  timestamp with time zone DEFAULT now(),
  CONSTRAINT "products_brand_id_fkey" FOREIGN KEY (brand_id) REFERENCES public.brands(id),
  CONSTRAINT "products_category_id_fkey" FOREIGN KEY (category_id) REFERENCES public.categories(id),
  CONSTRAINT "products_pkey" PRIMARY KEY (id),
  CONSTRAINT "products_slug_key" UNIQUE (slug)
);

CREATE INDEX products_category_id_idx ON public.products USING btree (category_id);

REVOKE ALL ON SEQUENCE "public"."products_id_seq" FROM "anon";

GRANT SELECT, UPDATE, USAGE ON SEQUENCE "public"."products_id_seq" TO "anon";

REVOKE ALL ON SEQUENCE "public"."products_id_seq" FROM "authenticated";

GRANT SELECT, UPDATE, USAGE ON SEQUENCE "public"."products_id_seq" TO "authenticated";

REVOKE ALL ON SEQUENCE "public"."products_id_seq" FROM "postgres";

GRANT SELECT, UPDATE, USAGE ON SEQUENCE "public"."products_id_seq" TO "postgres";

REVOKE ALL ON SEQUENCE "public"."products_id_seq" FROM "service_role";

GRANT SELECT, UPDATE, USAGE ON SEQUENCE "public"."products_id_seq" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."products" TO "anon", "authenticated";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."products" TO "service_role";

REVOKE ALL ON TABLE "public"."products" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."products" TO "postgres";
