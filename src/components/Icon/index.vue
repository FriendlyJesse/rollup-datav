<template>
  <svg class="icon">
    <use :href="iconName"></use>
  </svg>
</template>

<script>
export default {
  name: 'Icon',
  props: {
    name: String,
    prefix: {
      type: String,
      default: ''
    },
    style: Object
  },
  setup(ctx) {
    const iconName = `#${ctx.prefix + ctx.name}`
    return {
      iconName
    }
  }
}
</script>

<style lang="scss" scoped>
.icon {
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>