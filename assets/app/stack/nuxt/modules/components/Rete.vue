<template>
  <div class="rete" ref="rete"></div>
</template>

<script lang="ts">
import { createEditor } from '../rete';

export default {
  async mounted() {
    await createEditor(this.$refs.rete)
  }
}
</script>

<style scoped>
.rete {
  position: relative;
  width: 80vw;
  height: 90vh;
  font-size: 1rem;
  background: white;
  margin: 1em auto 3em auto;
  border-radius: 1em;
  text-align: left;
  border: 3px solid #55b881;
}
</style>
