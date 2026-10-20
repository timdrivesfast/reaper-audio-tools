import LegalPage from '../../../components/LegalPage';
import { site } from '../../../lib/site';

export const metadata = { title: 'Refund Policy' };

export default function Refunds() {
  return (
    <LegalPage title="Refund Policy" updated="[date]">
      <p>If a plugin isn't right for you, you can get a full refund within {site.refundDays} days of purchase. No questions asked.</p>

      <h2>How to request a refund</h2>
      <p>Reply to your Paddle receipt email, or find your order at <a href="https://paddle.net" rel="noopener">paddle.net</a> and request a refund there. You can also email {site.supportEmail} with your order number and we'll sort it out.</p>

      <h2>How refunds are paid</h2>
      <p>Paddle, our reseller and Merchant of Record, processes all refunds back to your original payment method. Depending on your bank, it can take 5 to 10 business days to show up.</p>

      <h2>After a refund</h2>
      <p>When a purchase is refunded, its license is deactivated. Please uninstall the plugin.</p>
    </LegalPage>
  );
}
