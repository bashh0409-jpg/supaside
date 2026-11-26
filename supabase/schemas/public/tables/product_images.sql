CREATE TABLE "public"."product_images" (
  "id"         bigint  GENERATED ALWAYS AS IDENTITY NOT NULL,
  "product_id" bigint  NOT NULL,
  "variant_id" bigint,
  "url"        text    NOT NULL,
  "sort_order" integer DEFAULT 0,
  CONSTRAINT "product_images_pkey" PRIMARY KEY (id),
  CONSTRAINT "product_images_variant_id_fkey" FOREIGN KEY (variant_id) REFERENCES public.product_variants(id),
  CONSTRAINT "product_images_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE
);

REVOKE ALL ON SEQUENCE "public"."product_images_id_seq" FROM "anon";

GRANT SELECT, UPDATE, USAGE ON SEQUENCE "public"."product_images_id_seq" TO "anon";

REVOKE ALL ON SEQUENCE "public"."product_images_id_seq" FROM "authenticated";

GRANT SELECT, UPDATE, USAGE ON SEQUENCE "public"."product_images_id_seq" TO "authenticated";

REVOKE ALL ON SEQUENCE "public"."product_images_id_seq" FROM "postgres";

GRANT SELECT, UPDATE, USAGE ON SEQUENCE "public"."product_images_id_seq" TO "postgres";

REVOKE ALL ON SEQUENCE "public"."product_images_id_seq" FROM "service_role";

GRANT SELECT, UPDATE, USAGE ON SEQUENCE "public"."product_images_id_seq" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."product_images" TO "anon", "authenticated";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."product_images" TO "service_role";

REVOKE ALL ON TABLE "public"."product_images" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."product_images" TO "postgres";
