// Binds origin/clientKey once instead of every page repeating them.
import AnsioSchema, { type AnsioSchemaProps } from "@ansio/next-schema";

const ORIGIN = "https://www.palmsprings.co.th";

type PageSchemaProps = Omit<AnsioSchemaProps, "origin" | "clientKey">;

export function PageSchema(props: PageSchemaProps) {
  return (
    <AnsioSchema
      origin={ORIGIN}
      clientKey={process.env.NEXT_PUBLIC_AEO_GEO_KEY ?? ""}
      {...props}
    />
  );
}
