import LegalPage from '../../../components/LegalPage';
import { site } from '../../../lib/site';

export const metadata = { title: 'Refund Policy' };

export default function Refunds() {
  return (
    <LegalPage title="Refund Policy" updated="November 4, 2026">
      <p>If a paid plugin isn't right for you, you can get a full refund within {site.refundDays} days of purchase. Free plugins like EasyDuck and DrumCrusher have nothing to refund.</p>

      <h2>How to request a refund</h2>
      <p>Email {site.supportEmail} with the email you bought with and which plugin, and we'll refund it. You can also find your order at <a href="https://app.link.com" rel="noopener">app.link.com</a>, since purchases are sold through Link, Stripe's checkout, and ask there.</p>

      <h2>How refunds are paid</h2>
      <p>Refunds go back to your original payment method through Stripe, including any sales tax or VAT you paid. Depending on your bank, it can take 5 to 10 business days to show up.</p>

      <h2>After a refund</h2>
      <p>When a purchase is refunded, its license is deactivated. Please uninstall the plugin.</p>
    </LegalPage>
  );
}
