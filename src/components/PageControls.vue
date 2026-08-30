<script setup lang="ts">
import { RouterLink } from 'vue-router';

defineProps<{ homeHref?: string }>();
</script>

<template>
  <nav v-if="homeHref" class="page-controls" aria-label="页面导航">
    <RouterLink v-if="homeHref" class="control-link home-control" :to="homeHref">
      <span aria-hidden="true">←</span>首页
    </RouterLink>
  </nav>
</template>
