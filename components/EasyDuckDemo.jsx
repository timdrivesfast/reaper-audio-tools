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

const PRESETS = { 'Disco': [8, 320, 40, 70], 'Boom Bap': [22, 180, 90, 58], 'Rock': [16, 120, 30, 42], 'Deep House': [12, 220, 60, 80], 'Techno': [5, 150, 120, 95], 'Trance': [10, 280, 80, 88] };
const NAMES = Object.keys(PRESETS);
const BPM = 115;
const lab = { fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: 13, letterSpacing: '0.3px', color: 'var(--text-primary)' };
const sm = { fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--text-primary)' };
const title = { font: '600 16px/1 var(--font-ui)', letterSpacing: '-0.4px', color: 'var(--text-primary)' };
const FACES = { off: '/images/juice-off.png', on: '/images/juice-on.png' };

function makePattern(total, perBeat) {
  const pb = Math.round(perBeat);
  return Array.from({ length: total }, (_, i) => (Math.abs(perBeat - pb) < 0.01 && i % pb === 0 ? 100 : 0));
}

export default function EasyDuckDemo() {
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
  const [playing, setPlaying] = React.useState(false);
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

  return (
    <PluginWindow name="EASYDUCK" signature="coral" width={1040} padding="28px 30px">
      <div style={{ display: 'flex', gap: 34, alignItems: 'stretch' }}>
        <div style={{ width: 382, flex: 'none', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Panel title={<span style={title}>Trigger</span>} gap={12} headerRight={<PresetSelector options={NAMES} value={preset} onChange={applyPreset} />}>
            <EnvelopeEditor height={183} preset={NAMES[preset]} {...env} onChange={(n) => setEnv(n)} />
          </Panel>
          <div style={{ display: 'flex', gap: 18 }}>
            <KnobCell label="ATTACK" color="var(--param-cyan)" min={1} max={150} value={env.attack} unit=" ms" onChange={setE('attack')} />
            <KnobCell label="DECAY" color="var(--param-indigo)" tint={0.06} min={20} max={600} value={env.decay} unit=" ms" onChange={setE('decay')} />
            <KnobCell label="LENGTH" color="var(--param-orange)" tickColor="var(--param-orange-tick)" min={0} max={300} value={env.length} unit=" ms" onChange={setE('length')} />
            <KnobCell label="DEPTH" color="var(--param-red)" tint={0.06} min={0} max={100} value={env.depth} unit=" %" onChange={setE('depth')} />
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
          <GlobalBar faces={FACES}>
            <TransportButton playing={playing} onToggle={setPlaying} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span style={sm}>BPM</span><Lcd size={16} tracking="1px" minWidth={60}>{BPM.toFixed(1)}</Lcd></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span style={sm}>SIG</span><Lcd size={16} tracking="1px">4/4</Lcd></div>
          </GlobalBar>
        </div>
      </div>
    </PluginWindow>
  );
}
