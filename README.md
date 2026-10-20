# Reaper Audio Tools store

The web store for Reaper Audio Tools: homepage, EasyDuck product page with a playable interface, Paddle checkout, a DrumCrusher waitlist, and terms, privacy and refund pages.

Built with Next.js 14. Styles come from the two Reaper Audio Tools design systems (plugin UI and web); see `app/design-systems.css`.

## Run it locally

```bash
npm install
cp .env.example .env.local   # then fill it in
npm run dev                  # http://localhost:3000
```

## Deploy on Vercel

1. vercel.com → Add New → Project → import `timdrivesfast/reaper-audio-tools`.
2. Framework is detected as Next.js. No build settings to change.
3. Add every key from `.env.example` under Settings → Environment Variables.
4. Deploy, then add your domain under Settings → Domains and set `NEXT_PUBLIC_SITE_URL` to it.

## Connect Paddle

1. Create a Paddle account and a sandbox account at sandbox-vendors.paddle.com.
2. In sandbox: Catalog → Products → add **EasyDuck** with a one-time price. Copy the price ID (`pri_…`) into `NEXT_PUBLIC_PADDLE_PRICE_EASYDUCK`.
3. Developer tools → Authentication → create a client-side token (`test_…`) and put it in `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN`.
4. Checkout settings → add your site domain as an approved domain (and `localhost` for testing).
5. Buy EasyDuck on your site with Paddle's test card `4242 4242 4242 4242`, any future date, any CVC.
6. When Paddle approves your live account, repeat steps 2 to 4 there, and set `NEXT_PUBLIC_PADDLE_ENV=production`.

Paddle reviews the site before approving payouts. It checks that your terms show your seller name, that the refund policy is clear, and that checkout works. Fill in the legal pages first.

Until a client token and price ID are set, the Buy button shows "Checkout opens here once Paddle is connected."

## Still to do before launch

- **Placeholders:** search the code for `[` to find every bracketed placeholder: price, OS requirements, trial, licenses, install steps, refund window, support email, response time, legal details.
- **Seller name:** `NEXT_PUBLIC_SELLER_NAME` must match your Paddle account exactly.
- **License keys and downloads:** Paddle takes the money but doesn't deliver the plugin. Hook up delivery: either a licensing service (Keygen, etc.) triggered by Paddle's `transaction.completed` webhook, or JUCE's online unlock with a small server.
- **Audio demos:** put dry and wet MP3s of the same loop in `public/audio/` and pass `drySrc` and `wetSrc` to the `AudioDemo` components in `app/plugins/easyduck/page.jsx`.
- **Waitlist:** set `WAITLIST_WEBHOOK_URL` to a Zapier, Make or email-tool webhook. Without it, signups only appear in the Vercel logs.
- **Logo:** the header uses the reaper ghost icon until there's a Reaper Audio Tools logo file.
- **DrumCrusher image:** replace `public/images/drumcrusher-concept.webp` when the real UI exists.
- **EasyDuck numbers:** check the control ranges in `lib/faq.js` against the shipped plugin.

## Where things live

| What | Where |
|---|---|
| Prices, product info, nav, footer links | `lib/site.js` + `.env.local` |
| FAQ answers (also published as FAQ schema) | `lib/faq.js` |
| Homepage | `app/page.jsx` |
| EasyDuck page | `app/plugins/easyduck/page.jsx` |
| Playable EasyDuck interface | `components/EasyDuckDemo.jsx` |
| Paddle checkout | `lib/paddle.js`, `components/BuyButton.jsx` |
| Waitlist endpoint | `app/api/waitlist/route.js` |
| Legal pages | `app/legal/*` |
| Store components (header, cards, LCDs…) | `components/web/index.jsx` |
| Plugin components (knobs, step grid…) | `components/plugin/` |

## Adding a plugin page

Copy `app/plugins/easyduck/` to a new folder, add the product to `lib/site.js` with its signature colour as `tone` (DrumCrusher is `cyan`), and add a Paddle price ID env var for it.
