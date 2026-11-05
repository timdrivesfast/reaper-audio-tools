import ProductPage from '../../../components/v2/ProductPage';
import { products } from '../../../lib/site';
import { drumCrusherFaq } from '../../../lib/faq';

const p = products.drumcrusher;

export const metadata = {
  title: 'DrumCrusher, drum bus processor plugin',
  description: 'DrumCrusher is a drum bus processor for VST3 and AU with 3-band EQ, filters and per-band wet faders. $29.',
  openGraph: { images: [p.ui] },
};

const features = [
  { stat: '3 BANDS', title: 'Low, mid and high', body: 'Each band has its own amount, frequency and wet fader, with solo and mute, so you can crush the lows and leave the hats alone.' },
  { stat: 'MASTER', title: 'Drive and air', body: 'Drive pushes the whole bus. Air brings back the top end. Mix blends the processed drums with the dry ones.' },
  { stat: 'HPF · LPF', title: 'Filters', body: 'High-pass and low-pass filters on the master to clean up the low end or darken the kit.' },
  { stat: 'A / B', title: 'Compare', body: 'Two settings slots. Flip between them to hear which one sits better in the mix.' },
];

export default function Page() {
  return <ProductPage product={p} features={features} faq={drumCrusherFaq} />;
}
