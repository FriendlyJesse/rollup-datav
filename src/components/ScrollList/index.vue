<template>
  <div class="scroll-list" :id="id">
    <div 
      class="scroll-list__header" 
      :style="style"
    >
      <div
        class="scroll-list__header-item scroll-list-text" 
        v-for="(headerItem, i) in headerData" 
        :key="headerItem + i"
        :style="{
          width: `${columnWidths[i]}px`, 
          textAlign: aligns[i],
          fontSize: `${actualConfig.headerFontSize}px`,
          color: actualConfig.headerColor,
          ...headerStyle[i]
        }"
        v-html="headerItem"
      />
    </div>
    <div class="scroll-list__rows-wrapper"
      :style="{
        height: `${wrapperHeight - actualConfig.headerHeight}px`
      }"
    >
      <div 
        class="scroll-list__rows"
        v-for="(rowData, index) in currentRowsData" 
        :key="rowData.rowIndex"
        :style="{
          height: `${rowHeights[index]}px`,
          lineHeight: `${rowHeights[index]}px`,
          backgroundColor: rowData.rowIndex % 2 === 0 ? rowBg[1] : rowBg[0]
        }"
      >
        <!-- 使用 scroll-list-text 使得元素不能换行 -->
        <div class="scroll-list__columns scroll-list-text"
          v-for="(columnData, columnIndex) in rowData.data"
          :key="columnData + columnIndex"
          :style="{
            width: `${columnWidths[columnIndex]}px`,
            textAlign: aligns[columnIndex],
            fontSize: `${actualConfig.rowFontSize}px`,
            color: actualConfig.rowColor,
            ...rowStyle[columnIndex]
          }"
          v-html="columnData"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import useScreen from '../../hooks/useScreen'
import cloneDeep from 'lodash/cloneDeep'
import assign from 'lodash/assign'
import { v4 as uuidv4 } from 'uuid'

const defaultConfig = {
  headerData: [],
  headerStyle: [],
  headerBg: 'rgb(90, 90, 90)',
  headerHeight: 35,
  headerIndex: true,
  headerIndexContent: '#',
  headerIndexStyle: {
    width: '50px'
  },
  headerFontSize: 28,
  headerColor: 'white',
  rowStyle: [],
  rowIndexStyle: {
    width: '50px'
  },
  rowNum: 10,
  moveNum: 1, // 移动间隔
  duration: 2000, // 动画延迟时间
  rowBg: [],
  rowFontSize: 28,
  rowColor: 'black',
  data: []
}

export default {
  name: 'ScrollList',
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          headerData: [],
          headerStyle: [],
          headerBg: 'rgb(90, 90, 90)',
          headerHeight: 35,
          headerIndex: true,
          headerIndexContent: '#',
          headerIndexStyle: {
            width: '50px'
          },
          data: [],
          rowNum: defaultConfig.rowNum
        }
      }
    }
  },
  setup (ctx) {
    const id = `base-scroll-list-${uuidv4()}`
    const { width, height } = useScreen(id)
    const { config } = ctx
    const style = {
      background: config.headerBg,
      height: `${config.headerHeight}px`
    }
    const actualConfig = ref([])
    const headerData = ref([])
    const headerStyle = ref([])
    const rowStyle = ref([])
    const columnWidths = ref([])
    const rowsData = ref([])
    const currentRowsData = ref([])
    const currentIndex = ref(0) // 动画指针
    const rowHeights = ref([])
    const rowNum = ref(defaultConfig.rowNum)
    const rowBg = ref([])
    const aligns = ref([])
    const wrapperHeight = ref(0)
    let avgHeight = 0
    const isAnimationStart = ref(true)

    const handleHeader = (config, width, height) => {
      const _headerData = cloneDeep(config.headerData)
      const _headerStyle = cloneDeep(config.headerStyle)
      const _rowsData = cloneDeep(config.data)
      const _rowStyle = cloneDeep(config.rowStyle)
      const _aligns = cloneDeep(config.aligns)

      if (!_headerData.length) return
      if (config.headerIndex) {
        _headerData.unshift(config.headerIndexContent)
        _headerStyle.unshift(config.headerIndexStyle)
        _rowStyle.unshift(config.rowIndexStyle)
        _rowsData.map((row, index) => {
          if (config.headerIndexData && config.headerIndexData.length > 0 && config.headerIndexData[index]) {
            row.unshift(config.headerIndexData[index])
          } else {
            row.unshift(index + 1)
          }
        })
        _aligns.unshift('center')
      }

      // 动态计算header中每一列的宽度
      let usedWidth = 0
      let usedColumNum = 0
      // 判断是否自定义 width
      _headerStyle.forEach((style) => {
        // 如果自定义了 width，则按照自定义 width 进行判断
        if (style.width) {
          usedWidth += +style.width.replace('px', '')
          usedColumNum++
        }
      })
      // 动态计算列宽时，使用剩余宽度除以剩余的列数
      const avgWidth = (width.value - usedWidth) / (_headerData.length - usedColumNum)
      const _columnWidths = new Array(_headerData.length).fill(avgWidth)
      
      // prop 覆盖 columns
      _headerStyle.forEach((style, index) => {
        if (style.width) {
          const headerWidth = +style.width.replace('px', '')
          _columnWidths[index] = headerWidth
        }
      })

      columnWidths.value = _columnWidths
      headerData.value = _headerData
      headerStyle.value = _headerStyle
      rowStyle.value = _rowStyle
      aligns.value = _aligns

      const { rowNum } = config
      if (_rowsData.length >= rowNum && _rowsData.length < rowNum * 2) {
        const newRowData = [..._rowsData, ..._rowsData]
        rowsData.value = newRowData.map((item, index) => ({data: item, rowIndex: index}))
      } else {
        rowsData.value = _rowsData.map((item, index) => ({data: item, rowIndex: index}))
      }
    }

    const handleRows = (config, height) => {
      const { headerHeight } = config
      const unuseHeight = height.value - headerHeight
      // 如果 rowNum 大于实际数据长度，则以实际数据长度为准
      if (rowNum.value > rowsData.value.length) {
        rowNum.value = rowsData.value.length
      }
      avgHeight = unuseHeight / rowNum.value
      rowHeights.value = new Array(rowNum.value).fill(avgHeight)

      // 行背景色
      if (config.rowBg) {
        rowBg.value = config.rowBg
      }
    }

    const startAnimation = async () => {
      if (!isAnimationStart) return
      const config = actualConfig.value
      const { data, rowNum, moveNum, duration } = config
      const totalLength = rowsData.value.length
      if (totalLength < rowNum) return
      const index = currentIndex.value
      const _rowsData = cloneDeep(rowsData.value)
      // 将数据重新头尾连接
      const rows = _rowsData.slice(index)
      rows.push(..._rowsData.slice(0, index))
      currentRowsData.value = rows

      // 将所有行的高度还原
      rowHeights.value = new Array(totalLength).fill(avgHeight)

      // 行高清空时间
      const waitTime = 300
      if (!isAnimationStart) return
      await new Promise(resolve => setTimeout(resolve, waitTime))

      // 将 moveNum 的行高度设置为0
      rowHeights.value.splice(0, moveNum, ...new Array(moveNum).fill(0))

      currentIndex.value += moveNum
      // 是否到达最后一组数据
      const Last = currentIndex.value - totalLength
      if (Last >= 0) {
        currentIndex.value = Last
      }
      // 延迟操作
      if (!isAnimationStart) return
      await new Promise(resolve => setTimeout(resolve, duration - waitTime))
      if (!isAnimationStart) return
      startAnimation()
    }

    const stopAnimation = () => {
      isAnimationStart.value = false
    }

    const update = () => {
      stopAnimation()
      const _actualConfig = assign(defaultConfig, ctx.config)
      wrapperHeight.value = height.value
      rowsData.value = _actualConfig.data || []
      handleHeader(_actualConfig, width, height)
      handleRows(_actualConfig, height)
      actualConfig.value = _actualConfig
      // 启动动画
      isAnimationStart.value = true
      startAnimation()
    }

    watch(() => ctx.config, () => {
      update()
    })


    return {
      id,
      style,
      headerStyle,
      columnWidths,
      headerData,
      rowsData,
      rowHeights,
      rowStyle,
      rowBg,
      aligns,
      actualConfig,
      currentRowsData,
      wrapperHeight
    }
  }
}
</script>

<style lang="scss" scoped>
.scroll-list {
  width: 100%;
  height: 100%;
  .scroll-list-text {
    box-sizing: border-box;
    padding: 0 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .scroll-list__header {
    display: flex;
    align-items: center;
    font-size: 15px;
  }
  .scroll-list__rows-wrapper {
    overflow: hidden;
    .scroll-list__rows {
      display: flex;
      align-items: center;
      transition: all 0.3s linear;
      .scroll-list__columns {
        height: 100%;
      }
    }
  }
}
</style>