'use client';

// DrumCrusher concept interface, built from the Reaper Audio Tools plugin components.
// Visual only: it doesn't process audio.
import React from 'react';
import { PluginWindow } from './plugin/surfaces/PluginWindow.jsx';
import { GlobalBar } from './plugin/surfaces/GlobalBar.jsx';
import { Knob } from './plugin/knobs/Knob.jsx';
import { Fader } from './plugin/sliders/Fader.jsx';
import { Lcd } from './plugin/readouts/Lcd.jsx';
import { SoloMute } from './plugin/buttons/SoloMute.jsx';
import { DrumPad } from './plugin/sequencing/DrumPad.jsx';
import { LevelMeter } from './plugin/meters/LevelMeter.jsx';
import { ABCompare } from './plugin/browsing/ABCompare.jsx';
import { PresetSelector } from './plugin/browsing/PresetSelector.jsx';

const lab = { fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 13, letterSpacing: '0.3px', color: 'var(--text-primary)', alignSelf: 'flex-start' };
const cell = { background: 'var(--surface-panel)', borderRadius: 'var(--radius-panel)', boxShadow: 'var(--shadow-raised)', padding: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, boxSizing: 'border-box', minWidth: 0 };
const BANDS = [['LO', 'var(--param-red)', 'var(--pale-pink)'], ['MID', 'var(--param-orange)', 'var(--pale-yellow)'], ['HI', 'var(--param-cyan)', 'var(--pale-cyan)']];

function useTick(on, fps, fn) {
  const r = React.useRef(fn);
  r.current = fn;
  React.useEffect(() => {
    if (!on) return undefined;
    let raf; let last = 0;
    const loop = (t) => { if (t - last > 1000 / fps) { last = t; r.current(t / 1000); } raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [on, fps]);
}

export default function DrumCrusherDemo({ animate = true }) {
  const [gain, setGain] = React.useState([62, 50, 58]);
  const [lv, setLv] = React.useState([0.55, 0.52]);
  const kick = React.useRef(0);
  useTick(animate, 30, (t) => {
    if (Math.floor(t * 2.1) !== Math.floor((t - 1 / 30) * 2.1)) kick.current = 0.42;
    kick.current *= 0.86;
    const base = 0.42 + 0.06 * Math.sin(t * 3);
    setLv([Math.min(0.98, base + kick.current + Math.random() * 0.04), Math.min(0.98, base + kick.current * 0.95 + Math.random() * 0.04)]);
  });
  const hit = (a) => () => { kick.current = a; };
  const db = (v) => { const d = (v - 50) / 50 * 12; return (d > 0 ? '+' : '') + d.toFixed(1); };
  return (
    <PluginWindow name="DRUMCRUSHER" signature="cyan" width={1040} padding={28}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 150px) 1fr', gridTemplateRows: '150px 150px 250px 112px', gap: 18 }}>
        {BANDS.map(([n, c], i) => <div key={n} style={{ ...cell, gridColumn: i + 1, gridRow: 1 }}><div style={lab}>{n}</div><Knob size={96} color={c} value={gain[i]} onChange={(v) => setGain((g) => g.map((x, j) => (j === i ? v : x)))} ariaLabel={n + ' gain'} /></div>)}
        <div style={{ ...cell, gridColumn: 4, gridRow: 1 }}><div style={lab}>HPF</div><Knob variant="plain" size={96} defaultValue={12} ariaLabel="High-pass" /></div>
        <div style={{ ...cell, gridColumn: 5, gridRow: 1 }}><div style={lab}>JUICE</div><Knob variant="juice" size={96} defaultValue={40} ariaLabel="Juice amount" /></div>
        {BANDS.map(([n, c], i) => <div key={n} style={{ ...cell, gridColumn: i + 1, gridRow: 2 }}><div style={lab}>FREQ</div><Knob variant="fill" size={96} color={c} defaultValue={[30, 50, 70][i]} ariaLabel={n + ' frequency'} /></div>)}
        <div style={{ ...cell, gridColumn: 4, gridRow: 2 }}><div style={lab}>LPF</div><Knob variant="plain" size={96} defaultValue={88} ariaLabel="Low-pass" /></div>
        {BANDS.map(([n, c], i) => <div key={n} style={{ ...cell, gridColumn: i + 1, gridRow: 3 }}><div style={lab}>WET</div><Fader color={c} defaultValue={0.78} height={190} /></div>)}
        <div style={{ ...cell, gridColumn: 4, gridRow: '3 / 5', justifyContent: 'space-around', padding: 16 }}>
          {BANDS.map(([n, , p], i) => <DrumPad key={n} color={p} size={100} label={['KICK', 'SNARE', 'HAT'][i]} onTrigger={hit([0.5, 0.35, 0.2][i])} />)}
        </div>
        {BANDS.map(([n], i) => <div key={n} style={{ ...cell, gridColumn: i + 1, gridRow: 4, justifyContent: 'center', gap: 12 }}><Lcd size={16} minWidth={72}>{db(gain[i])}</Lcd><SoloMute size="sm" /></div>)}
        <div style={{ gridColumn: 5, gridRow: '2 / 5', display: 'flex', justifyContent: 'center' }}><Fader variant="master" label="OUT" defaultValue={0.82} height={400} /></div>
        <div style={{ ...cell, gridColumn: 6, gridRow: '1 / 5', padding: 12 }}><LevelMeter levels={lv} height={662} width={70} /></div>
      </div>
      <GlobalBar juice={false} style={{ marginTop: 24 }} left={<PresetSelector options={['Crushed Kit', 'Lo-Fi Breaks', 'Room Smash', 'Tight 808']} defaultValue={0} lcdWidth={150} />}>
        <ABCompare />
      </GlobalBar>
    </PluginWindow>
  );
}
