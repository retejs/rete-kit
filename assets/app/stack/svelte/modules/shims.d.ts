declare module '*.svelte' {
    import type { Component } from 'svelte'

    // eslint-disable-next-line init-declarations
    const component: Component

    export default component
  }
