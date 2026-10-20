import LegalPage from '../../components/LegalPage';
import { site } from '../../lib/site';

export const metadata = { title: 'Contact' };

export default function Contact() {
  return (
    <LegalPage title="Contact">
      <p>Email <strong>{site.supportEmail}</strong>. Include the plugin name, your DAW and your operating system.</p>
      <h2>Orders, receipts and refunds</h2>
      <p>Paddle handles checkout. Find your order at <a href="https://paddle.net" rel="noopener">paddle.net</a>, or reply to your receipt email.</p>
    </LegalPage>
  );
}
