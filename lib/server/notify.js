// Posts order alerts to Slack (#orders) through an incoming webhook.
// Never throws and never holds a request for more than ~2.5 s: a Slack problem must not break a download or a purchase.
import { products } from '../site';

const EMOJI = { easyduck: ':duck:', drumcrusher: ':drum_with_drumsticks:', 'modfx-pro': ':level_slider:' };

export function maskEmail(email = '') {
  const [user, domain] = String(email).split('@');
  if (!domain) return 'unknown';
  return `${user.slice(0, 2)}${'*'.repeat(Math.max(1, Math.min(6, user.length - 2)))}@${domain}`;
}

async function post(text) {
  const url = process.env.SLACK_ORDERS_WEBHOOK_URL;
  if (!url) return;
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 2500);
    await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ text }), signal: ctrl.signal });
    clearTimeout(timer);
  } catch (err) {
    console.error('[notify] slack', err?.message || err);
  }
}

/** New license issued. `total` is how many this product has now, when known. */
export async function notifyOrder({ product, email, paid = false, amount, total, cart }) {
  const p = products[product];
  const name = p?.name || product;
  const what = paid ? `*$${amount ?? p?.price ?? '?'} sale*` : 'free download';
  const nth = total ? ` · ${name} #${total}` : '';
  const many = cart ? ` · cart of ${cart}` : '';
  await post(`${EMOJI[product] || ':package:'} *${name}* · ${what} · ${maskEmail(email)}${nth}${many}`);
}

export async function notifyRefund({ reason, count }) {
  await post(`:leftwards_arrow_with_hook: ${reason === 'dispute' ? 'Dispute' : 'Refund'}: ${count || 'a'} license${count === 1 ? '' : 's'} revoked`);
}

/** Part of a cart order refunded: the webhook can't tell which plugin, so revoke it by hand in Supabase. */
export async function notifyPartialRefund({ amount, paymentIntent }) {
  await post(`:warning: Partial refund${amount ? ` of $${amount}` : ''} on ${paymentIntent || 'an order'}. No license revoked: revoke the refunded plugin's license by hand.`);
}
