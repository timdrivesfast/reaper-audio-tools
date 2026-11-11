import { site } from '../lib/site';

// Search engines and AI assistants (ChatGPT, Claude, Perplexity, Gemini, Copilot, Apple) are
// welcome to read the public pages. Account, checkout and API routes stay out.
const AI_BOTS = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User', 'anthropic-ai',
  'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Googlebot', 'Bingbot', 'Applebot', 'Applebot-Extended',
  'DuckAssistBot', 'meta-externalagent', 'CCBot', 'cohere-ai', 'MistralAI-User', 'YouBot'];
const disallow = ['/thanks', '/api/', '/account'];

export default function robots() {
  return {
    rules: [{ userAgent: AI_BOTS, allow: '/', disallow }, { userAgent: '*', allow: '/', disallow }],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
