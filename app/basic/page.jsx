import SuitePage from '../../components/v2/SuitePage';

export const metadata = {
  title: 'Basic Suite',
  description: 'Reaper Audio Tools Basic Suite: EasyDuck and DrumCrusher, both free. Light interface, a few controls per plugin. VST3 and AU for Mac and Windows.',
};

export default function Basic() {
  return <SuitePage suite="basic" title="Basic Suite" lede="Free plugins with a light interface and a handful of controls each. Load it, turn two knobs, move on." />;
}
