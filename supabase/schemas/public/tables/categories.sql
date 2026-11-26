CREATE TABLE "public"."categories" (
  "id"         bigint  GENERATED ALWAYS AS IDENTITY NOT NULL,
  "parent_id"  bigint,
  "name"       text    NOT NULL,
  "slug"       text    NOT NULL,
  "sort_order" integer DEFAULT 0,
  CONSTRAINT "categories_pkey" PRIMARY KEY (id),
  CONSTRAINT "categories_parent_id_fkey" FOREIGN KEY (parent_id) REFERENCES public.categories(id),
  CONSTRAINT "categories_slug_key" UNIQUE (slug)
);

REVOKE ALL ON SEQUENCE "public"."categories_id_seq" FROM "anon";

GRANT SELECT, UPDATE, USAGE ON SEQUENCE "public"."categories_id_seq" TO "anon";

REVOKE ALL ON SEQUENCE "public"."categories_id_seq" FROM "authenticated";

GRANT SELECT, UPDATE, USAGE ON SEQUENCE "public"."categories_id_seq" TO "authenticated";

REVOKE ALL ON SEQUENCE "public"."categories_id_seq" FROM "postgres";

GRANT SELECT, UPDATE, USAGE ON SEQUENCE "public"."categories_id_seq" TO "postgres";

REVOKE ALL ON SEQUENCE "public"."categories_id_seq" FROM "service_role";

GRANT SELECT, UPDATE, USAGE ON SEQUENCE "public"."categories_id_seq" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."categories" TO "anon", "authenticated";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."categories" TO "service_role";

REVOKE ALL ON TABLE "public"."categories" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."categories" TO "postgres";
