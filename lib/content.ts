import { marked } from 'marked';
import { taxonomy, type CategoryId, type Locale, type TagId } from '@/lib/site';

export type Article = {
  locale: Locale;
  translationKey: string;
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  updatedAt?: string;
  category: CategoryId;
  tags: TagId[];
  draft: boolean;
  readingMinutes: number;
  body: string;
};

export type TocItem = { id: string; title: string; depth: 2 | 3 };

const noteFiles = import.meta.glob('/content/notes/**/*.md', {
  query: '?raw', import: 'default', eager: true,
}) as Record<string, string>;

function normalizeDate(value: unknown) {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value);
}

function parseFrontmatter(source: string) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(source);
  if (!match) throw new Error('Markdown file is missing YAML frontmatter');
  const data: Record<string, unknown> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const separator = line.indexOf(':');
    if (separator < 1) continue;
    const key = line.slice(0, separator).trim();
    const raw = line.slice(separator + 1).trim();
    if (raw.startsWith('[') && raw.endsWith(']')) {
      data[key] = raw.slice(1, -1).split(',').map((item) => item.trim()).filter(Boolean);
    } else if (raw === 'true' || raw === 'false') {
      data[key] = raw === 'true';
    } else if (/^\d+$/.test(raw)) {
      data[key] = Number(raw);
    } else {
      data[key] = raw.replace(/^['"]|['"]$/g, '');
    }
  }
  return { data, content: match[2] };
}

function parseArticle(path: string, source: string): Article {
  const { data, content } = parseFrontmatter(source);
  const slug = path.split('/').pop()?.replace(/\.md$/, '') ?? '';
  const locale = data.locale as Locale;
  const category = data.category as CategoryId;
  const tags = (data.tags ?? []) as TagId[];
  if (!['zh', 'en'].includes(locale)) throw new Error(`Invalid locale in ${path}`);
  if (!(category in taxonomy.categories)) throw new Error(`Invalid category in ${path}`);
  for (const tag of tags) if (!(tag in taxonomy.tags)) throw new Error(`Invalid tag “${tag}” in ${path}`);
  for (const field of ['translationKey', 'title', 'excerpt', 'publishedAt']) {
    if (!data[field]) throw new Error(`Missing ${field} in ${path}`);
  }
  return {
    locale, translationKey: String(data.translationKey), slug, title: String(data.title),
    excerpt: String(data.excerpt), publishedAt: normalizeDate(data.publishedAt),
    updatedAt: data.updatedAt ? normalizeDate(data.updatedAt) : undefined,
    category, tags, draft: Boolean(data.draft), readingMinutes: Number(data.readingMinutes ?? 5), body: content.trim(),
  };
}

const allArticles = Object.entries(noteFiles).map(([path, source]) => parseArticle(path, source));

function validatePublishedPairs() {
  const seen = new Set<string>();
  const byKey = new Map<string, Set<Locale>>();
  for (const article of allArticles.filter((item) => !item.draft)) {
    const uniqueKey = `${article.locale}:${article.translationKey}`;
    if (seen.has(uniqueKey)) throw new Error(`Duplicate published translation key: ${uniqueKey}`);
    seen.add(uniqueKey);
    const pair = byKey.get(article.translationKey) ?? new Set<Locale>();
    pair.add(article.locale);
    byKey.set(article.translationKey, pair);
  }
  for (const [key, pair] of byKey) {
    if (!pair.has('zh') || !pair.has('en')) throw new Error(`Published article “${key}” must have zh and en versions`);
  }
}

validatePublishedPairs();

export function getArticles(locale: Locale) {
  return allArticles
    .filter((article) => article.locale === locale && !article.draft)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getArticle(locale: Locale, slug: string) {
  return getArticles(locale).find((article) => article.slug === slug);
}

export function getTranslation(article: Article, locale: Locale) {
  return getArticles(locale).find((candidate) => candidate.translationKey === article.translationKey);
}

function plainHeading(value: string) {
  return value.replace(/[`*_~\[\]]/g, '').replace(/\([^)]*\)/g, '').trim();
}

function slugify(value: string) {
  return value.normalize('NFKD').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '') || 'section';
}

export function renderMarkdown(body: string): { html: string; toc: TocItem[] } {
  const toc: TocItem[] = [];
  const counts = new Map<string, number>();
  const withAnchors = body.split('\n').map((line) => {
    const match = /^(#{2,3})\s+(.+)$/.exec(line);
    if (!match) return line;
    const title = plainHeading(match[2]);
    const base = slugify(title);
    const count = counts.get(base) ?? 0;
    counts.set(base, count + 1);
    const id = count === 0 ? base : `${base}-${count + 1}`;
    toc.push({ id, title, depth: match[1].length as 2 | 3 });
    return `<span id="${id}" class="heading-anchor" aria-hidden="true"></span>\n${line}`;
  }).join('\n');
  const html = marked.parse(withAnchors, { gfm: true, breaks: false }) as string;
  return { html, toc };
}
