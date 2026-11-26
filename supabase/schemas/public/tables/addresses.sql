CREATE TABLE "public"."addresses" (
  "id"          bigint  GENERATED ALWAYS AS IDENTITY NOT NULL,
  "user_id"     uuid    NOT NULL,
  "recipient"   text    NOT NULL,
  "line1"       text    NOT NULL,
  "line2"       text,
  "suburb"      text,
  "city"        text    NOT NULL,
  "province"    text    NOT NULL,
  "postal_code" text    NOT NULL,
  "is_default"  boolean DEFAULT false,
  CONSTRAINT "addresses_pkey" PRIMARY KEY (id),
  CONSTRAINT "addresses_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

REVOKE ALL ON SEQUENCE "public"."addresses_id_seq" FROM "anon";

GRANT SELECT, UPDATE, USAGE ON SEQUENCE "public"."addresses_id_seq" TO "anon";

REVOKE ALL ON SEQUENCE "public"."addresses_id_seq" FROM "authenticated";

GRANT SELECT, UPDATE, USAGE ON SEQUENCE "public"."addresses_id_seq" TO "authenticated";

REVOKE ALL ON SEQUENCE "public"."addresses_id_seq" FROM "postgres";

GRANT SELECT, UPDATE, USAGE ON SEQUENCE "public"."addresses_id_seq" TO "postgres";

REVOKE ALL ON SEQUENCE "public"."addresses_id_seq" FROM "service_role";

GRANT SELECT, UPDATE, USAGE ON SEQUENCE "public"."addresses_id_seq" TO "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."addresses" TO "anon", "authenticated";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."addresses" TO "service_role";

REVOKE ALL ON TABLE "public"."addresses" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."addresses" TO "postgres";
