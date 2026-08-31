import Image from "next/image";

import { getBrandLogoPath } from "@/lib/env";
import { cn } from "@/lib/utils";

/**
 * Brand mark.
 *
 * The default is a text wordmark, so no image asset is required to ship.
 * Setting `NEXT_PUBLIC_BRAND_LOGO_PATH` to a file in `public/` swaps in a real
 * logo; while it is unset no image is requested, so a broken image is not
 * possible.
 */
export function Wordmark({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md";
}) {
  const logoPath = getBrandLogoPath();
  const height = size === "sm" ? 20 : 24;

  if (logoPath !== null) {
    return (
      <Image
        src={logoPath}
        alt="codeissue"
        width={height * 5}
        height={height}
        priority
        className={cn("w-auto", size === "sm" ? "h-5" : "h-6", className)}
      />
    );
  }

  return (
    <span className={cn("wordmark", size === "sm" && "text-sm", className)}>
      <span className="font-semibold">code</span>
      <span className="text-ink-muted">issue</span>
    </span>
  );
}
