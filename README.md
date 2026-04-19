# Vercel Partner Certification: Swag Store

This repository holds the code from the Vercel Cohort 2 Swag Store assignment.

## Tech Stack

Next.js
Shadcn
tailwind

## Notes

The following are notes I took throughout the build process, cleaned up and organized.

## Architectural decisions and foundations in practice

### General project structure

The root layout handles global concerns: `robots.ts`, `sitemap.ts`, `global-error.tsx`, open graph and twitter image defaults, font loading, global CSS.

The marketing route group to scope the public-facing site layout (header/footer/nav) to just these routes, keeping it isolated from other potential sections (`/admin`, `/account`) that would need different chrome. The group doesn't affect URLs.

All data fetching runs in server components; API keys never reach the client.

Each page route has a `loading.tsx` file, providing an instant route level Suspense Boundary, and an `error.tsx` file allowing us to provide a custom Error Boundary per route because Error Boundaries in Next.js are scoped to the segment they are defined in, so an error in a specific route with an Error Boundary won't effect the rest of the marketing layout. If there is a route without an Error Boundary the error will bubble up to the next Error Boundary.

The dynamic `[productSlug]` route `not-found.tsx` because I handle missing products a bit different than other missing pages.

The `getProductPages` function in `sitemap.ts` fetches all of the product routes so we can add them to the sitemap.

### Component Caching

I used `'use cache'` on all the products.ts data-fetching functions which tells Next.js to cache the results. Product/promo/category `cacheLife` is set to `days` as this is authored content and won’t change often.

I added `cacheTag` even though we aren't currently using it, in a real-world scenario we would be calling `revalidateTag` from a webhook when product updates in CMS. Using `revalidateTag` allows Next.js to bust cache, selectively leaving unrelated items cached.

I call `revalidatePath` in the Cart actions with `layout` scope so Next.js will re-render the layout without busting unrelated caches.

I am not caching stock or cart data since it's user specific and needs to be fresh, more on that in the cart section.

When two levels of cache are used in one route, the route uses the shorter cache which could lead to poor performance and unexpected issues.

### Performance considerations

`Next/font` is used for webfonts with `adjustFontFallback` and `display: swap` to minimize CLS.

The fonts are exposed via CSS variable so I can use them in Tailwind.

Hero image on the homepage uses `next/image` with priority `fetchPriority` and `loading` set to `eager`, I wanted to avoid risk of poor LCP. I also set an aspect ratio on the hero to avoid CLS. I am also using sizes so the image tag will add srcsets with the appropriate widths and I am adding placeholders on all images.

Product detail pages are pre-rendered at build time (more on this in Product Detail).

I tested performance with `web-vitals` and `@vercel/speed-insights`.

### Homepage

For the homepage data I chose to go with two parallel Promises, since the components are in two different areas of the page, it makes sense to go with this pattern over a `Promise.all`. Both fetches start at the same time and render to their independent Suspense Boundaries ASAP.

Image on the homepage uses a blur placeholder because we get that for free with static images and helps with perceived loading.

#### Featured Products

Featured products are cached with `cacheLife('days')` since authored content doesn't change often.

I split the `FeaturedProducts` into a separate component and wrap it in its own Suspense Boundary to allow next stream the response and update. This allows us to instantly load the hero content. Nothing is blocked by the fetches on the page.

### Product Detail

I am using `generateMetadata` to add per product OG title, description and images. `params` is a Promise, so it's awaited inside `generateMetadata` and `ProductDetails` rather than page level to allow page shell to render immediately.

I added `generateStaticParams` to the page that loops through the available products and creates static pages for the dynamic routes at build time. So instead of rendering `ProductDetailPage` for every `productSlug` on demand at runtime they are statically generated.

Follows the same Suspense streaming pattern as the homepage.

I was using a `Promise.all` combining stock and product fetches, but I noticed I had an issue with the cache of the product detail pages being set to 1 minute, this is because my fetchStock function was cached and `cacheLife` was `minutes`.

To keep product pages highly cacheable, I split product and stock into parallel fetches and removed caching from stock entirely. This lets product data load instantly while the add‑to‑cart UI streams in, avoids stale stock, and prevents uncached requests from slowing the page.

I added a carousel in case there are more than 1 image (`product.images` is an array) and I made the first image in the carousel `priority`. Possible enhancement here would be only loading the carousel if there is more that 1 image.

There are two intentional Client Boundaries on the `ProductDetailPage`: the `Carousel` and `AddToCartButton`. Everything else stays server-rendered to keep hydration focused and lightweight.

In the `AddToCartButton` I am using the `useActionState` hook to submit the form data to the server action it simplifies the form submission flow and has a handy pending state. 

### Cart Page

I needed to get stock to avoid cart errors down the line adding more quantity than available stock.

The cart and stock are both not cached so it made sense to me to combine the fetches, however the N+1 problem was unavoidable with the current stock API endpoint only accepting 1 `id` per request.

I created a function named `addStockAndFormat` that does a couple of things. It converts all the price data to the correct format and adds stock data to the cart item using fetchStock.

The `Cart` component is added to the cart page with a Suspense Boundary since it's async, well need to stream the UI in. I built the `CartList` as a Client Boundary. Moving the list to the client allows for optimistic updates of the UI so when you update or delete an item it happens instantly, unless there is an issue and the state reverts. Using `useTransition` here marks the state update as non-urgent, allowing the UI to remain responsive.

I set up add, update, and delete server actions in `cart.ts` to handle the cart mutations.

Each of the actions follow a similar pattern:

- Retrieve the `cookieStore` with `next/headers`
- Get the `cartToken` in the `cookieStore` or call the `/api/cart/create` API to get a new token.
- `setCartCookie` will set a `cartToken` cookie with a `maxAge` set to `ONE_DAY_IN_SECONDS` if it doesn't exist.
- Perform fetch action
- Call `revalidatePath`
- Return data

### Search Page

The `SearchPage` follows the same pattern as the homepage and the product detail page, since `searchParams` is a Promise I pass it to the `Products` and `ProductsPagination` components instead of blocking whole page render.

The URL is the single source of truth for search state. When the user types or filters, `SearchFilters` calls `router.replace()` with updated query params. That causes the server components to re-render with fresh `searchParams`.

The search state is automatically deeplink-able and shareable.

# Future enhancements   

Cart state in a provider and update optimistically giving user immediate feedback for `CartBadge`.

Consider using less Suspense to make the site load more content with JavaScript turned off.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

