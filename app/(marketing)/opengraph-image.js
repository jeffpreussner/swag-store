import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Image metadata
export const alt = "Acme Swag Store";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

// Image generation
export default async function Image() {
  // Font loading, process.cwd() is Next.js project directory
  const robotoSlabSemiBold = await readFile(
    join(process.cwd(), "public/font/RobotoSlab-SemiBold.ttf"),
  );

  return new ImageResponse(
    // ImageResponse JSX element
    <div
      style={{
        fontSize: 128,
        background: "white",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      Acme Swag Store
    </div>,
    // ImageResponse options
    {
      ...size,
      fonts: [
        {
          name: "Roboto Slab",
          data: robotoSlabSemiBold,
          style: "normal",
          weight: 600,
        },
      ],
    },
  );
}
