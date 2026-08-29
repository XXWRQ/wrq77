export const locales = ['zh', 'en'] as const;
export type Locale = (typeof locales)[number];

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

const vercelProductionOrigin = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : undefined;

export const siteOrigin =
  process.env.NEXT_PUBLIC_SITE_URL ??
  vercelProductionOrigin ??
  'https://personal-archive-notes.lofty-lamb-3655.chatgpt.site';

export const taxonomy = {
  categories: {
    methods: { zh: '方法', en: 'Methods' },
    design: { zh: '设计', en: 'Design' },
    learning: { zh: '学习', en: 'Learning' },
  },
  tags: {
    clarity: { zh: '清晰表达', en: 'Clarity' },
    practice: { zh: '实践', en: 'Practice' },
    systems: { zh: '系统思考', en: 'Systems' },
    reflection: { zh: '复盘', en: 'Reflection' },
  },
} as const;

export type CategoryId = keyof typeof taxonomy.categories;
export type TagId = keyof typeof taxonomy.tags;

export const profiles = {
  zh: {
    name: '你的名字', initials: 'YN', role: '产品与体验设计者', location: '中国 · 可远程协作',
    issue: '个人档案 · 第 01 期',
    headline: '把复杂的问题，整理成清晰的方向。',
    intro: '这是一份等待你填入真实经历的个人主页模板。它记录我做过的事、正在思考的问题，以及一路积累的方法。',
    focus: '产品思考、数字体验与持续学习。',
    bio: '我关注人与技术如何更自然地协作，并擅长从复杂信息中找到结构。这里的经历、成果与文章均为占位示例，方便你替换成自己的真实内容。',
    experience: [
      { period: '2023 — 现在', role: '高级产品设计师', company: '示例科技公司', summary: '负责复杂业务产品的体验策略，并推动跨职能团队从问题定义走向稳定交付。' },
      { period: '2020 — 2023', role: '产品设计师', company: '示例创意工作室', summary: '为早期产品建立信息架构、原型与可复用设计语言。' },
      { period: '2018 — 2020', role: '交互设计师', company: '示例数字团队', summary: '参与移动端与网页端产品设计，通过研究和实验持续改进关键流程。' },
    ],
    education: [{ period: '2014 — 2018', degree: '设计学学士', school: '示例大学' }],
    skills: ['产品策略', '用户研究', '信息架构', '交互设计', '内容设计', '设计系统'],
    achievements: ['将复杂流程重构为更清晰的三步体验（示例）', '建立跨团队共用的设计原则与组件规范（示例）', '持续记录方法、复盘与实践中的新问题（示例）'],
    socials: [] as { label: string; url: string }[],
  },
  en: {
    name: 'Your Name', initials: 'YN', role: 'Product & Experience Designer', location: 'China · Open to remote collaboration',
    issue: 'Personal Archive · Issue 01',
    headline: 'Turning complex questions into clear direction.',
    intro: 'A personal-site template waiting for your real story—work I have done, questions I am exploring, and methods collected along the way.',
    focus: 'Product thinking, digital experiences, and lifelong learning.',
    bio: 'I care about making collaboration between people and technology feel more natural. The experience, achievements, and notes here are clear placeholders, ready to be replaced with your real story.',
    experience: [
      { period: '2023 — Present', role: 'Senior Product Designer', company: 'Example Technology Company', summary: 'Led experience strategy for complex products and helped cross-functional teams move from problem framing to dependable delivery.' },
      { period: '2020 — 2023', role: 'Product Designer', company: 'Example Creative Studio', summary: 'Built information architecture, prototypes, and a reusable design language for early-stage products.' },
      { period: '2018 — 2020', role: 'Interaction Designer', company: 'Example Digital Team', summary: 'Designed mobile and web experiences, improving core journeys through research and experimentation.' },
    ],
    education: [{ period: '2014 — 2018', degree: 'B.Des. in Design', school: 'Example University' }],
    skills: ['Product strategy', 'User research', 'Information architecture', 'Interaction design', 'Content design', 'Design systems'],
    achievements: ['Reframed a complex flow into a clear three-step experience (example)', 'Established shared design principles and component guidelines (example)', 'Maintained an ongoing practice of notes, reflection, and inquiry (example)'],
    socials: [] as { label: string; url: string }[],
  },
} as const;

export const ui = {
  zh: {
    home: '首页', resume: '简历', notes: '文章', about: '关于', experience: '经历', language: 'EN',
    viewResume: '浏览网页简历', readNotes: '阅读文章', currentFocus: '当前关注', featured: '精选记录',
    latestExperience: '最近经历', selectedNotes: '代表文章', allNotes: '查看全部文章',
    resumeTitle: '经历不是清单，而是问题、选择与结果。', resumeIntro: '以下内容均为占位示例。替换结构化资料后，页面会自动同步。',
    workExperience: '工作经历', education: '教育经历', capabilities: '能力', achievements: '代表成果',
    notesTitle: '关于实践、系统与清晰表达的记录。', notesIntro: '这里收录正在形成的方法与思考。每篇公开文章都维护中英文版本。',
    all: '全部', categories: '分类', tags: '标签', clear: '清除筛选', noResults: '没有符合当前筛选的文章。', reset: '查看全部文章',
    minRead: '分钟阅读', contents: '目录', backToNotes: '返回文章列表', nextLanguage: 'Read in English',
    placeholder: '占位内容', footer: '一份仍在生长的个人档案。', lastUpdated: '最后更新',
  },
  en: {
    home: 'Home', resume: 'Résumé', notes: 'Notes', about: 'About', experience: 'Experience', language: '中',
    viewResume: 'View résumé', readNotes: 'Read notes', currentFocus: 'Current focus', featured: 'Featured note',
    latestExperience: 'Recent experience', selectedNotes: 'Selected notes', allNotes: 'View all notes',
    resumeTitle: 'Experience is more than a list—it is a record of questions, choices, and outcomes.', resumeIntro: 'Everything below is placeholder content. Update the structured profile data and the page will follow.',
    workExperience: 'Experience', education: 'Education', capabilities: 'Capabilities', achievements: 'Selected outcomes',
    notesTitle: 'Notes on practice, systems, and making things clear.', notesIntro: 'A growing collection of methods and reflections. Every published note is maintained in both languages.',
    all: 'All', categories: 'Categories', tags: 'Tags', clear: 'Clear filters', noResults: 'No notes match the current filters.', reset: 'View all notes',
    minRead: 'min read', contents: 'Contents', backToNotes: 'Back to notes', nextLanguage: '中文阅读',
    placeholder: 'Placeholder content', footer: 'A personal archive, still in progress.', lastUpdated: 'Last updated',
  },
} as const;

export function formatDate(date: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === 'zh' ? 'zh-CN' : 'en-GB', {
    year: 'numeric', month: locale === 'zh' ? 'long' : 'short', day: 'numeric', timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`));
}
