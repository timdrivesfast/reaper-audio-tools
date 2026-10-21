import { site } from './site';

// Full-sentence answers on purpose: search engines and AI assistants read these.
// [Bracketed] text is a placeholder. Replace it before launch, because it is published in the page's FAQ data too.

export const homeFaq = [
  { q: 'Which DAWs do Reaper Audio Tools plugins work in?', a: "Any DAW that loads VST3 or AU plugins. That covers Ableton Live, Logic Pro, FL Studio, Bitwig Studio, Cubase, Studio One, Reaper and GarageBand. On iPad, the plugins run as AUv3 in hosts like Logic Pro for iPad, Cubasis and AUM. Pro Tools needs the AAX format, which isn't supported [yet]." },
  { q: 'Do the plugins work on Mac, Windows and iPad?', a: 'Yes. On Mac you get VST3 and AU. On Windows you get VST3. On iPad you get AUv3. Minimum system requirements: [macOS version], [Windows version], [iPadOS version], [Apple Silicon and Intel support].' },
  { q: 'Is it a one-time purchase or a subscription?', a: '[One-time purchase per plugin, or subscription. Say which, and whether future updates are included.]' },
  { q: 'Is there a free trial?', a: "[Trial length, what's limited during the trial, and whether a card is needed to start it.]" },
  { q: 'What is the refund policy?', a: `If a plugin isn't right for you, you can get a full refund within ${site.refundDays} days of purchase. Paddle refunds it to your original payment method.` },
];

export const easyDuckFaq = [
  { q: 'What does EasyDuck do?', a: 'EasyDuck is a sidechain emulator plugin. It turns the volume of a track down and back up in a rhythm, which creates the pumping sound you hear in house, techno and pop when a bass or pad ducks under the kick. You draw the shape of the duck and pick the rhythm, and EasyDuck plays it in time with your song.' },
  { q: 'Do I need a kick drum on another track to use it?', a: "No. A normal sidechain compressor listens to another track, usually the kick, and needs routing set up in your DAW. EasyDuck runs its own pattern synced to your DAW's tempo, so you put it on any track and it works with no routing and no ghost kick." },
  { q: 'How is EasyDuck different from a sidechain compressor?', a: "A compressor reacts to whatever audio comes in, so the ducking changes with the kick's level and timing. EasyDuck follows the envelope and step pattern you set, so every duck has the shape you set. You can also duck on rhythms a kick doesn't play, like triplets or off-beats." },
  { q: 'What controls does EasyDuck have?', a: 'Attack (1 to 150 ms), Decay (20 to 600 ms), Length (0 to 300 ms) and Depth (0 to 100%), plus an envelope you can drag directly. The Pattern section has note values of 1/4, 1/8 and 1/16, a triplet switch, swing, one or two bars, and velocity per step. There are six presets: Disco, Boom Bap, Rock, Deep House, Techno and Trance. [Confirm ranges against the shipped plugin.]' },
  { q: 'Which DAWs does EasyDuck work in?', a: "Any DAW that loads VST3 or AU plugins, including Ableton Live, Logic Pro, FL Studio, Bitwig Studio, Cubase, Studio One and Reaper. On iPad it runs as AUv3. Pro Tools needs AAX, which isn't supported [yet]." },
  { q: 'Can I try EasyDuck before I buy it?', a: "[Trial length, what's limited during the trial, and whether a card is needed to start it.] You can also try the interface on this page." },
  { q: 'What is the refund policy?', a: `If EasyDuck isn't right for you, you can get a full refund within ${site.refundDays} days of purchase. Paddle handles checkout and refunds.` },
];
