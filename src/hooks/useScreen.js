import { ref } from 'vue'

export default function useScreen (dom) {
  const width = ref(0)
  const height = ref(0)

  width.value = dom.clientWidth
  height.value = dom.clientHeight

  return {
    width,
    height
  }
}