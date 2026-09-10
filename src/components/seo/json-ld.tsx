/**
 * A JSON-LD block for structured data.
 *
 * The payload is serialized with `<` escaped, so a value read from the
 * database can never close the script element early.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replaceAll("<", "\\u003c"),
      }}
    />
  );
}
