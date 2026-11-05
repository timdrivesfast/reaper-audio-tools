import { site } from './site';

// Full-sentence answers on purpose: search engines and AI assistants read these.
// [Bracketed] text is a placeholder. Replace it before launch, because it is published in the page's FAQ data too.

export const homeFaq = [
  { q: 'Which DAWs do Reaper Audio Tools plugins work in?', a: "Any DAW that loads VST3 or AU plugins. That covers Ableton Live, Logic Pro, FL Studio, Bitwig Studio, Cubase, Studio One, Reaper and GarageBand. Pro Tools needs the AAX format, which isn't supported." },
  { q: 'Do the plugins work on Mac and Windows?', a: 'Yes. On Mac you get VST3 and AU. On Windows you get VST3.' },
  { q: "What's free and what's paid?", a: "EasyDuck is free: enter your email on its page and we'll send a license key and download links, no card needed. DrumCrusher and ModFX Pro are $29 each, a one-time purchase with no subscription." },
  { q: "What's the Pro Suite?", a: 'Paid plugins with deeper control and a dark interface. ModFX Pro is the first one, and it is out now.' },
  { q: 'Can I use Basic and Pro plugins together?', a: 'Yes. They are separate plugins and run side by side in the same project.' },
  { q: 'How many computers can I use a license on?', a: `${process.env.LICENSE_MAX_ACTIVATIONS || 2} at a time. You can free a computer from your account page whenever you switch machines.` },
];

export const easyDuckFaq = [
  { q: "What does EasyDuck do?", a: "EasyDuck is a sidechain emulation plugin. It ducks a track's volume in a rhythm, which creates the pumping sound you hear in house, techno and pop when a bass or pad drops under the kick. It doesn't need an input signal, so there's no routing or busses. Put it on the track you want to duck." },
  { q: 'Do I need a kick drum on another track to use it?', a: "No. A normal sidechain compressor listens to another track, usually the kick, and needs routing set up in your DAW. EasyDuck runs its own pattern synced to your DAW's tempo, so you put it on any track and it works with no routing and no ghost kick." },
  { q: 'How is EasyDuck different from a sidechain compressor?', a: "A compressor reacts to whatever audio comes in, so the ducking changes with the kick's level and timing. EasyDuck follows the envelope and step pattern you set, so every duck has the shape you set. You can also duck on rhythms a kick doesn't play, like triplets or off-beats." },
  { q: "What controls does EasyDuck have?", a: "The Trigger envelope: Attack (1 to 150 ms), Decay (20 to 600 ms), Length (0 to 300 ms) and Depth (0 to 100%), or drag the curve directly. The pattern grid: 1/4, 1/8 or 1/16 notes, triplets, swing, 1 or 2 bars, and velocity per step. Juice, which adds analog bump and noise. Six presets: Disco, Boom Bap, Rock, Deep House, Techno and Trance." },
  { q: 'Which DAWs does EasyDuck work in?', a: "Any DAW that loads VST3 or AU plugins, including Ableton Live, Logic Pro, FL Studio, Bitwig Studio, Cubase, Studio One and Reaper. Pro Tools needs AAX, which isn't supported." },
  { q: 'Is EasyDuck free?', a: "Yes. Enter your email and we'll send a license key and download links. No card needed." },
];

export const drumCrusherFaq = [
  { q: 'What does DrumCrusher do?', a: 'DrumCrusher is a parallel (New York) compressor for the drum bus. It splits your drums into high, mid and low bands, compresses each with its own amount, frequency and wet control, and blends the result with the dry drums. Five character modes (Tape, Tube, FET, VCA, Crush) set the color, and master Drive, Air and filters finish it.' },
  { q: 'How much is DrumCrusher?', a: '$29, a one-time purchase. Your license key and download links arrive by email right after checkout.' },
  { q: 'Which DAWs does DrumCrusher work in?', a: "Any DAW that loads VST3 or AU plugins, including Ableton Live, Logic Pro, FL Studio, Bitwig Studio, Cubase, Studio One and Reaper. Pro Tools needs AAX, which isn't supported." },
  { q: 'How many computers can I use it on?', a: `${process.env.LICENSE_MAX_ACTIVATIONS || 2} at a time. Free a computer from your account page when you switch machines.` },
  { q: 'Can I get a refund?', a: `Yes, within ${process.env.NEXT_PUBLIC_REFUND_DAYS || 14} days of purchase. See the refund policy for details.` },
];

export const modFxFaq = [
  { q: 'What does ModFX Pro do?', a: 'ModFX Pro is a performance FX board. You load up to 16 effects from a library of 45 into knob slots, then play them live with an XY pad that has process, drops and scratch modes. You can also play the XY pad from your phone: scan the QR code in the plugin and it opens in your phone browser.' },
  { q: 'How much is ModFX Pro?', a: '$29, a one-time purchase. Your license key and download links arrive by email right after checkout.' },
  { q: 'Which DAWs does ModFX Pro work in?', a: "Any DAW that loads VST3 or AU plugins, including Ableton Live, Logic Pro, FL Studio, Bitwig Studio, Cubase, Studio One and Reaper. Pro Tools needs AAX, which isn't supported." },
  { q: 'How many computers can I use it on?', a: `${process.env.LICENSE_MAX_ACTIVATIONS || 2} at a time. Free a computer from your account page when you switch machines.` },
  { q: 'Can I get a refund?', a: `Yes, within ${process.env.NEXT_PUBLIC_REFUND_DAYS || 14} days of purchase. See the refund policy for details.` },
];
