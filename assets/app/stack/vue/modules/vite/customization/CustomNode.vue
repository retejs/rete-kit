<template>
  <div class="node" :class="{ selected: data.selected }" :style="nodeStyles" data-testid="node">
    <div class="title" data-testid="title">{{ data.label }}</div>
    <!-- Outputs-->
    <div class="output" v-for="[key, output] in outputs" :key="key" :data-testid="'output-' + key">
      <div class="output-title" data-testid="output-title">{{ output.label }}</div>
      <div class="output-socket" :ref="el => onRef(el, key, output, 'output')" data-testid="output-socket"></div>
    </div>
    <!-- Controls-->
    <div class="control" v-for="[key, control] in controls" :key="key" :ref="el => onRef(el, key, control, 'control')"
      :data-testid="'control-' + key"></div>
    <!-- Inputs-->
    <div class="input" v-for="[key, input] in inputs" :key="key" :data-testid="'input-' + key">
      <div class="input-socket" :ref="el => onRef(el, key, input, 'input')" data-testid="input-socket"></div>
      <div class="input-title" v-show="!input.control || !input.showControl" data-testid="input-title">{{ input.label }}
      </div>
      <div class="input-control" v-show="input.control && input.showControl"
        :ref="el => onRef(el, key, input.control, 'control')" data-testid="input-control"></div>
    </div>
  </div>
</template>


<script lang="js">
import { defineComponent } from 'vue'

function sortByIndex(entries) {
  entries.sort((a, b) => {
    const ai = a[1] && a[1].index || 0
    const bi = b[1] && b[1].index || 0

    return ai - bi
  })
  return entries
}

export default defineComponent({
  props: ['data', 'emit'],
  methods: {
    onRef(element, key, entity, type) {
      if (!element) return

      if (['output', 'input'].includes(type)) {
        this.emit({
          type: 'render', data: {
            type: 'socket',
            side: type,
            key,
            nodeId: this.data.id,
            element,
            payload: entity.socket
          }
        })
      } else if (type === 'control') {
        this.emit({
          type: 'render', data: {
            type: 'control',
            element,
            payload: entity
          }
        })
      }
    }
  },
  computed: {
    nodeStyles() {
      return {
        width: Number.isFinite(this.data.width) ? `${this.data.width}px` : '',
        height: Number.isFinite(this.data.height) ? `${this.data.height}px` : ''
      }
    },
    inputs() {
      return sortByIndex(Object.entries(this.data.inputs))
    },
    controls() {
      return sortByIndex(Object.entries(this.data.controls))
    },
    outputs() {
      return sortByIndex(Object.entries(this.data.outputs))
    }
  }
})
</script>

<style lang="scss" scoped>
@use "sass:math";
@import "./vars";

.node {
  background: black;
  border: 2px solid grey;
  border-radius: 10px;
  cursor: pointer;
  box-sizing: border-box;
  width: $node-width;
  height: auto;
  padding-bottom: 6px;
  position: relative;
  user-select: none;

  &:hover {
    background: #333;
  }

  &.selected {
    border-color: red;
  }

  .title {
    color: white;
    font-family: sans-serif;
    font-size: 18px;
    padding: 8px;
  }

  .output {
    text-align: right;
  }

  .input {
    text-align: left;
  }

  .output-socket {
    text-align: right;
    margin-right: -1px;
    display: inline-block;
  }

  .input-socket {
    text-align: left;
    margin-left: -1px;
    display: inline-block;
  }

  .input-title,
  .output-title {
    vertical-align: middle;
    color: white;
    display: inline-block;
    font-family: sans-serif;
    font-size: 14px;
    margin: $socket-margin;
    line-height: $socket-size;
  }

  .input-control {
    z-index: 1;
    width: calc(100% - #{$socket-size + 2*$socket-margin});
    vertical-align: middle;
    display: inline-block;
  }

  .control {
    padding: $socket-margin math.div($socket-size, 2) + $socket-margin;
  }
}
</style>
