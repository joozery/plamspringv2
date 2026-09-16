// Binds origin/clientKey once instead of every page repeating them.
import AnsioSchema, { type AnsioSchemaProps } from "@ansio/next-schema";
import { SITE_URL } from "@/lib/site";

type PageSchemaProps = Omit<AnsioSchemaProps, "origin" | "clientKey">;

export function PageSchema(props: PageSchemaProps) {
  return (
    <AnsioSchema
      origin={SITE_URL}
      clientKey={process.env.NEXT_PUBLIC_AEO_GEO_KEY ?? ""}
      {...props}
    />
  );
}
