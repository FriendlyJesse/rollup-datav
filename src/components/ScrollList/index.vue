<template>
  <div class="scroll-list" :ref="refName">
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
    <div 
      class="scroll-list__rows"
      v-for="(rowData, rowIndex) in rowsData" 
      :key="rowIndex"
      :style="{
        height: `${rowHeights[rowIndex]}px`,
        backgroundColor: rowIndex % 2 === 0 ? rowBg[1] : rowBg[0]
      }"
    >
      <div class="scroll-list__columns"
        v-for="(columnData, columnIndex) in rowData"
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
</template>

<script>
import { ref, onMounted, getCurrentInstance } from 'vue'
import useScreen from '../../hooks/useScreen'
import cloneDeep from 'lodash/cloneDeep'
import assign from 'lodash/assign'

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
  rowStyle: {},
  rowIndexStyle: {
    width: '50px'
  },
  rowNum: 10,
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
    const refName = 'scrollList'
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
    const rowHeights = ref([])
    const rowNum = ref(defaultConfig.rowNum)
    const rowBg = ref([])
    const aligns = ref([])

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
          row.unshift(index + 1)
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
      rowsData.value = _rowsData
      rowStyle.value = _rowStyle
      aligns.value = _aligns
    }
    const handleRows = (config, height) => {
      const { headerHeight } = config
      const unuseHeight = height.value - headerHeight
      // 如果 rowNum 大于实际数据长度，则以实际数据长度为准
      if (rowNum.value > rowsData.value.length) {
        rowNum.value = rowsData.value.length
      }
      const avgHeight = unuseHeight / rowNum.value
      rowHeights.value = new Array(rowNum.value).fill(avgHeight)

      // 行背景色
      if (config.rowBg) {
        rowBg.value = config.rowBg
      }
    }

    onMounted(() => {
      const instance = getCurrentInstance()
      const dom = instance.ctx.$refs[refName]
      const { width, height } = useScreen(dom)
      const _actualConfig = assign(defaultConfig, config)
      rowsData.value = _actualConfig.data || []
      handleHeader(_actualConfig, width, height)
      handleRows(_actualConfig, height)
      actualConfig.value = _actualConfig
    })

    return {
      style,
      refName,
      headerStyle,
      columnWidths,
      headerData,
      rowsData,
      rowHeights,
      rowStyle,
      rowBg,
      aligns,
      actualConfig
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
  .scroll-list__rows {
    display: flex;
    .scroll-list__columns {
      font-size: 28px;
    }
  }
}
</style>