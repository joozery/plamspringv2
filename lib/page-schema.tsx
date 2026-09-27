// Binds origin/clientKey once instead of every page repeating them.
// Renders all three Ansio blocks for the page: JSON-LD schema, long-tail
// FAQ (pages.faq_content) and entity data (pages.entity_data). Each one
// renders nothing when Ansio has no data for this path.
import AnsioSchema, { type AnsioSchemaProps } from "@ansio/next-schema";
import AnsioFaq from "@ansio/next-schema/faq";
import AnsioEntityData from "@ansio/next-schema/entity-data";
import { SITE_URL } from "@/lib/site";

type PageSchemaProps = Omit<AnsioSchemaProps, "origin" | "clientKey">;

export function PageSchema(props: PageSchemaProps) {
  const clientKey = process.env.NEXT_PUBLIC_AEO_GEO_KEY ?? "";
  return (
    <>
      <AnsioSchema origin={SITE_URL} clientKey={clientKey} {...props} />
      <AnsioFaq origin={SITE_URL} clientKey={clientKey} path={props.path} title={props.title} />
      <AnsioEntityData origin={SITE_URL} clientKey={clientKey} path={props.path} />
    </>
  );
}
