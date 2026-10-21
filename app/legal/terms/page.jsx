import LegalPage from '../../../components/LegalPage';
import { site } from '../../../lib/site';

export const metadata = { title: 'Terms of Service' };

export default function Terms() {
  return (
    <LegalPage title="Terms of Service" updated="October 21, 2026">
      <h2>Who we are</h2>
      <p>Reaper Audio Tools is operated by {site.sellerName}, a sole proprietor based in [city, state, country]. In these terms, "we" and "us" mean {site.sellerName} trading as Reaper Audio Tools, and "you" means the person buying or using our plugins. Contact: {site.supportEmail}.</p>

      <h2>Orders and payment</h2>
      <p>Free plugins don't need payment. Enter your email and we send a license key and download links.</p>
      <p>Our order process is conducted by our online reseller Paddle.com. Paddle.com is the Merchant of Record for all our orders. Paddle provides all customer service inquiries and handles returns. Paddle's buyer terms apply to your purchase and are available at <a href="https://www.paddle.com/legal" rel="noopener">paddle.com/legal</a>.</p>
      <p>Prices are shown in US dollars. Sales tax or VAT is calculated and added by Paddle at checkout based on your location.</p>

      <h2>Your license</h2>
      <p>When you buy or download a plugin, including free plugins like EasyDuck, you get a personal, non-exclusive, non-transferable license to install and use it on up to {process.env.LICENSE_MAX_ACTIVATIONS || 2} computers you own or control. You can use it to make music for any purpose, including commercial releases. Audio you make with our plugins belongs to you.</p>
      <p>You may not resell, share, sublicense, rent or distribute the plugin or your license key, or reverse engineer, decompile or modify the plugin except where the law allows it.</p>

      <h2>Updates and support</h2>
      <p>[Say whether updates are free, for how long, and what support you offer.] Email {site.supportEmail} with the plugin name, your DAW and your operating system.</p>

      <h2>Refunds</h2>
      <p>See our <a href="/legal/refunds">Refund Policy</a>.</p>

      <h2>No warranty</h2>
      <p>The plugins are provided "as is". We work hard to make them stable, but we don't guarantee they will be error free or work with every system. Save your projects often.</p>

      <h2>Limitation of liability</h2>
      <p>To the extent the law allows, our total liability to you for any claim related to a plugin is limited to the amount you paid for it. We are not liable for indirect or consequential losses, including lost data or lost projects.</p>

      <h2>Changes</h2>
      <p>We may update these terms. The date at the top shows the latest version. Continued use after a change means you accept the updated terms.</p>

      <h2>Governing law</h2>
      <p>These terms are governed by the laws of [state, country].</p>
    </LegalPage>
  );
}
