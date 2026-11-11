import LegalPage from '../../components/LegalPage';
import { site } from '../../lib/site';

export const metadata = {
  alternates: { canonical: '/contact' }, title: 'Contact' };

export default function Contact() {
  return (
    <LegalPage title="Contact">
      <p>Email <strong>{site.supportEmail}</strong>. Include the plugin name, your DAW and your operating system.</p>
      <h2>Orders, receipts and refunds</h2>
      <p>Checkout is handled by Stripe and sold through Link, Stripe's merchant of record. Your receipt comes from Link, and you can find the order at <a href="https://app.link.com" rel="noopener">app.link.com</a>. For anything about the plugin itself, email us.</p>
    </LegalPage>
  );
}
