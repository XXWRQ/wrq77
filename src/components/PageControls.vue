<script setup lang="ts">
import { RouterLink } from 'vue-router';
import type { Locale } from '@/lib/site';

defineProps<{ locale: Locale; homeHref?: string; languageHref: string }>();
</script>

<template>
  <nav class="page-controls" :aria-label="locale === 'zh' ? '页面导航' : 'Page navigation'">
    <RouterLink v-if="homeHref" class="control-link home-control" :to="homeHref">
      <span aria-hidden="true">←</span>{{ locale === 'zh' ? '首页' : 'Home' }}
    </RouterLink>
    <RouterLink
      class="control-link language-control"
      :to="languageHref"
      :hreflang="locale === 'zh' ? 'en' : 'zh'"
      :aria-label="locale === 'zh' ? 'Switch to English' : '切换至中文'"
    >{{ locale === 'zh' ? 'EN' : '中文' }}</RouterLink>
  </nav>
</template>
