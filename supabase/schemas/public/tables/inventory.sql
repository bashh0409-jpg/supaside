CREATE TABLE "public"."inventory" (
  "variant_id" bigint  NOT NULL,
  "quantity"   integer NOT NULL DEFAULT 0,
  CONSTRAINT "inventory_pkey" PRIMARY KEY (variant_id),
  CONSTRAINT "inventory_quantity_check" CHECK ((quantity >= 0)),
  CONSTRAINT "inventory_variant_id_fkey" FOREIGN KEY (variant_id) REFERENCES public.product_variants(id) ON DELETE CASCADE
);

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."inventory" TO "anon", "authenticated";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."inventory" TO "service_role";

REVOKE ALL ON TABLE "public"."inventory" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."inventory" TO "postgres";
