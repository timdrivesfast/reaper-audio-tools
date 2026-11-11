/** ModFX Pro: the phone companion. Real screens from the companion web app and the plugin's QR menu. */
const SCREENS = [
  { src: '/images/v2/modfx-phone-drops.webp', alt: 'Phone showing the ModFX Pro XY pad in Drops mode, White Noise Sweep' },
  { src: '/images/v2/modfx-phone-process.webp', alt: 'Phone showing the ModFX Pro XY pad in Process mode, Filter Sweep' },
  { src: '/images/v2/modfx-phone-scratch.webp', alt: 'Phone showing the ModFX Pro XY pad in Scratch mode, Vinyl Scratch' },
];
const STEPS = [
  ['Turn it on', 'In ModFX Pro, open Settings (the gear) and switch Phone companion on. A QR code appears.'],
  ['Scan it', 'Point your phone camera at the code. The XY pad opens in your phone browser. No app to install, no account.'],
  ['Play', 'Process, Drops and Scratch, the effect picker and the four knobs, all synced with the plugin both ways. Moves record as automation.'],
];

export function Phone({ src, alt, style, className = '' }) {
  return <div className={`v-phone ${className}`} style={style}><img src={src} alt={alt} loading="lazy" /></div>;
}

export default function PhoneCompanion() {
  return (
    <section id="phone" className="v-dark v-section v-phonesec" style={{ paddingBottom: 'var(--v-section)', marginTop: 0 }}>
      <div className="v-wrap" style={{ display: 'grid', gap: 'clamp(36px, 5vw, 64px)' }}>
        <div style={{ display: 'grid', gap: 14, maxWidth: 680 }}>
          <div className="v-eyebrow">Phone companion</div>
          <h2 className="v-h2">Play the XY pad from your phone</h2>
          <p className="v-body" style={{ fontSize: 18 }}>Scan the QR code in ModFX Pro and the XY pad opens on your phone. Move away from the mouse and play your effects with your hands.</p>
        </div>
        <div className="v-phones">
          {SCREENS.map((s, i) => <Phone key={s.src} {...s} className={i === 1 ? 'v-phone--front' : ''} />)}
        </div>
        <div className="v-grid2" style={{ alignItems: 'center', gap: 'clamp(32px, 5vw, 72px)' }}>
          <ol className="v-steps">
            {STEPS.map(([t, b], i) => (
              <li key={t}><span className="v-steps__n">{i + 1}</span><div><h3>{t}</h3><p className="v-body">{b}</p></div></li>
            ))}
          </ol>
          <div style={{ display: 'grid', gap: 14, justifyItems: 'center' }}>
            <img className="v-qrmenu" src="/images/v2/modfx-qr-menu.webp" alt="ModFX Pro settings menu with Phone companion on and its QR code" loading="lazy" />
            <p className="v-fine" style={{ color: '#9AA3B8', textAlign: 'center', maxWidth: 360 }}>Phone and computer on the same Wi-Fi. Nothing leaves your network. Works in Logic, Ableton Live, FL Studio, Reaper and other hosts.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
