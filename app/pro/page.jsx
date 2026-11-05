import SuitePage from '../../components/v2/SuitePage';

export const metadata = {
  title: 'Pro Suite',
  description: 'Reaper Audio Tools Pro Suite: paid plugins with deeper control and a dark interface. ModFX Pro is out now.',
};

export default function Pro() {
  return <SuitePage suite="pro" dark title="Pro Suite" cta={{ label: 'Buy ModFX Pro', href: '/plugins/modfx-pro#buy' }}
    lede="Paid plugins with deeper control and a dark interface, for performance and sound design. Each plugin is a one-time purchase." />;
}
