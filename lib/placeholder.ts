const svg = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"> 
  <rect width="${w}" height="${h}" fill="#ccc" />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

// ideally this placeholder would come from the server along with the product image but for the purpose of this project well use a shimmer svg
export const placeholder = (w=300,h=300) => `data:image/svg+xml;base64,${toBase64(svg(w , h))}`;