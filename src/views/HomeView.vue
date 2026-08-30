<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { isLocale, profiles, ui, type Locale } from '@/lib/site';

const route = useRoute();
const locale = computed<Locale>(() => isLocale(String(route.params.locale)) ? String(route.params.locale) as Locale : 'zh');
const profile = computed(() => profiles[locale.value]);
const t = computed(() => ui[locale.value]);
const portraitSrc = '/profile-portrait-cutout.png';
const headline = computed(() => locale.value === 'zh' ? '我不是码神' : profile.value.headline);
const intro = computed(() => locale.value === 'zh' ? '既然没有成就，那就努力奋斗！' : profile.value.intro);
</script>

<template>
  <main id="main-content" class="home-page" :class="{ 'home-page-zh': locale === 'zh' }">
    <section class="home-hero">
      <div class="hero-copy">
        <p v-if="locale !== 'zh'" class="hero-role">{{ profile.name }}<span aria-hidden="true">/</span>{{ profile.role }}<span aria-hidden="true">/</span>{{ profile.location }}</p>
        <h1>{{ headline }}</h1>
        <p class="hero-intro">{{ intro }}</p>
        <div class="hero-actions">
          <RouterLink :to="`/${locale}/resume`" class="primary-link">{{ locale === 'zh' ? '深入了解一下啦~' : t.viewResume }}<span v-if="locale !== 'zh'" aria-hidden="true">↗</span></RouterLink>
          <RouterLink :to="`/${locale}/notes`" class="text-link">
            {{ locale === 'zh' ? '知识库' : t.readNotes }}<span v-if="locale !== 'zh'" aria-hidden="true">→</span>
          </RouterLink>
        </div>
      </div>
      <aside class="identity-orbit" :aria-label="locale === 'zh' ? '个人信息占位' : 'Profile placeholder'">
        <div v-if="locale !== 'zh'" class="orbit-line" aria-hidden="true" />
        <div class="identity-mark" :class="{ 'identity-mark-empty': locale === 'zh' }" aria-hidden="true">
          <img v-if="locale === 'zh' && portraitSrc" :src="portraitSrc" alt="" />
          <span v-else-if="locale !== 'zh'">{{ profile.initials }}</span>
        </div>
        <div v-if="locale !== 'zh'" class="focus-note"><span>{{ t.currentFocus }}</span><p>{{ profile.focus }}</p></div>
      </aside>
    </section>
  </main>
</template>
