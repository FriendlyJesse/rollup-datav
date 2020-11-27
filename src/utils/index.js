export function debounce (callback, delay) {
  let task
  return function () {
    clearTimeout(task)
    task = setTimeout(() => {
      callback.apply(this, arguments)
    }, delay)
  }
}