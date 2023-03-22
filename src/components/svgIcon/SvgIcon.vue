<script setup>
import { computed } from 'vue'

const modules = import.meta.glob('@/assets/svg/*.svg', {
  as: 'component',
  eager: true,
})
const props = defineProps({
  name: String,
  size: {
    type: String,
    default: '1em'
  }
})
const currentComponent = computed(() => {
  const fileName = '/' + props.name + '.svg'
  for (const path in modules) {
    const mod = modules[path]
    if (path.endsWith(fileName)) {
      return mod
    }
  }
  throw new Error('not found svg file:' + fileName)
})
</script>

<template>
  <component :is="currentComponent" :width="size" :height="size" />
</template>

<style lang="pcss" scoped>
svg{
  fill: currentColor;
}
</style>
