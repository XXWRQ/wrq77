type MermaidApi = {
  initialize: (config: Record<string, unknown>) => void;
  run: (options: { nodes: HTMLElement[] }) => Promise<void>;
};

declare global {
  interface Window {
    mermaid?: MermaidApi;
  }
}

let mermaidLoader: Promise<MermaidApi> | undefined;

function loadMermaid() {
  if (window.mermaid) return Promise.resolve(window.mermaid);
  if (mermaidLoader) return mermaidLoader;

  mermaidLoader = new Promise<MermaidApi>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-mermaid-runtime]');
    const script = existing ?? document.createElement('script');

    const handleLoad = () => {
      if (!window.mermaid) {
        reject(new Error('Mermaid runtime loaded without an API'));
        return;
      }
      resolve(window.mermaid);
    };

    script.addEventListener('load', handleLoad, { once: true });
    script.addEventListener('error', () => reject(new Error('Failed to load Mermaid runtime')), { once: true });

    if (!existing) {
      script.src = '/vendor/mermaid.min.js';
      script.defer = true;
      script.dataset.mermaidRuntime = '';
      document.head.appendChild(script);
    }
  });

  return mermaidLoader;
}

function makeDiagramReadable(diagram: HTMLElement) {
  const svg = diagram.querySelector<SVGSVGElement>('svg');
  if (!svg) return;

  const viewBoxWidth = svg.viewBox.baseVal.width;
  const displayWidth = Math.round(Math.max(720, Math.min(viewBoxWidth || 720, 1400)));
  svg.style.width = `${displayWidth}px`;
  svg.style.height = 'auto';
  svg.style.maxWidth = 'none';
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', '技术流程图');
}

export async function renderMermaidDiagrams(root: HTMLElement) {
  root.querySelectorAll<HTMLElement>('pre > code.language-mermaid').forEach((code) => {
    code.parentElement?.classList.add('mermaid');
  });
  const diagrams = Array.from(root.querySelectorAll<HTMLElement>('pre.mermaid:not([data-processed="true"])'));
  if (!diagrams.length) return;

  const mermaid = await loadMermaid();
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'strict',
    theme: 'base',
    themeVariables: {
      background: '#f4f6f1',
      primaryColor: '#edf4ef',
      primaryTextColor: '#101713',
      primaryBorderColor: '#0c6b52',
      lineColor: '#53645b',
      secondaryColor: '#f7efe4',
      tertiaryColor: '#eef1ec',
      fontFamily: 'Inter, "Noto Sans SC", system-ui, sans-serif',
      fontSize: '16px',
    },
    flowchart: { htmlLabels: true, curve: 'basis' },
  });

  for (const diagram of diagrams) {
    const code = diagram.querySelector(':scope > code');
    if (code) diagram.textContent = code.textContent?.trim() ?? '';
    diagram.classList.add('mermaid-loading');

    try {
      await mermaid.run({ nodes: [diagram] });
      makeDiagramReadable(diagram);
      diagram.classList.remove('mermaid-loading');
    } catch {
      diagram.classList.remove('mermaid-loading');
      diagram.classList.add('mermaid-render-error');
      diagram.textContent = '该技术图表暂时无法渲染。';
    }
  }
}
