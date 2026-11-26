CREATE TABLE "public"."wishlist_items" (
  "user_id"    uuid   NOT NULL,
  "product_id" bigint NOT NULL,
  CONSTRAINT "wishlist_items_pkey" PRIMARY KEY (user_id, product_id),
  CONSTRAINT "wishlist_items_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE,
  CONSTRAINT "wishlist_items_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."wishlist_items" TO "anon", "authenticated";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."wishlist_items" TO "service_role";

REVOKE ALL ON TABLE "public"."wishlist_items" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."wishlist_items" TO "postgres";
