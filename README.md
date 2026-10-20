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
- **Plugin activation (JUCE side):** the server is ready (see Licensing below). Each plugin still needs an activation screen that calls `/api/license/activate` and checks the signed license.
- **Audio demos:** put dry and wet MP3s of the same loop in `public/audio/` and pass `drySrc` and `wetSrc` to the `AudioDemo` components in `app/plugins/easyduck/page.jsx`.
- **Waitlist:** set `WAITLIST_WEBHOOK_URL` to a Zapier, Make or email-tool webhook. Without it, signups only appear in the Vercel logs.
- **Logo:** the header uses the reaper ghost icon until there's a Reaper Audio Tools logo file.
- **DrumCrusher image:** replace `public/images/drumcrusher-concept.webp` when the real UI exists.
- **EasyDuck numbers:** check the control ranges in `lib/faq.js` against the shipped plugin.

## Licensing

What happens after someone pays:

1. Paddle sends `transaction.completed` to `/api/paddle/webhook`. The app checks Paddle's signature, looks up the buyer's email, creates a key like `RAT-7KQ2-M9XD-P4HT-W3NC` in Supabase, and emails it with Mac and Windows download links.
2. Download links go to `/api/download`, which checks the key and redirects to a 10-minute link for the installer in Supabase Storage.
3. The plugin sends `{ key, product, machineId, machineName }` to `/api/license/activate`. The app enforces the computer limit and returns a license signed with Ed25519. The plugin checks it with the public key built into it and saves it, so it works offline after that.
4. `/api/license/deactivate` frees a computer. A refund or chargeback in Paddle revokes the key automatically.

### Set it up

1. **Supabase:** SQL Editor → New query → paste `supabase/migrations/0001_licenses.sql` → Run. That creates the `licenses`, `activations` and `paddle_events` tables (locked down with row-level security) and a private `installers` storage bucket.
2. **Installers:** Storage → `installers` → create a folder per plugin and upload `easyduck/mac.pkg` and `easyduck/windows.exe` (any extension works; the name before the dot must be `mac` or `windows`).
3. **Signing keys:** run `npm run license:keys` once. Put the private key in Vercel as `LICENSE_SIGNING_PRIVATE_KEY`. Keep the public key for the plugin build. Don't regenerate later: a new pair breaks every activated license.
4. **Paddle:** Developer tools → Authentication → create an API key → `PADDLE_API_KEY`. Developer tools → Notifications → New destination → URL `https://<your site>/api/paddle/webhook`, events `transaction.completed`, `adjustment.created`, `adjustment.updated` → copy its secret to `PADDLE_WEBHOOK_SECRET`.
5. **Resend:** sign up at resend.com, verify your domain, create an API key → `RESEND_API_KEY`, and set `EMAIL_FROM` to an address on that domain.
6. **Supabase keys:** Project Settings → API → `SUPABASE_URL` and the `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`. Server-side only.

### Test the whole flow in sandbox

1. Buy EasyDuck on the deployed site with Paddle's test card.
2. Check Supabase: a new row in `licenses`. Check your inbox: the license email.
3. Click a download link: the installer downloads.
4. Activate with curl:
   ```bash
   curl -X POST https://<your site>/api/license/activate -H 'content-type: application/json' \
     -d '{"key":"RAT-…","product":"easyduck","machineId":"test-machine-001","machineName":"Test Mac"}'
   ```
   Run it with three different machine IDs: the third returns 409 (limit reached at 2).
5. Refund the order in the Paddle sandbox dashboard: the license's `status` turns `revoked` and activation returns 403.

### Looking someone up

Supabase → Table Editor → `licenses`, filter by email. To reset someone's computers, delete their rows in `activations`. To kill a key, set `status` to `revoked`.

`npm test` checks key generation, license signing and Paddle signature verification.

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
| Licensing endpoints | `app/api/paddle/webhook`, `app/api/license/*`, `app/api/download` |
| Licensing logic, email, Supabase client | `lib/server/` |
| Database schema | `supabase/migrations/0001_licenses.sql` |
| Store components (header, cards, LCDs…) | `components/web/index.jsx` |
| Plugin components (knobs, step grid…) | `components/plugin/` |

## Adding a plugin page

Copy `app/plugins/easyduck/` to a new folder, add the product to `lib/site.js` with its signature colour as `tone` (DrumCrusher is `cyan`), and add a Paddle price ID env var for it.
