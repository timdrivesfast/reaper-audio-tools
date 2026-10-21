import LegalPage from '../../../components/LegalPage';
import { site } from '../../../lib/site';

export const metadata = { title: 'Privacy Policy' };

export default function Privacy() {
  return (
    <LegalPage title="Privacy Policy" updated="October 21, 2026">
      <p>This policy explains what personal data Reaper Audio Tools ({site.sellerName}) collects and how it is used. Contact: {site.supportEmail}.</p>

      <h2>What we collect</h2>
      <ul>
        <li><strong>Free downloads:</strong> your email address, so we can send your license key and download links.</li>
        <li><strong>Waitlist and email signups:</strong> your email address and which list you joined.</li>
        <li><strong>Purchases:</strong> Paddle collects your name, email, billing address and payment details to process your order. We receive your name, email, country and order details from Paddle. We never see your full card number.</li>
        <li><strong>License activation:</strong> your license key and an ID and name for your computer, so we can count how many computers use the license.</li>
        <li><strong>Site analytics:</strong> we don't use analytics or tracking cookies on this site.</li>
      </ul>

      <h2>How we use it</h2>
      <p>To deliver your plugins and license keys, give support, send the emails you signed up for, and run the business. We don't sell your data.</p>

      <h2>Who we share it with</h2>
      <p>Paddle (payments and tax), Resend (license and download emails), Vercel (website hosting) and Supabase (license and download records). Each processes data only to provide its service.</p>

      <h2>Your choices</h2>
      <p>Every email has an unsubscribe link. You can ask us to access, correct or delete your data at any time by emailing {site.supportEmail}. If you are in the EU, UK or California, you have additional rights under GDPR, UK GDPR or CCPA, and we will honor them.</p>

      <h2>How long we keep it</h2>
      <p>Order records are kept as long as the law requires for tax and accounting. Waitlist emails are kept until you unsubscribe or ask us to delete them.</p>
    </LegalPage>
  );
}
