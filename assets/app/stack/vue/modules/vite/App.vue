<script lang="ts">
import { defineComponent } from 'vue';
import HelloWorld from './components/HelloWorld.vue'
import { createEditor } from './rete';

export default defineComponent({
  components: {
    HelloWorld
  },
  async mounted() {
    await createEditor(this.$refs.rete as HTMLElement)
  }
})
</script>

<template>
  <!-- <div id="app"> -->
  <header>
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />
    </div>
  </header>

  <main class="rete" ref="rete"></main>
  <!-- </div> -->
</template>

<style scoped>
@import './common.css';
@import './customization/background.css';

header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

.rete {
  position: relative;
  height: 90vh;
  font-size: 1rem;
  background: white;
  border-radius: 1em;
  text-align: left;
  border: 3px solid #55b881;
  line-height: 1;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
