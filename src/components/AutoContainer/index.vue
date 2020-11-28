<template>
  <div id="auto-container" :ref="refName">
    <template v-if="ready">
      <slot />
    </template>
  </div>
</template>

<script>
import { ref, getCurrentInstance, onMounted, onUnmounted, nextTick } from 'vue'
import { debounce } from '../../utils'
export default {
  name: 'AutoContainer',
  props: {
    options: Object
  },
  setup(ctx) {
    const refName = 'autoContainer'
    const width = ref(0)
    const height = ref(0)
    const screenWidth = ref(0)
    const screenHeight = ref(0)
    const ready = ref(false)
    let context
    let dom
    let resizeChange
    let mutation

    onMounted(async () => {
      ready.value = false
      context = getCurrentInstance().ctx
      dom = context.$refs[refName]
      await initSize()
      updateSize()
      updateScale()

      resizeChange = debounce(async (e) => {
        await initSize()
        updateSize()
        updateScale()
      }, 100)
      onresize = resizeChange
      initMutationObserver()
      ready.value = true
    })

    onUnmounted(() => {
      onresize = null
      removeMutationObserver()
    })

    const initSize = () => {
      return new Promise((resolve) => { // 因为使用了 nextTick，防止后续的方法在此方法之前运行
        nextTick(() => { // 防止其他dom在同步渲染更新时可能出现的问题
          // 大盘的尺寸
          if (ctx.options && ctx.options.width && ctx.options.height) {
            width.value = ctx.options.width
            height.value = ctx.options.height
          } else {
            width.value = dom.clientWidth
            height.value = dom.clientHeight
          }
          // 画布的尺寸
          if (!screenWidth.value || ! screenWidth.value) {
            screenWidth.value = screen.width
            screenHeight.value = screen.height
          }
          resolve()
        })
      })
      
    }

    const updateSize = () => {
      if (width.value && height.value) {
        dom.style.width = `${width.value}px`
        dom.style.height = `${height.value}px`
      } else {
        dom.style.width = `${screenWidth.value}px`
        dom.style.height = `${screenHeight.value}px`
      }
    }

    const updateScale = () => {
      // 获取真实视口尺寸
      const currentWidth = document.body.clientWidth
      const currentHeight = document.body.clientHeight
      // 获取大屏最终尺寸
      const realWidth = width.value || screenWidth.value
      const realHeight = height.value || screenHeight.value
      // 缩放比
      const widthScale = currentWidth / realWidth
      const heightScale = currentHeight / realHeight
      dom && (dom.style.transform = `scale(${widthScale}, ${heightScale})`)
    }

    const initMutationObserver = () => { // 在外部组件修改 dom 属性时触发
      mutation = new MutationObserver(resizeChange)
      mutation.observe(dom, {
        attributes: true,
        attributeName: ['style'],
        attributeOldValue: true
      })
    }

    const removeMutationObserver = () => { // 移除属性监听
      if (mutation) {
        mutation.disconnect()
        mutation.takeRecords()
        mutation = null
      }
    }

    return {
      refName,
      ready
    }
  }
}
</script>

<style lang="scss" scoped>
#auto-container {
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
  transform-origin: left top; /* 将画面锁定到左上角 */
  z-index: 999;
}
</style>