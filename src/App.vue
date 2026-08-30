<script setup lang="ts">
import { computed } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import HomeArchive from '@/src/components/HomeArchive.vue';
import ThemeToggle from '@/src/components/ThemeToggle.vue';
import { isLocale, type Locale } from '@/lib/site';

const route = useRoute();
const locale = computed<Locale>(() => {
  const rawLocale = String(route.params.locale ?? 'zh');
  return isLocale(rawLocale) ? rawLocale : 'zh';
});
</script>

<template>
  <a class="skip-link" href="#main-content">跳到主要内容</a>
  <HomeArchive :locale="locale" />
  <ThemeToggle />
  <RouterView />
</template>
