CREATE TABLE "public"."order_items" (
  "id"               bigint  GENERATED ALWAYS AS IDENTITY NOT NULL,
  "order_id"         bigint  NOT NULL,
  "variant_id"       bigint,
  "name"             text    NOT NULL,
  "unit_price_cents" integer NOT NULL,
  "quantity"         integer NOT NULL,
  CONSTRAINT "order_items_pkey" PRIMARY KEY (id),
  CONSTRAINT "order_items_quantity_check" CHECK ((quantity > 0)),
  CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE,
  CONSTRAINT "order_items_variant_id_fkey" FOREIGN KEY (variant_id) REFERENCES public.product_variants(id)
);

CREATE INDEX order_items_order_id_idx ON public.order_items USING btree (order_id);

REVOKE ALL ON SEQUENCE "public"."order_items_id_seq" FROM "anon";

GRANT SELECT, UPDATE, USAGE ON SEQUENCE "public"."order_items_id_seq" TO "anon";

REVOKE ALL ON SEQUENCE "public"."order_items_id_seq" FROM "authenticated";

GRANT SELECT, UPDATE, USAGE ON SEQUENCE "public"."order_items_id_seq" TO "authenticated";

REVOKE ALL ON SEQUENCE "public"."order_items_id_seq" FROM "postgres";

GRANT SELECT, UPDATE, USAGE ON SEQUENCE "public"."order_items_id_seq" TO "postgres";

REVOKE ALL ON SEQUENCE "public"."order_items_id_seq" FROM "service_role";

GRANT SELECT, UPDATE, USAGE ON SEQUENCE "public"."order_items_id_seq" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."order_items" TO "anon", "authenticated";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."order_items" TO "service_role";

REVOKE ALL ON TABLE "public"."order_items" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."order_items" TO "postgres";
