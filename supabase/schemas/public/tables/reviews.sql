CREATE TABLE "public"."reviews" (
  "id"         bigint                   GENERATED ALWAYS AS IDENTITY NOT NULL,
  "product_id" bigint                   NOT NULL,
  "user_id"    uuid                     NOT NULL,
  "rating"     integer                  NOT NULL,
  "body"       text,
  "created_at" timestamp with time zone DEFAULT now(),
  CONSTRAINT "reviews_pkey" PRIMARY KEY (id),
  CONSTRAINT "reviews_product_id_fkey" FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE,
  CONSTRAINT "reviews_product_id_user_id_key" UNIQUE (product_id, user_id),
  CONSTRAINT "reviews_rating_check" CHECK (((rating >= 1) AND (rating <= 5))),
  CONSTRAINT "reviews_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);

REVOKE ALL ON SEQUENCE "public"."reviews_id_seq" FROM "anon";

GRANT SELECT, UPDATE, USAGE ON SEQUENCE "public"."reviews_id_seq" TO "anon";

REVOKE ALL ON SEQUENCE "public"."reviews_id_seq" FROM "authenticated";

GRANT SELECT, UPDATE, USAGE ON SEQUENCE "public"."reviews_id_seq" TO "authenticated";

REVOKE ALL ON SEQUENCE "public"."reviews_id_seq" FROM "postgres";

GRANT SELECT, UPDATE, USAGE ON SEQUENCE "public"."reviews_id_seq" TO "postgres";

REVOKE ALL ON SEQUENCE "public"."reviews_id_seq" FROM "service_role";

GRANT SELECT, UPDATE, USAGE ON SEQUENCE "public"."reviews_id_seq" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."reviews" TO "anon", "authenticated";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."reviews" TO "service_role";

REVOKE ALL ON TABLE "public"."reviews" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."reviews" TO "postgres";
