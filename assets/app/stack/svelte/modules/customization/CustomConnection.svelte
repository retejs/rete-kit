<script lang="ts">
  import type { ClassicScheme } from "rete-svelte-plugin";
  type Position = { x: number; y: number };

  // svelte-ignore unused-export-let
  export let data: ClassicScheme["Connection"] & { isLoop?: boolean };
  // svelte-ignore unused-export-let
  export let start: Position;
  // svelte-ignore unused-export-let
  export let end: Position;
  export let path: string;
</script>

<svg data-testid="connection">
  <path d={path} />
</svg>

<style>
  /*! https://github.com/retejs/connection-plugin/commit/206ca0fd7fb82801ac45a0f7180ae05dff9ed901 */
  svg {
    overflow: visible !important;
    position: absolute;
    pointer-events: none;
    width: 9999px;
    height: 9999px;
  }

  svg path {
    fill: none;
    stroke-width: 5px;
    stroke: black;
    pointer-events: auto;
  }
</style>
