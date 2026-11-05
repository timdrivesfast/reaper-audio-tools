# Reaper Audio Tools store

The web store for Reaper Audio Tools: homepage, EasyDuck product page with a playable interface, Stripe checkout for DrumCrusher and ModFX Pro, and terms, privacy and refund pages.

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

## Free plugins

EasyDuck is free (`free: true` in `lib/site.js`). Its page has an email form that posts to `/api/free-license`, which creates one license per email, emails the key and download links through Resend, and forwards the address to `WAITLIST_WEBHOOK_URL` (list `easyduck-free`) if that's set. It needs the same Supabase and Resend settings as paid orders.

## Plugin updates and support links

The plugins' Settings menu calls two site URLs (set in each plugin repo's `plugin/Source/Brand.h`):

- **Check for updates:** `GET /api/updates/<product>` returns `{"version":"x.y.z","url":"<site>/plugins/<product>"}`. The version is read from `installers/<product>/latest.json` in Supabase Storage, which the plugin's release workflow writes along with the installers. Set `EASYDUCK_LATEST_VERSION` in Vercel to override it.
- **Contact support:** `/contact`.

## Connect Stripe

1. Stripe Dashboard (start in test mode): **Settings → Managed Payments** → activate it. That makes Stripe (through Link) the merchant of record, so it handles sales tax and VAT. To sell as yourself instead, skip this and set `STRIPE_MANAGED_PAYMENTS=false`.
2. **Product catalog → Create product** for DrumCrusher and ModFX Pro: one-time price $29 USD, and a product tax code marked "Eligible for Managed Payments" (downloadable software). Copy each price ID (`price_…`) into `STRIPE_PRICE_DRUMCRUSHER` and `STRIPE_PRICE_MODFX_PRO`.
3. **Developers → API keys → Create restricted key** with only **Checkout Sessions: Write** (everything else None). Put the `rk_…` key in `STRIPE_SECRET_KEY`. A restricted key can only start checkouts, so a leak can't touch the rest of the account.
4. **Developers → Webhooks → Add endpoint**: URL `https://www.reaperaudiotools.com/api/stripe/webhook`, events `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`, `charge.refunded`, `charge.dispute.created`. Its signing secret (`whsec_…`) → `STRIPE_WEBHOOK_SECRET`.
5. Run `supabase/migrations/0005_stripe.sql` in Supabase.
6. Buy a plugin on the site with the test card `4242 4242 4242 4242`. The license email should arrive and the key should activate the plugin.
7. Go live: repeat steps 2 to 4 in live mode and swap in the live values.

Until `STRIPE_SECRET_KEY` and the price ID are set, the Buy button says checkout isn't connected yet.

## Still to do before launch

- **Placeholders:** search the code for `[` to find every bracketed placeholder: price, OS requirements, trial, licenses, install steps, refund window, support email, response time, legal details.
- **Seller name:** `NEXT_PUBLIC_SELLER_NAME` is your legal name (footer and terms).
- **Plugin activation (JUCE side):** the server is ready (see Licensing below). Each plugin still needs an activation screen that calls `/api/license/activate` and checks the signed license.
- **Audio demos:** put dry and wet MP3s of the same loop in `public/audio/` and pass `drySrc` and `wetSrc` to the `AudioDemo` components in `app/plugins/easyduck/page.jsx`.
- **Waitlist:** signups are saved to the Supabase `waitlist` table (run `supabase/migrations/0002_waitlist.sql`). Optionally set `WAITLIST_WEBHOOK_URL` to also forward them to an email tool.
- **Logo:** the header uses the reaper ghost icon until there's a Reaper Audio Tools logo file.
- **DrumCrusher image:** replace `public/images/drumcrusher-concept.webp` when the real UI exists.
- **EasyDuck numbers:** check the control ranges in `lib/faq.js` against the shipped plugin.

## Licensing

What happens after someone pays:

1. Stripe sends `checkout.session.completed` to `/api/stripe/webhook`. The app checks Stripe's signature, takes the buyer's email from the session, creates a key like `RAT-7KQ2-M9XD-P4HT-W3NC` in Supabase, and emails it with Mac and Windows download links.
2. Download links go to `/api/download`, which checks the key and redirects to a 10-minute link for the installer in Supabase Storage.
3. The plugin sends `{ key, product, machineId, machineName }` to `/api/license/activate`. The app enforces the computer limit and returns a license signed with Ed25519. The plugin checks it with the public key built into it and saves it, so it works offline after that.
4. `/api/license/deactivate` frees a computer. A refund or dispute in Stripe revokes the key automatically.

### Set it up

1. **Supabase:** SQL Editor → New query → paste `supabase/migrations/0001_licenses.sql` → Run. That creates the `licenses`, `activations` and `paddle_events` tables (`paddle_events` is unused now; `0005_stripe.sql` adds Stripe's) (locked down with row-level security) and a private `installers` storage bucket.
2. **Installers:** Storage → `installers` → create a folder per plugin and upload `easyduck/mac.pkg` and `easyduck/windows.exe` (any extension works; the name before the dot must be `mac` or `windows`).
3. **Signing keys:** run `npm run license:keys` once. Put the private key in Vercel as `LICENSE_SIGNING_PRIVATE_KEY`. Keep the public key for the plugin build. Don't regenerate later: a new pair breaks every activated license.
4. **Stripe:** see Connect Stripe above.
5. **Resend:** sign up at resend.com, verify your domain, create an API key → `RESEND_API_KEY`, and set `EMAIL_FROM` to an address on that domain.
6. **Supabase keys:** Project Settings → API → `SUPABASE_URL` and the `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`. Server-side only.

### Test the whole flow in sandbox

1. Buy DrumCrusher on the deployed site with Stripe's test card.
2. Check Supabase: a new row in `licenses`. Check your inbox: the license email.
3. Click a download link: the installer downloads.
4. Activate with curl:
   ```bash
   curl -X POST https://<your site>/api/license/activate -H 'content-type: application/json' \
     -d '{"key":"RAT-…","product":"easyduck","machineId":"test-machine-001","machineName":"Test Mac"}'
   ```
   Run it with three different machine IDs: the third returns 409 (limit reached at 2).
5. Refund the payment in the Stripe test dashboard: the license's `status` turns `revoked` and activation returns 403.

### Looking someone up

Supabase → Table Editor → `licenses`, filter by email. To reset someone's computers, delete their rows in `activations`. To kill a key, set `status` to `revoked`.

`npm test` checks key generation, license signing and Stripe signature verification.

## Where things live

| What | Where |
|---|---|
| Prices, product info, nav, footer links | `lib/site.js` + `.env.local` |
| FAQ answers (also published as FAQ schema) | `lib/faq.js` |
| Homepage | `app/page.jsx` |
| EasyDuck page | `app/plugins/easyduck/page.jsx` |
| Playable EasyDuck interface | `components/EasyDuckDemo.jsx` |
| Stripe checkout | `app/api/checkout`, `lib/server/stripe.js`, `components/v2/BuyButton.jsx` |
| Waitlist endpoint | `app/api/waitlist/route.js` |
| Legal pages | `app/legal/*` |
| Licensing endpoints | `app/api/stripe/webhook`, `app/api/license/*`, `app/api/download` |
| Licensing logic, email, Supabase client | `lib/server/` |
| Database schema | `supabase/migrations/0001_licenses.sql` |
| Store components (header, cards, LCDs…) | `components/web/index.jsx` |
| Plugin components (knobs, step grid…) | `components/plugin/` |

## Adding a plugin page

Copy `app/plugins/easyduck/` to a new folder, add the product to `lib/site.js` with its signature colour as `tone` (DrumCrusher is `cyan`), and add its `STRIPE_PRICE_<SLUG>` env var.


## Accounts and updates

- **Sign in:** `/account`. People enter their email and get a sign-in link (Resend). The link sets a signed cookie for 30 days. No passwords, no user table: an account is every active license on that email. Optional `AUTH_SECRET` signs the links and cookies; without it one is derived from `SUPABASE_SERVICE_ROLE_KEY`.
- **Account page:** each plugin they own with its license key, the latest version and its notes, Mac and Windows downloads, and for paid plugins the activated computers with a Remove button.
- **Update check:** the plugins' Check for updates calls `/api/updates/<slug>`, which returns the latest version and links to `/account?product=<slug>`.
- **Update emails:** run `supabase/migrations/0003_accounts.sql` once. `/api/releases/check` emails every owner when `installers/<slug>/latest.json` has a version newer than any already announced, once per version, with an unsubscribe link. The plugin release workflow calls it after uploading; a daily Vercel cron (`vercel.json`) is the backup. The first run for a plugin records its current version without sending.
- **Release notes:** the release workflow copies the GitHub release text into `latest.json` as `notes`. The account page and the update email show it.
