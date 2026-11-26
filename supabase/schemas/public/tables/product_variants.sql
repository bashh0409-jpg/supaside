CREATE TABLE "public"."product_variants" (
  "id"               bigint  GENERATED ALWAYS AS IDENTITY NOT NULL,
  "product_id"       bigint  NOT NULL,
  "sku"              text    NOT NULL,
  "size"             text,
  "color"            text,
  "price_cents"      integer NOT NULL,
  "compare_at_cents" integer,
  "is_active"        boolean DEFAULT true,
  CONSTRAINT "product_variants_pkey" PRIMARY KEY (id),
  CONSTRAINT "product_variants_price_cents_check" CHECK ((price_cents >= 0)),
  CONSTRAINT "product_variants_sku_key" UNIQUE (sku),
  CONSTRAINT "product_variants_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE
);

CREATE INDEX product_variants_product_id_idx ON public.product_variants USING btree (product_id);

REVOKE ALL ON SEQUENCE "public"."product_variants_id_seq" FROM "anon";

GRANT SELECT, UPDATE, USAGE ON SEQUENCE "public"."product_variants_id_seq" TO "anon";

REVOKE ALL ON SEQUENCE "public"."product_variants_id_seq" FROM "authenticated";

GRANT SELECT, UPDATE, USAGE ON SEQUENCE "public"."product_variants_id_seq" TO "authenticated";

REVOKE ALL ON SEQUENCE "public"."product_variants_id_seq" FROM "postgres";

GRANT SELECT, UPDATE, USAGE ON SEQUENCE "public"."product_variants_id_seq" TO "postgres";

REVOKE ALL ON SEQUENCE "public"."product_variants_id_seq" FROM "service_role";

GRANT SELECT, UPDATE, USAGE ON SEQUENCE "public"."product_variants_id_seq" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."product_variants" TO "anon", "authenticated";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."product_variants" TO "service_role";

REVOKE ALL ON TABLE "public"."product_variants" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."product_variants" TO "postgres";
