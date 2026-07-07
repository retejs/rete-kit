<template>
  <div class="page">
    <NuxtWelcome />
    <ClientOnly>
      <Rete />
    </ClientOnly>
  </div>
</template>

<script lang="ts">
import Rete from './components/Rete.vue'

export default {
  components: {
    Rete
  },
}
</script>

<style scoped>
.page :deep(.min-h-screen) {
  min-height: auto;
}

.page :deep(.py-14) {
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
}

.page :deep(.grid) {
  display: none;
}

.page :deep(footer) {
  display: none;
}
</style>
