'use client';

import React from 'react';

/** Accordion FAQ. The first answer starts open. Also emits FAQPage schema. */
export default function Faq({ items, title = 'FAQ', id = 'faq' }) {
  const [open, setOpen] = React.useState(0);
  const schema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) };
  return (
    <section id={id} className="v-wrap v-section" style={{ paddingBottom: 'var(--v-section)', scrollMarginTop: 90 }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="v-faq">
        <h2 className="v-h2">{title}</h2>
        <div className="v-faq__list">
          {items.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className="v-faq__item" data-open={isOpen}>
                <button type="button" className="v-faq__q" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? -1 : i)}>
                  <span>{f.q}</span><span className="v-faq__sign" aria-hidden="true">{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen && <p className="v-faq__a">{f.a}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
