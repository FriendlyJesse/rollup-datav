<template>
  <div class="test">
    {{message}}
  </div>
</template>

<script>
export default {
  name: 'TestComponent2',
  setup() {
    const message = 'hello world2!'
    return {
      message
    }
  }
}
</script>

<style lang="scss" scoped>
.test {
  color: yellow
}
</style>