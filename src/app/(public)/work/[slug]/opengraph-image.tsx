import { ImageResponse } from "next/og";

import { loadPublishedPortfolioItem } from "@/lib/content/queries";

export const alt = "Case study";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type PageProps = { params: Promise<{ slug: string }> };

/** A social card per published case study, built from the same row as the page. */
export default async function OpengraphImage({ params }: PageProps) {
  const { slug } = await params;
  const item = await loadPublishedPortfolioItem(slug);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        backgroundColor: "#000",
        padding: "28px",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          border: "1px solid #262626",
          borderRadius: "16px",
          padding: "56px",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, color: "#8f8f8f" }}>
          Case study - codeissue
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 72,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: "#ededed",
            }}
          >
            {item?.title ?? "Project not found"}
          </div>
          <div
            style={{ display: "flex", fontSize: 28, color: "#8f8f8f", marginTop: 20 }}
          >
            {item ? item.summary : "This write-up is not public."}
          </div>
        </div>
      </div>
    </div>,
    size,
  );
}
