'use client';

// The real EasyDuck interface, built from the Reaper Audio Tools plugin components.
// Visual only: it doesn't process audio.
import React from 'react';
import { PluginWindow } from './plugin/surfaces/PluginWindow.jsx';
import { Panel } from './plugin/surfaces/Panel.jsx';
import { GlobalBar } from './plugin/surfaces/GlobalBar.jsx';
import { PresetSelector } from './plugin/browsing/PresetSelector.jsx';
import { EnvelopeEditor } from './plugin/displays/EnvelopeEditor.jsx';
import { KnobCell } from './plugin/knobs/KnobCell.jsx';
import { Knob } from './plugin/knobs/Knob.jsx';
import { Switch } from './plugin/buttons/Switch.jsx';
import { PillGroup } from './plugin/buttons/PillGroup.jsx';
import { Pill } from './plugin/buttons/Pill.jsx';
import { TransportButton } from './plugin/buttons/TransportButton.jsx';
import { StepGrid } from './plugin/sequencing/StepGrid.jsx';
import { HSlider } from './plugin/sliders/HSlider.jsx';
import { Lcd } from './plugin/readouts/Lcd.jsx';
import { SettingsButton } from './plugin/buttons/SettingsButton.jsx';

const PRESETS = { 'Disco': [8, 320, 40, 70], 'Boom Bap': [22, 180, 90, 58], 'Rock': [16, 120, 30, 42], 'Deep House': [12, 220, 60, 80], 'Techno': [5, 150, 120, 95], 'Trance': [10, 280, 80, 88] };
const NAMES = Object.keys(PRESETS);
const BPM = 115;
const lab = { fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 13, letterSpacing: '0.3px', color: 'var(--text-primary)' };
const sm = { fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--text-primary)' };
const title = { font: '600 16px/1 var(--font-ui)', letterSpacing: '-0.4px', color: 'var(--text-primary)' };
// Paint splatter on each knob card (like DrumCrusher): one seeded field per card, in that parameter's colour.
const SW = 82, SH = 132;
const rng = (seed) => { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); };
function splat(seed) {
  const r = rng(seed), u = (a, b) => a + (b - a) * r(), out = [];
  const blob = (cx, cy, R, a) => {
    const n = 14 + Math.floor(r() * 8), pts = [];
    for (let k = 0; k < n; k++) { const t = (k / n) * Math.PI * 2, rr = R * (r() < 0.22 ? u(1.3, 1.9) : u(0.75, 1.1)); pts.push([cx + Math.cos(t) * rr, cy + Math.sin(t) * rr]); }
    let d = 'M' + ((pts[n - 1][0] + pts[0][0]) / 2).toFixed(1) + ' ' + ((pts[n - 1][1] + pts[0][1]) / 2).toFixed(1);
    for (let k = 0; k < n; k++) { const p = pts[k], q = pts[(k + 1) % n]; d += 'Q' + p[0].toFixed(1) + ' ' + p[1].toFixed(1) + ' ' + ((p[0] + q[0]) / 2).toFixed(1) + ' ' + ((p[1] + q[1]) / 2).toFixed(1); }
    out.push({ d, a });
  };
  const clusters = 6 + Math.floor(r() * 3);
  for (let c = 0; c < clusters; c++) {
    const cx = u(8, SW - 8), cy = u(8, SH - 8), R = u(2, 4.2), a = u(0.75, 0.95);
    blob(cx, cy, R, a);
    const drops = 10 + Math.floor(r() * 12);
    for (let i = 0; i < drops; i++) {
      const t = u(0, Math.PI * 2), dist = R * u(1.4, 6) * (r() < 0.3 ? 1.8 : 1), sz = Math.max(0.45, R * 0.34 * (1 - dist / (R * 11)) * u(0.4, 1));
      const x = cx + Math.cos(t) * dist, y = cy + Math.sin(t) * dist;
      out.push(r() < 0.3 ? { e: [x, y, sz * u(1.8, 3), sz * 0.7, (t * 180) / Math.PI], a: a * u(0.8, 1.1) } : { c: [x, y, sz], a: a * u(0.7, 1.1) });
    }
  }
  for (let i = 0; i < 90; i++) out.push({ c: [u(0, SW), u(0, SH), u(0.45, 1.1)], a: u(0.6, 0.9) });
  return out;
}
const SPLATS = [splat(19), splat(71), splat(143), splat(211)];
function Splatter({ color, i }) {
  return (
    <svg viewBox={'0 0 ' + SW + ' ' + SH} preserveAspectRatio="xMidYMid slice" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: -1, pointerEvents: 'none' }}>
      {SPLATS[i].map((s, k) => { const f = { fill: 'color-mix(in oklch, ' + color + ' 88%, #000)', fillOpacity: Math.min(1, s.a) };
        return s.d ? <path key={k} d={s.d} style={f} /> : s.e ? <ellipse key={k} cx={s.e[0]} cy={s.e[1]} rx={s.e[2]} ry={s.e[3]} transform={'rotate(' + s.e[4].toFixed(1) + ' ' + s.e[0].toFixed(1) + ' ' + s.e[1].toFixed(1) + ')'} style={f} /> : <circle key={k} cx={s.c[0]} cy={s.c[1]} r={s.c[2]} style={f} />; })}
    </svg>
  );
}
const SplatCell = ({ i, ...p }) => (
  <div style={{ position: 'relative', isolation: 'isolate', overflow: 'hidden', background: 'var(--surface-panel)', borderRadius: 'var(--radius-panel)', boxShadow: 'var(--shadow-raised)', padding: '10px 0 12px', width: 82, boxSizing: 'border-box', flex: 'none' }}>
    <Splatter color={p.color} i={i} />
    <KnobCell card={false} {...p} />
  </div>
);


function makePattern(total, perBeat) {
  const pb = Math.round(perBeat);
  return Array.from({ length: total }, (_, i) => (Math.abs(perBeat - pb) < 0.01 && i % pb === 0 ? 100 : 0));
}

export default function EasyDuckDemo({ autoplay = false }) {
  const [preset, setPreset] = React.useState(3);
  const [env, setEnv] = React.useState({ attack: 12, decay: 220, length: 60, depth: 80 });
  const [denom, setDenom] = React.useState(2);
  const [trip, setTrip] = React.useState(false);
  const [bars, setBars] = React.useState(0);
  const [swing, setSwing] = React.useState(0);
  const perBeat = [1, 2, 4][denom] * (trip ? 1.5 : 1);
  const perBar = Math.round(perBeat * 4);
  const total = perBar * (bars + 1);
  const [steps, setSteps] = React.useState(() => makePattern(16, 4));
  const [sel, setSel] = React.useState(8);
  const [playing, setPlaying] = React.useState(autoplay);
  const [step, setStep] = React.useState(-1);
  const first = React.useRef(true);

  React.useEffect(() => {
    if (first.current) { first.current = false; return; }
    setSteps(makePattern(total, perBeat));
    setSel(-1);
  }, [total, perBeat]);

  React.useEffect(() => {
    if (!playing) { setStep(-1); return undefined; }
    const t = setInterval(() => setStep((s) => (s + 1) % total), 60000 / BPM / perBeat);
    return () => clearInterval(t);
  }, [playing, total, perBeat]);

  const applyPreset = (i) => { setPreset(i); const [a, d, l, p] = PRESETS[NAMES[i]]; setEnv({ attack: a, decay: d, length: l, depth: p }); };
  const setE = (k) => (v) => setEnv((e) => ({ ...e, [k]: v }));
  const hasSel = sel >= 0 && steps[sel] > 0;
  const [fire, setFire] = React.useState(0);
  const [held, setHeld] = React.useState(false);
  const fireT = React.useRef(null);
  const dur = Math.max(250, env.attack + env.length + env.decay);
  const trigger = () => { setFire((n) => n + 1); clearTimeout(fireT.current); fireT.current = setTimeout(() => setFire(0), dur); };
  React.useEffect(() => () => clearTimeout(fireT.current), []);

  return (
    <>
    <style>{'@keyframes ed-sweep{from{left:0}to{left:100%}}'}</style>
    <PluginWindow name="EASYDUCK" signature="coral" tickerRight={<SettingsButton />} width={1040} padding="28px 30px">
      <div style={{ display: 'flex', gap: 34, alignItems: 'stretch' }}>
        <div style={{ width: 382, flex: 'none', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Panel title={<span style={title}>Trigger</span>} gap={12} headerRight={<PresetSelector options={NAMES} value={preset} onChange={applyPreset} />}>
            <div style={{ position: 'relative' }}>
              <EnvelopeEditor height={183} preset={NAMES[preset]} {...env} onChange={(n) => setEnv(n)} />
              {fire > 0 && <div key={fire} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: 8, overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, bottom: 0, width: 2, background: 'var(--accent)', boxShadow: '0 0 10px var(--accent)', animation: 'ed-sweep ' + dur + 'ms linear forwards' }}></div>
              </div>}
            </div>
          </Panel>
          <div style={{ display: 'flex', gap: 18 }}>
            <SplatCell i={0} label="ATTACK" color="var(--param-cyan)" min={1} max={150} value={env.attack} unit=" ms" onChange={setE('attack')} />
            <SplatCell i={1} label="DECAY" color="var(--param-indigo)" min={20} max={600} value={env.decay} unit=" ms" onChange={setE('decay')} />
            <SplatCell i={2} label="LENGTH" color="var(--param-orange)" tickColor="var(--param-orange-tick)" min={0} max={300} value={env.length} unit=" ms" onChange={setE('length')} />
            <SplatCell i={3} label="DEPTH" color="var(--param-red)" min={0} max={100} value={env.depth} unit=" %" onChange={setE('depth')} />
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 35 }}>
          <Panel title={<span style={title}>Pattern</span>} style={{ flex: 1 }} headerRight={<><span style={{ ...lab, marginRight: 6 }}>BARS</span><Switch options={['1', '2']} value={bars} onChange={setBars} /></>}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <PillGroup options={['1/4', '1/8', '1/16']} value={denom} onChange={setDenom} />
              <Pill on={trip} onColor="var(--pale-yellow)" padX={14} onClick={() => setTrip(!trip)}>TRIPLET</Pill>
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={lab}>SWING</span>
                <Knob variant="dot" color="var(--param-indigo)" value={swing} onChange={setSwing} ariaLabel="Swing" />
                <span style={{ fontFamily: 'var(--font-lcd)', fontSize: 12, color: 'var(--text-value)', width: 24 }}>{Math.round(swing)}</span>
              </div>
            </div>
            <StepGrid steps={steps} selected={sel} onChange={setSteps} onSelect={setSel} stepsPerBeat={perBeat} stepsPerBar={perBar} swing={swing} playStep={step} height={150} />
            <div style={{ opacity: hasSel ? 1 : 0.12, transform: hasSel ? 'none' : 'translateY(-5px)', transition: 'all var(--dur-base)', pointerEvents: hasSel ? 'auto' : 'none' }}>
              <HSlider label="VELOCITY" accentLabel min={1} max={100} value={hasSel ? steps[sel] : 100} onChange={(v) => setSteps((s) => s.map((x, i) => (i === sel ? v : x)))} />
            </div>
          </Panel>
          <GlobalBar ring left={<div onPointerDown={() => { setHeld(true); trigger(); }} onPointerUp={() => setHeld(false)} onPointerLeave={() => setHeld(false)}><Pill on={held} onColor="var(--accent-soft)" padX={14} title="Fire the trigger once">FIRE</Pill></div>}>
            <TransportButton playing={playing} onToggle={setPlaying} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span style={sm}>BPM</span><Lcd size={16} tracking="1px" minWidth={60}>{BPM.toFixed(1)}</Lcd></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span style={sm}>SIG</span><Lcd size={16} tracking="1px">4/4</Lcd></div>
          </GlobalBar>
        </div>
      </div>
    </PluginWindow>
    </>
  );
}
