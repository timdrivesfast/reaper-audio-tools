'use client';

import React from 'react';

const STRONG_TONES = { indigo: true };
function toneAttrs(tone, style) {
  const s = { ...(style || {}) };
  if (tone && STRONG_TONES[tone]) s['--ratw-on'] = 'var(--on-strong)';
  return tone ? { 'data-signature': tone, style: s } : { style: s };
}
const onTone = (tone) => (tone && STRONG_TONES[tone] ? 'var(--on-strong)' : 'var(--on-color)');

/** Scrolling all-caps strip in a signature ticker colour: the suite motif, now on the web. */
export function Ticker({ items = ['EASYDUCK', 'REAPER AUDIO TOOLS'], tone, background, speed = 40, style }) {
  const run = (p) => { const out = []; for (let i = 0; i < 8; i++) items.forEach((t, j) => out.push(<span key={p + i + '-' + j}>{t} •</span>)); return out; };
  const a = toneAttrs(tone, { background: background || 'var(--accent-ticker)', color: 'var(--on-color)', ...style });
  return (
    <div className="ratw-ticker" aria-label={items.join(', ')} {...a}>
      <div className="ratw-ticker__track" style={{ '--ratw-tick-dur': speed + 's' }} aria-hidden="true">{run('a')}{run('b')}</div>
    </div>
  );
}

/** Pill button. strong = the one Buy/Checkout per view; color = in the product's signature; soft = raised neumorphic; ghost = text-only. */
export function Button({ children, variant = 'strong', size = 'md', tone, href, onClick, disabled, type = 'button', style }) {
  const cls = 'ratw-btn ratw-btn--' + variant + (size === 'lg' ? ' ratw-btn--lg' : '');
  const a = toneAttrs(tone, style);
  if (href) return <a className={cls} href={href} {...a}>{children}</a>;
  return <button type={type} className={cls} onClick={onClick} disabled={disabled} {...a}>{children}</button>;
}

const BADGE = { new: ['var(--pale-yellow)', 'NEW'], free: ['var(--pale-cyan)', 'FREE'], soon: ['var(--pale-lilac)', 'SOON'], cart: ['var(--pale-lime)', 'IN CART'], sale: ['var(--juice-red)', 'SALE'] };
/** Small all-caps status chip: NEW, FREE, SOON, IN CART on pale fills; SALE in Juice red. */
export function Badge({ kind = 'new', children, style }) {
  const [bg, text] = BADGE[kind] || BADGE.new;
  const sale = kind === 'sale';
  return <span className="ratw-badge" style={{ background: bg, color: sale ? 'var(--on-strong)' : 'var(--ink)', boxShadow: sale ? 'none' : undefined, ...style }}>{children || text}</span>;
}

/** Black LCD box with yellow mono digits, for every price, spec and number on the site. */
export function Lcd({ children, size = 'spec', small = false, style }) {
  return <span className={'ratw-lcd ratw-lcd--' + size + (small ? ' ratw-lcd--sm' : '')} style={style}>{children}</span>;
}

/** Price in an LCD, with an optional struck-through original price beside it. */
export function PriceTag({ price, was, small = false, note, style }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', ...style }}>
      <Lcd size="price" small={small}>{price}</Lcd>
      {was && <span className="ratw-was" aria-label={'was ' + was}>{was}</span>}
      {note && <span style={{ fontSize: 14, color: 'var(--ink-muted)' }}>{note}</span>}
    </span>
  );
}

/** Full-bleed section tinted in a signature colour (wash by default, full value for the one loud moment), with an optional ticker along its top edge. */
export function ColorBand({ tone = 'coral', variant = 'wash', ticker, padding = 'var(--space-9)', children, style }) {
  const full = variant === 'full';
  return (
    <section className="ratw ratw-band" {...toneAttrs(tone, { background: full ? 'var(--accent)' : 'var(--accent-wash)', color: full ? onTone(tone) : 'var(--ink)', ...style })}>
      {ticker && <Ticker items={ticker} tone={tone} />}
      <div className="ratw-band__inner" style={{ paddingTop: padding, paddingBottom: padding }}>{children}</div>
    </section>
  );
}

/** Eyebrow, title and lede that open a section. */
export function SectionHeading({ eyebrow, title, lede, align = 'left', color, style }) {
  return (
    <div style={{ display: 'grid', gap: 12, textAlign: align, justifyItems: align === 'center' ? 'center' : 'start', maxWidth: 720, marginInline: align === 'center' ? 'auto' : 0, ...style }}>
      {eyebrow && <div style={{ font: '700 12px/1.2 var(--font-ui)', letterSpacing: '1.5px', textTransform: 'uppercase', color: color || 'var(--ink-soft)' }}>{eyebrow}</div>}
      <h2 style={{ margin: 0, font: '700 40px/1.05 var(--font-ui)', letterSpacing: '-1px', textWrap: 'balance', color: color || 'var(--ink)' }}>{title}</h2>
      {lede && <p style={{ margin: 0, font: '400 20px/1.5 var(--font-ui)', color: color || 'var(--ink-soft)', maxWidth: '58ch' }}>{lede}</p>}
    </div>
  );
}

/** Catalogue card for one plugin, grounded in its signature wash. No ticker: the ticker runs once per page, along the top edge. */
export function ProductCard({ name, tone = 'coral', tagline, image, imageAlt = '', formats = 'VST3 · AU · AUv3', price, was, badge, status = 'available', onBuy, href, style }) {
  const soon = status === 'soon';
  return (
    <article className="ratw ratw-card ratw-card--hover ratw-product" {...toneAttrs(tone, style)}>
      {image ? <img className="ratw-product__media" src={image} alt={imageAlt} /> : <div className="ratw-product__media ratw-screen" style={{ borderRadius: 0 }} aria-hidden="true"></div>}
      <div className="ratw-product__body">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <h3 style={{ margin: 0, font: '700 28px/1.05 var(--font-ui)', letterSpacing: '-.6px' }}>{name}</h3>
          {badge && <Badge kind={badge} />}
          {soon && !badge && <Badge kind="soon" />}
        </div>
        {tagline && <p style={{ margin: 0, fontSize: 17, lineHeight: 1.5, color: 'var(--ink-soft)' }}>{tagline}</p>}
        <div><Lcd>{formats}</Lcd></div>
        <div className="ratw-product__foot">
          {soon ? <span style={{ fontSize: 14, color: 'var(--ink-muted)' }}>Join the waitlist</span> : <PriceTag price={price} was={was} small />}
          <Button variant={soon ? 'soft' : 'color'} tone={tone} href={href} onClick={onBuy}>{soon ? 'Notify me' : 'Add to cart'}</Button>
        </div>
      </div>
    </article>
  );
}

/** The opening block of a product page, built like the plugin window: its ticker edge to edge, the Soft Studio ground, the pitch on the left and the plugin itself in a raised panel on the right. */
export function ProductHero({ name, tone = 'coral', eyebrow, tagline, price, was, formats = 'VST3 · AU · AUv3', media, primaryLabel = 'Add to cart', secondaryLabel = 'Try free for 14 days', onPrimary, onSecondary, style }) {
  return (
    <section className="ratw" {...toneAttrs(tone, { background: 'var(--page)', ...style })}>
      <Ticker items={[name.toUpperCase(), 'REAPER AUDIO TOOLS']} tone={tone} />
      <div className="ratw-band__inner" style={{ paddingTop: 'var(--space-8)', paddingBottom: 'var(--space-9)', display: 'flex', flexWrap: 'wrap', gap: 'var(--space-7)', alignItems: 'center' }}>
        <div style={{ flex: '1 1 320px', minWidth: 0, display: 'grid', gap: 20, alignContent: 'start' }}>
          {eyebrow && <div style={{ display: 'flex', alignItems: 'center', gap: 10, font: '700 12px/1.2 var(--font-ui)', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--ink-soft)' }}><span aria-hidden="true" style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 0 4px var(--accent-wash)' }}></span>{eyebrow}</div>}
          <h1 style={{ margin: 0, font: '700 clamp(40px, 7vw, 60px)/.95 var(--font-ui)', letterSpacing: '-1.8px' }}>{name}</h1>
          {tagline && <p style={{ margin: 0, font: '400 20px/1.5 var(--font-ui)', color: 'var(--ink-soft)', maxWidth: '40ch' }}>{tagline}</p>}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}><PriceTag price={price} was={was} /><Lcd>{formats}</Lcd></div>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <Button variant="color" tone={tone} size="lg" onClick={onPrimary}>{primaryLabel}</Button>
            <Button variant="soft" size="lg" onClick={onSecondary}>{secondaryLabel}</Button>
          </div>
        </div>
        {media && (
          <div style={{ flex: '1 1 460px', minWidth: 0, padding: 'var(--space-4)', borderRadius: 'var(--radius-block)', background: 'var(--surface)', boxShadow: 'var(--shadow-card)' }}>
            <div style={{ borderRadius: 'var(--radius-card)', overflow: 'hidden', background: 'var(--accent-wash)' }}>{media}</div>
          </div>
        )}
      </div>
    </section>
  );
}

function seeded(seed) { let s = seed; return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; }; }
/** Before/after audio demo on the navy screen: play button, DRY/WET toggle and a waveform that reacts. */
export function AudioDemo({ title = 'House loop', tone = 'coral', drySrc, wetSrc, bars = 72, seed = 7, style }) {
  const [playing, setPlaying] = React.useState(false);
  const [wet, setWet] = React.useState(true);
  const [t, setT] = React.useState(0);
  const audio = React.useRef(null);
  const heights = React.useMemo(() => { const r = seeded(seed); return Array.from({ length: bars }, (_, i) => 0.25 + r() * 0.75 * (i % 8 === 0 ? 1 : 0.7)); }, [bars, seed]);
  React.useEffect(() => {
    if (!playing) return undefined;
    let raf; const start = performance.now() - t * 4000;
    const tick = (now) => { setT(((now - start) / 4000) % 1); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);
  React.useEffect(() => {
    const src = wet ? wetSrc : drySrc;
    if (!src) return undefined;
    if (!audio.current) audio.current = new Audio();
    const a = audio.current; const pos = a.currentTime || 0;
    a.src = src; a.loop = true; a.currentTime = pos;
    if (playing) a.play().catch(() => setPlaying(false)); else a.pause();
    return undefined;
  }, [wet, playing, drySrc, wetSrc]);
  React.useEffect(() => () => { if (audio.current) audio.current.pause(); }, []);
  const W = 600, H = 150, bw = W / bars;
  return (
    <div className="ratw ratw-card" {...toneAttrs(tone, { padding: 'var(--space-5)', display: 'grid', gap: 'var(--space-4)', ...style })}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
        <button type="button" aria-label={playing ? 'Pause' : 'Play'} onClick={() => setPlaying(!playing)} style={{ width: 52, height: 52, flex: 'none', borderRadius: '50%', border: 0, cursor: 'pointer', background: 'var(--surface)', boxShadow: playing ? 'var(--shadow-inset)' : 'var(--shadow-raised)', display: 'grid', placeItems: 'center' }}>
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">{playing ? <rect x="4" y="4" width="10" height="10" rx="2" fill="var(--accent)"></rect> : <path d="M5 3 L15 9 L5 15 Z" fill="var(--play)"></path>}</svg>
        </button>
        <div style={{ flex: 1, minWidth: 120 }}>
          <div style={{ font: '600 17px/1.3 var(--font-ui)' }}>{title}</div>
          <div style={{ fontSize: 14, color: 'var(--ink-muted)' }}>{wet ? 'With the plugin' : 'Without the plugin'}</div>
        </div>
        <div className="ratw-toggle" role="group" aria-label="Compare">
          <button type="button" aria-pressed={!wet} onClick={() => setWet(false)}>DRY</button>
          <button type="button" aria-pressed={wet} onClick={() => setWet(true)}>WET</button>
        </div>
      </div>
      <div className="ratw-screen" style={{ aspectRatio: W + ' / ' + H, maxWidth: '100%' }}>
        <svg viewBox={'0 0 ' + W + ' ' + H} preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} aria-hidden="true">
          <line x1="0" y1={H / 2} x2={W} y2={H / 2} stroke="rgba(255,255,255,.16)" strokeWidth="1"></line>
          {heights.map((h, i) => {
            const beat = i % 8;
            const duck = wet ? (beat === 0 ? 0.25 : Math.min(1, 0.25 + beat * 0.16)) : 1;
            const v = h * duck * (H * 0.42);
            const past = i / bars <= t && (playing || t > 0);
            return <rect key={i} x={i * bw + bw * 0.2} y={H / 2 - v} width={bw * 0.6} height={v * 2} rx={bw * 0.3} fill="var(--screen-signal)" opacity={past ? 1 : 0.45}></rect>;
          })}
          {(playing || t > 0) && <rect x={t * W} y="0" width="2" height={H} fill="var(--screen-trace)"></rect>}
        </svg>
      </div>
    </div>
  );
}

/** Tinted tile with one number in an LCD and a short explanation: the web version of a knob cell. */
export function FeatureTile({ tone = 'cyan', stat, title, children, style }) {
  return (
    <div className="ratw ratw-card" {...toneAttrs(tone, { background: 'var(--accent-wash)', padding: 'var(--space-5)', display: 'grid', gap: 12, alignContent: 'start', ...style })}>
      {stat && <div><Lcd size="price" small>{stat}</Lcd></div>}
      <h3 style={{ margin: 0, font: '600 22px/1.2 var(--font-ui)', letterSpacing: '-.3px' }}>{title}</h3>
      {children && <p style={{ margin: 0, fontSize: 17, lineHeight: 1.55, color: 'var(--ink-soft)' }}>{children}</p>}
    </div>
  );
}

/** A bundle offer: each plugin with its own price, the separate total struck through, and the bundle price. */
export function BundleCard({ title = 'Everything bundle', items = [], price, tone = 'lilac', onBuy, style }) {
  const total = items.reduce((s, it) => s + (Number(String(it.price).replace(/[^0-9.]/g, '')) || 0), 0);
  return (
    <div className="ratw ratw-card" {...toneAttrs(tone, { padding: 'var(--space-6)', display: 'grid', gap: 'var(--space-5)', ...style })}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <h3 style={{ margin: 0, font: '700 28px/1.05 var(--font-ui)', letterSpacing: '-.6px' }}>{title}</h3>
        <Badge kind="sale">SAVE ${Math.max(0, Math.round(total - Number(String(price).replace(/[^0-9.]/g, ''))))}</Badge>
      </div>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 10 }}>
        {items.map((it) => (
          <li key={it.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 14, background: 'var(--surface-sunk)', boxShadow: 'var(--shadow-inset)' }}>
            <span aria-hidden="true" style={{ width: 14, height: 14, borderRadius: '50%', background: 'var(--' + (it.tone || 'coral') + ')', flex: 'none' }}></span>
            <span style={{ flex: 1, fontWeight: 600 }}>{it.name}</span>
            <span className="ratw-was" style={{ textDecoration: 'none', color: 'var(--ink-muted)' }}>{it.price}</span>
          </li>
        ))}
      </ul>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <PriceTag price={price} was={'$' + total} />
        <Button variant="color" tone={tone} onClick={onBuy}>Get the bundle</Button>
      </div>
    </div>
  );
}

/** A credited quote from a producer or engineer. */
export function Testimonial({ quote, name, credit, avatar, tone = 'coral', style }) {
  return (
    <figure className="ratw ratw-card" {...toneAttrs(tone, { margin: 0, padding: 'var(--space-6)', display: 'grid', gap: 'var(--space-5)', ...style })}>
      <blockquote style={{ margin: 0, font: '600 22px/1.35 var(--font-ui)', letterSpacing: '-.3px', textWrap: 'pretty' }}>{quote}</blockquote>
      <figcaption style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {avatar ? <img src={avatar} alt="" width="44" height="44" style={{ borderRadius: '50%', objectFit: 'cover', background: 'var(--accent-wash)' }} /> : <span aria-hidden="true" style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--accent)', flex: 'none' }}></span>}
        <span style={{ display: 'grid' }}><span style={{ fontWeight: 600 }}>{name}</span>{credit && <span style={{ fontSize: 14, color: 'var(--ink-muted)' }}>{credit}</span>}</span>
      </figcaption>
    </figure>
  );
}

/** Email signup in an inset well with a strong button. The consumer handles the submit. */
export function EmailCapture({ title = 'Get Juice free', lede, button = 'Send it', placeholder = 'you@studio.com', doneLabel = 'ON THE LIST', doneText = "You'll get one email when it ships.", onSubmit, done, style }) {
  const [email, setEmail] = React.useState('');
  const [state, setState] = React.useState('idle');
  const isDone = done !== undefined ? done : state === 'done';
  const submit = async (e) => {
    e.preventDefault();
    if (!/.+@.+\..+/.test(email) || state === 'sending') return;
    setState('sending');
    try { if (onSubmit) await onSubmit(email); setState('done'); } catch (err) { setState('error'); }
  };
  return (
    <form className="ratw ratw-card" onSubmit={submit} style={{ padding: 'var(--space-6)', display: 'grid', gap: 'var(--space-4)', ...style }}>
      <h3 style={{ margin: 0, font: '700 28px/1.1 var(--font-ui)', letterSpacing: '-.6px' }}>{title}</h3>
      {lede && <p style={{ margin: 0, fontSize: 17, lineHeight: 1.55, color: 'var(--ink-soft)' }}>{lede}</p>}
      {isDone ? <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}><Badge kind="cart">{doneLabel}</Badge><span style={{ color: 'var(--ink-soft)' }}>{doneText}</span></div> : (
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <label htmlFor="ratw-email" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>Email</label>
          <input id="ratw-email" name="email" autoComplete="email" className="ratw-input" type="email" required placeholder={placeholder} value={email} onChange={(e) => setEmail(e.target.value)} style={{ flexBasis: 220 }} />
          <Button type="submit" variant="strong" disabled={state === 'sending'}>{state === 'sending' ? 'Sending' : button}</Button>
        </div>
      )}
      {state === 'error' && <p role="alert" style={{ margin: 0, fontSize: 14, color: 'var(--ink-soft)' }}>That didn't go through. Try again in a minute.</p>}
    </form>
  );
}

/** One expandable question and answer. */
export function FaqItem({ question, children, defaultOpen = false, style }) {
  return (
    <details className="ratw ratw-card ratw-faq" open={defaultOpen} style={style}>
      <summary>{question}<span className="ratw-faq__sign" aria-hidden="true">+</span></summary>
      <div style={{ padding: '0 var(--space-5) var(--space-5)', fontSize: 17, lineHeight: 1.6, color: 'var(--ink-soft)', maxWidth: '65ch' }}>{children}</div>
    </details>
  );
}

const asLink = (l) => (typeof l === 'string' ? { label: l, href: '#' } : l);

/** Site header: the ticker on top, then the name, nav links and an optional action on a raised bar. */
export function SiteHeader({ tone = 'coral', ticker = ['EASYDUCK', 'REAPER AUDIO TOOLS'], links = [], action, logo, homeHref = '/', style }) {
  return (
    <header className="ratw" {...toneAttrs(tone, style)}>
      <Ticker items={ticker} tone={tone} />
      <div style={{ background: 'var(--surface)', boxShadow: 'var(--shadow-card)', position: 'relative' }}>
        <div className="ratw-band__inner" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', minHeight: 72, flexWrap: 'wrap', paddingTop: 10, paddingBottom: 10 }}>
          <a href={homeHref} style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'var(--ink)' }}>
            {logo ? <img src={logo} alt="" width="40" height="40" style={{ borderRadius: 10 }} /> : null}
            <span style={{ font: '700 20px/1 var(--font-ui)', letterSpacing: '-.4px' }}>Reaper Audio Tools</span>
          </a>
          <nav aria-label="Main" style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginLeft: 'auto' }}>
            {links.map(asLink).map((l) => <a key={l.label} href={l.href} className="ratw-btn ratw-btn--ghost" style={{ height: 40 }}>{l.label}</a>)}
          </nav>
          {action}
        </div>
      </div>
    </header>
  );
}

/** Site footer on the dark navy screen: link columns, a note and the ticker closing the page. */
export function SiteFooter({ columns = [], note = 'Reaper Audio Tools.', tone = 'coral', fine, style }) {
  return (
    <footer className="ratw ratw-screen" {...toneAttrs(tone, { borderRadius: 0, color: 'var(--on-strong)', ...style })}>
      <div className="ratw-band__inner" style={{ paddingTop: 'var(--space-8)', paddingBottom: 'var(--space-8)', display: 'flex', flexWrap: 'wrap', gap: 'var(--space-7)' }}>
        <p style={{ margin: 0, flex: '1 1 260px', font: '600 20px/1.35 var(--font-ui)', maxWidth: '30ch' }}>{note}</p>
        {columns.map((c) => (
          <div key={c.title} style={{ display: 'grid', gap: 10, alignContent: 'start', minWidth: 140 }}>
            <div style={{ font: '700 12px/1 var(--font-ui)', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--screen-signal)' }}>{c.title}</div>
            {c.links.map(asLink).map((l) => <a key={l.label} href={l.href} style={{ color: 'var(--on-strong)', textDecoration: 'none', fontSize: 16 }}>{l.label}</a>)}
          </div>
        ))}
      </div>
      {fine && <div className="ratw-band__inner" style={{ paddingBottom: 'var(--space-6)', fontSize: 13, color: 'var(--on-strong)', opacity: 0.75 }}>{fine}</div>}
    </footer>
  );
}

/** Raised Soft Studio panel with a sentence-case title and an optional control on the right: the plugin Panel, sized for the web. Use it to frame specs, a live plugin or a group of tiles. */
export function Panel({ title, headerRight, tone, tinted = false, children, style }) {
  return (
    <section className="ratw ratw-card" {...toneAttrs(tone, { background: tinted ? 'var(--accent-wash)' : 'var(--surface)', padding: 'var(--space-5)', display: 'grid', gap: 'var(--space-4)', minWidth: 0, ...style })}>
      {(title || headerRight) && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', minHeight: 36 }}>
          {title && <h3 style={{ margin: 0, font: '600 22px/1.2 var(--font-ui)', letterSpacing: '-.4px' }}>{title}</h3>}
          {headerRight}
        </div>
      )}
      {children}
    </section>
  );
}
