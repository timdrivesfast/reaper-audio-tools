import { FaqItem, SectionHeading } from './web';

/** FAQ list plus FAQPage structured data, so search engines and AI assistants can read the answers. */
export default function Faq({ items, id = 'faq' }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
  return (
    <>
      <section id={id} className="wrap section split" style={{ scrollMarginTop: 24 }}>
        <SectionHeading eyebrow="Support" title="FAQ" />
        <div>
          {items.map((f, i) => <FaqItem key={f.q} question={f.q} defaultOpen={i === 0}>{f.a}</FaqItem>)}
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
    </>
  );
}
