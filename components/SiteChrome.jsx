import { SiteHeader, SiteFooter, Button } from './web';
import { site, nav, footerColumns } from '../lib/site';

export function Header({ tone = 'coral', ticker }) {
  return (
    <SiteHeader
      tone={tone}
      ticker={ticker || ['01 EASYDUCK', 'OUT NOW', '02 DRUMCRUSHER', 'SOON']}
      links={nav}
      logo="/images/typemark.png"
      action={<Button variant="soft" href="/plugins/easyduck" style={{ height: 44, padding: '0 18px' }}>Shop EasyDuck</Button>}
    />
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <SiteFooter
      tone="coral"
      columns={footerColumns}
      note={`Reaper Audio Tools. ${site.supportEmail}`}
      fine={`© ${year} ${site.sellerName}, trading as Reaper Audio Tools. Orders are processed by Paddle.com, our Merchant of Record.`}
    />
  );
}
