CREATE TABLE "public"."cart_items" (
  "cart_id"    uuid    NOT NULL,
  "variant_id" bigint  NOT NULL,
  "quantity"   integer NOT NULL,
  CONSTRAINT "cart_items_pkey" PRIMARY KEY (cart_id, variant_id),
  CONSTRAINT "cart_items_quantity_check" CHECK ((quantity > 0)),
  CONSTRAINT "cart_items_cart_id_fkey" FOREIGN KEY (cart_id) REFERENCES public.carts(id) ON DELETE CASCADE,
  CONSTRAINT "cart_items_variant_id_fkey" FOREIGN KEY (variant_id) REFERENCES public.product_variants(id)
);

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."cart_items" TO "anon", "authenticated";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."cart_items" TO "service_role";

REVOKE ALL ON TABLE "public"."cart_items" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."cart_items" TO "postgres";
