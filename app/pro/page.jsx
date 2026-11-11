import { launch } from '../../lib/site';
import SuitePage from '../../components/v2/SuitePage';

export const metadata = {
  alternates: { canonical: '/pro' },
  title: 'Pro Suite',
  description: `Reaper Audio Tools Pro Suite: paid plugins with deeper control and a dark interface. ModFX Pro ${launch.live ? 'is out now' : `launches ${launch.label}`}.`,
};

export default function Pro() {
  return <SuitePage suite="pro" dark title="Pro Suite"
    lede="Paid plugins with deeper control and a dark interface, for performance and sound design. Each plugin is a one-time purchase." />;
}
