import { site } from './site';

// Full-sentence answers on purpose: search engines and AI assistants read these.
// [Bracketed] text is a placeholder. Replace it before launch, because it is published in the page's FAQ data too.

export const homeFaq = [
  { q: 'Which DAWs do Reaper Audio Tools plugins work in?', a: "Any DAW that loads VST3 or AU plugins. That covers Ableton Live, Logic Pro, FL Studio, Bitwig Studio, Cubase, Studio One, Reaper and GarageBand. Pro Tools needs the AAX format, which isn't supported." },
  { q: 'Do the plugins work on Mac and Windows?', a: 'Yes. On Mac you get VST3 and AU. On Windows you get VST3.' },
  { q: 'Is EasyDuck free?', a: "Yes. Enter your email on the EasyDuck page and we'll send a license key and download links. No card needed." },
  { q: 'When is DrumCrusher coming out?', a: "There's no release date yet. Sign up on this page and we'll email you once when it's released." },
];

export const easyDuckFaq = [
  { q: "What does EasyDuck do?", a: "EasyDuck is a sidechain emulation plugin. It ducks a track's volume in a rhythm, which creates the pumping sound you hear in house, techno and pop when a bass or pad drops under the kick. It doesn't need an input signal, so there's no routing or busses. Put it on the track you want to duck." },
  { q: 'Do I need a kick drum on another track to use it?', a: "No. A normal sidechain compressor listens to another track, usually the kick, and needs routing set up in your DAW. EasyDuck runs its own pattern synced to your DAW's tempo, so you put it on any track and it works with no routing and no ghost kick." },
  { q: 'How is EasyDuck different from a sidechain compressor?', a: "A compressor reacts to whatever audio comes in, so the ducking changes with the kick's level and timing. EasyDuck follows the envelope and step pattern you set, so every duck has the shape you set. You can also duck on rhythms a kick doesn't play, like triplets or off-beats." },
  { q: "What controls does EasyDuck have?", a: "The Trigger envelope: Attack (1 to 150 ms), Decay (20 to 600 ms), Length (0 to 300 ms) and Depth (0 to 100%), or drag the curve directly. The pattern grid: 1/4, 1/8 or 1/16 notes, triplets, swing, 1 or 2 bars, and velocity per step. Juice, which adds analog bump and noise. Six presets: Disco, Boom Bap, Rock, Deep House, Techno and Trance." },
  { q: 'Which DAWs does EasyDuck work in?', a: "Any DAW that loads VST3 or AU plugins, including Ableton Live, Logic Pro, FL Studio, Bitwig Studio, Cubase, Studio One and Reaper. Pro Tools needs AAX, which isn't supported." },
  { q: 'Is EasyDuck free?', a: "Yes. Enter your email and we'll send a license key and download links. No card needed." },
];
