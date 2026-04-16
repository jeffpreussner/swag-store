# Vercel Partner Certification: Swag Store 

This repository holds the code from the Vercel Cohort 2 Swag Store assignment

## AI Disclosure
I did not use AI to generate anything other than UI or consult as per project requirements. I did however use AI Suggested commit messages in my Git GUI, I understand this may look sus.

## Tech Stack
Next.js
Shadcn
tailwind

## Notes
The following are notes i took throughout the build process, cleaned up and organized

## Architectural decisions and foundations in practice

### General project structure
Using a (marketing) route group to scope the public-facing site layout (header/footer/nav) to just these routes, keeping it isolated from other potential sections (/admin, /account) that would need different chrome. The group doesn't affect URLs.

Each page route has its own loading for instant route level suspense boundary. and a page level error boundary as we may want to handle errors on the product detail page different from the homepage. The [productSlug] route has its own error.tsx and not-found.tsx because error boundaries in Next.js are scoped to the segment they're defined in. Placing them at the product level means a failed product fetch or missing slug only surfaces a contextual error for that segment — the rest of the marketing layout stays intact. It also allows for product-specific recovery UI rather than a generic app-level error page.

### Homepage
For the homepage data I chose to go with two parallel promises, since the components are in two different areas of the page, it make sense to go with this pattern over a promise all. both fetches start at the same time and render to their independent suspense boundaries asap.

Image on the homepage uses a blur placeholder because we get that for free with static images and helps with perceived loading.

#### Featured Products
since the homepage is server component we can call the upstream api directly and not worry about exposing our secret. I chose to use the "use cache" directive and set the cacheLife to "days" I figured this list would be manually curated and not need to change frequently.

I split the FeaturedProducts own server component and wrap it in suspense to allow next stream the response and update. This allows us to instantly load the hero content. Nothing is blocked by the fetches on the page.


# Product detail
Product data is fetched in a server component so secrets stay on the server.

using a meta title and description to the products landing page as well as generateMetadata function to the product detail page so we can load product info and image into og data.

I added generateStaticParams to the page that loops through the available products and creates static pages for the dynamic routes at build time. So instead of rendering ProductDetailPage for every productSlug on demand at runtime they are statically generated.

I moved async work into a nested component and wrapped it with Suspense, which lets the shell render first and stream data in instead of blocking the whole route.

I was using a promise all combining stock and product fetches but I noticed I had an issue with the cache of the product detail pages being set to 1 minute, this is because my stock fetch was cached at 1 minute to keep things fresh avoid possible stock related errors at checkout.

I obviously wanted a long time to live on my product pages for performance so the 1 minute i had set for stock was not going to work. In order to fix this I separated the fetches to two parallel fetches, and i removed the cache on the stock all together, what this does is, allows my product data to load instantly while my add to add to cart UI streams in, and there is no risk of stale stock. and we aren't slowing the product detail fetch down with an uncached fetch.

I added a carousel in case there are more than 1 image (product images is an array) and I made the first image in the carousel priority

There are two intentional client boundaries here: the carousel and AddToCartButton. Everything else stays server-rendered to keep hydration focused and lightweight.

For add-to-cart, I am using server actions for all the cart mutations, add, update, delete. this allows for the same security a backend for frontend proxy would offer but uses nextjs server action mechanism which is a more direct approach than the backend for frontend proxy api would be.




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
