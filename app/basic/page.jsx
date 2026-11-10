import SuitePage from '../../components/v2/SuitePage';

export const metadata = {
  title: 'Basic Suite',
  description: 'Reaper Audio Tools Basic Suite: EasyDuck (free) and DrumCrusher. Light interface, a few controls per plugin. VST3 and AU for Mac and Windows.',
};

export default function Basic() {
  return <SuitePage suite="basic" title="Basic Suite" lede="A light interface and a handful of controls per plugin. Load it, turn two knobs, move on." />;
}
