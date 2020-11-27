<template>
  <div class="fly-box" :ref="refName">
    <svg :width="width" :height="height">
      <defs>
        <path
          :id="pathId"
          :d="path"
          fill="none"
        />
        <radialGradient 
          :id="readialGradientId"
          cx="50%"
          cy="50%"
          fx="100%"
          fy="50%"
          r="50%"
        >
          <stop offset="0%" stop-color="white" stop-opacity="1" />
          <stop offset="100%" stop-color="white" stop-opacity="0" />
        </radialGradient>
        <mask :id="maskId">
          <circle cx="0" cy="0" :r="starLength" :fill="`url(#${readialGradientId})`">
            <animateMotion 
              :path="path" 
              :dur="`${duration}s`"
              rotate="0"
              repeatCount="indefinite"
            />
          </circle>
        </mask>
      </defs>
      <use
        :href="`#${pathId}`"
        stroke-width="1"
        :stroke="lineColor"
      />
      <use
        :href="`#${pathId}`" 
        stroke-width="3"
        :stroke="starColor"
        :mask="`url(#${maskId})`"
      />
    </svg>
    <div class="fly-box__content">
      <slot />
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, getCurrentInstance } from 'vue'
import { v4 as uuidv4 } from 'uuid'

export default {
  name: 'FlyBox',
  props: {
    lineColor: {
      type: String,
      default: '#235fa7'
    },
    starColor: {
      type: String,
      default: '#4fd2dd'
    },
    starLength: {
      type: [String, Number],
      default: 50
    },
    duration: {
      type: [String, Number],
      default: 2
    }
  },
  setup(ctx) {
    const uuid = uuidv4() // 使用 uuid 生成不同的id，提供给组件使用，避开使用同一个组件的相互干扰
    const width = ref(0)
    const height= ref(0)
    const refName = 'flyBox'
    const pathId = `${refName}-path-${uuid}`
    const readialGradientId = `${refName}-gradient-${uuid}`
    const maskId = `${refName}-maskId-${uuid}`
    const path = computed(() => `M5 5 L${width.value - 5} 5 L${width.value - 5} ${height.value - 5} L5 ${height.value - 5} Z`)

    onMounted(() => {
      init()
    })

    const init = () => {
      const instance = getCurrentInstance()
      const dom = instance.ctx.$refs[refName]
      width.value = dom.clientWidth
      height.value = dom.clientHeight
    }

    return {
      width,
      height,
      refName,
      path,
      pathId,
      readialGradientId,
      maskId
    }
  }
}
</script>

<style lang="scss" scoped>
.fly-box {
  position: relative;
  width: 100%;
  height: 100%;
  svg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .fly-box__content {
    padding: 5px;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
  }
}
</style>