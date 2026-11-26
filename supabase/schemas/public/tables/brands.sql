CREATE TABLE "public"."brands" (
  "id"   bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  "name" text   NOT NULL,
  "slug" text   NOT NULL,
  CONSTRAINT "brands_name_key" UNIQUE (name),
  CONSTRAINT "brands_pkey" PRIMARY KEY (id),
  CONSTRAINT "brands_slug_key" UNIQUE (slug)
);

REVOKE ALL ON SEQUENCE "public"."brands_id_seq" FROM "anon";

GRANT SELECT, UPDATE, USAGE ON SEQUENCE "public"."brands_id_seq" TO "anon";

REVOKE ALL ON SEQUENCE "public"."brands_id_seq" FROM "authenticated";

GRANT SELECT, UPDATE, USAGE ON SEQUENCE "public"."brands_id_seq" TO "authenticated";

REVOKE ALL ON SEQUENCE "public"."brands_id_seq" FROM "postgres";

GRANT SELECT, UPDATE, USAGE ON SEQUENCE "public"."brands_id_seq" TO "postgres";

REVOKE ALL ON SEQUENCE "public"."brands_id_seq" FROM "service_role";

GRANT SELECT, UPDATE, USAGE ON SEQUENCE "public"."brands_id_seq" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."brands" TO "anon", "authenticated";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."brands" TO "service_role";

REVOKE ALL ON TABLE "public"."brands" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."brands" TO "postgres";
