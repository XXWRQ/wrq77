<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import HomeArchive from '@/src/components/HomeArchive.vue';
import PageControls from '@/src/components/PageControls.vue';
import { isLocale, profiles, ui, type Locale } from '@/lib/site';

const route = useRoute();
const locale = computed<Locale>(() => isLocale(String(route.params.locale)) ? String(route.params.locale) as Locale : 'zh');
const profile = computed(() => profiles[locale.value]);
const t = computed(() => ui[locale.value]);
</script>

<template>
  <main id="main-content" class="home-page">
    <PageControls :locale="locale" :language-href="`/${locale === 'zh' ? 'en' : 'zh'}`" />
    <HomeArchive :locale="locale" />
    <section class="home-hero">
      <div class="hero-copy">
        <p class="hero-role">{{ profile.name }}<span aria-hidden="true">/</span>{{ profile.role }}<span aria-hidden="true">/</span>{{ profile.location }}</p>
        <h1>{{ profile.headline }}</h1>
        <p class="hero-intro">{{ profile.intro }}</p>
        <div class="hero-actions">
          <RouterLink :to="`/${locale}/resume`" class="primary-link">{{ t.viewResume }}<span aria-hidden="true">↗</span></RouterLink>
          <RouterLink :to="`/${locale}/notes`" class="text-link">{{ t.readNotes }}<span aria-hidden="true">→</span></RouterLink>
        </div>
      </div>
      <aside class="identity-orbit" :aria-label="locale === 'zh' ? '个人信息占位' : 'Profile placeholder'">
        <div class="orbit-line" aria-hidden="true" />
        <div class="identity-mark" aria-hidden="true">{{ profile.initials }}</div>
        <div class="focus-note"><span>{{ t.currentFocus }}</span><p>{{ profile.focus }}</p></div>
      </aside>
    </section>
  </main>
</template>
