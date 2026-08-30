<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

type Theme = 'day' | 'night';

const storageKey = 'personal-blog-theme';
const theme = ref<Theme>('day');

function preferredTheme(): Theme {
  const saved = localStorage.getItem(storageKey);
  if (saved === 'day' || saved === 'night') return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day';
}

function applyTheme(nextTheme: Theme, persist = false) {
  theme.value = nextTheme;
  document.documentElement.dataset.theme = nextTheme;
  document.documentElement.style.colorScheme = nextTheme === 'night' ? 'dark' : 'light';
  document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')?.setAttribute(
    'content',
    nextTheme === 'night' ? '#0d1210' : '#f1f3ee',
  );
  if (persist) localStorage.setItem(storageKey, nextTheme);
}

function toggleTheme() {
  applyTheme(theme.value === 'day' ? 'night' : 'day', true);
}

function syncTheme(event: StorageEvent) {
  if (event.key === storageKey) applyTheme(preferredTheme());
}

onMounted(() => {
  applyTheme(preferredTheme());
  window.addEventListener('storage', syncTheme);
});

onBeforeUnmount(() => window.removeEventListener('storage', syncTheme));
</script>

<template>
  <button
    class="theme-toggle"
    type="button"
    :aria-label="theme === 'day' ? '切换到深夜模式' : '切换到白天模式'"
    :title="theme === 'day' ? '深夜模式' : '白天模式'"
    :aria-pressed="theme === 'night'"
    @click="toggleTheme"
  >
    <svg v-if="theme === 'day'" class="theme-icon-moon" aria-hidden="true" viewBox="0 0 24 24">
      <path d="M20.4 15.4A8 8 0 0 1 8.6 3.6 8.5 8.5 0 1 0 20.4 15.4Z" />
    </svg>
    <svg v-else class="theme-icon-sun" aria-hidden="true" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  </button>
</template>
