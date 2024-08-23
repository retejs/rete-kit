<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <h1>Welcome to Your Vue.js + Rete.js App</h1>
    <div class="rete" ref="rete"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { createEditor } from './rete';

export default defineComponent({
  name: 'App',
  async mounted() {
    await createEditor(this.$refs.rete as HTMLElement)
  }
});
</script>

<style>
@import './common.css';
@import './customization/background.css';

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.rete {
  position: relative;
  width: 80vw;
  height: 90vh;
  font-size: 1rem;
  background: white;
  margin: 1em auto;
  border-radius: 1em;
  text-align: left;
  border: 3px solid #55b881;
}
</style>
