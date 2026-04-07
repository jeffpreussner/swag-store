import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Acme Swag Store";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";
export default async function Image() {
  const robotoSlabSemiBold = await readFile(
    join(process.cwd(), "public/font/RobotoSlab-SemiBold.ttf"),
  );

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 128,
        background: "white",
        width: "100%",
        height: "100%",
      }}
    >
      Acme Swag Store
    </div>,
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
